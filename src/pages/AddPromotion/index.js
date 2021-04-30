import React, { useState, useEffect } from "react";
import axios from "axios";

import { 
	Layout,
	Form, 
	Input, 
	Button, 
	Switch,
	Select,
	Row, 
	Col,
	message,
	Spin,
	Tooltip,
	Table
} from 'antd';
import {
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import '../../global.css';

import HeaderSite from "../../components/Header";
import MenuSite from "../../components/Menu";
import FooterSite from "../../components/Footer";

const { Content } = Layout;
const { TextArea } = Input;
const { Option } = Select;

const BASE_URL = "http://localhost:4020/";

function AddPromotion() {
	const [form] = Form.useForm();
	const [expand, setExpand] = useState(false);
	const [loading, setLoading] = useState(false);
	const [dataTable, setDataTable] = useState([]);

	const [dataCategory, setDataCategory] = useState([]);
	const [dataFlavor, setDataFlavor] = useState([]);
	const [dataProductsFilter, setDataProductsFilter] = useState([]);

	const [idCategoryProductPromotion, setIdCategoryProductPromotion] = useState(null);

	useEffect(() => {
		axios.get(BASE_URL+"category").then((response) => {
			setDataCategory(response?.data);						
		}).catch((error) => {
			console.log("BUGOU: "+ error);
		});
	}, []);


	const getFlavorsByCategory = async (idCategory) => {
		setLoading(true);
		setIdCategoryProductPromotion(idCategory);
		await axios.get(BASE_URL+"flavor/byCategory/"+idCategory).then((response) => {
			setDataFlavor(response?.data);					
		}).catch((error) => {
			console.log("BUGOU: "+ error);
		});
		setLoading(false);
	}

	const getProductsByCategoryAndFlavor = async (idFlavor) => {
		setLoading(true);
		await axios.get(BASE_URL+"product/others/"+idCategoryProductPromotion+"/"+idFlavor).then((response) => {
			setDataProductsFilter(response?.data);								
		}).catch((error) => {
			console.log("BUGOU: "+ error);
		});
		setLoading(false);
	}

	const columns = [
	  { title: 'Nome do produto', dataIndex: 'name_product', key: 'name_product' },
	  { title: 'Preço original (R$)', dataIndex: 'price_product', key: 'price_product' },
	  { title: 'Preço promocional (R$)', dataIndex: 'price_promotion', key: 'price_promotion' },
	  { title: 'Desconto (R$)', dataIndex: 'discount', key: 'discount' },
  	  {
	    title: 'Ações',
	    dataIndex: '',
	    key: 'x',
	    render: (__, record) => {
	    	return(
	    		<div>
	    			<Tooltip placement="top" title='Deletar promoção'>
	    				<DeleteOutlined className="icon-table" onClick={() => deleteLineTable(record?.key)}/>
	    			</Tooltip>
	    		</div>
	    	)
	    },
  	  },
    ];


    const deleteLineTable = (key) => {
    	const newDataTable = dataTable?.filter((item) => item?.key !== key);
    	setDataTable(newDataTable);
    }

    const insertLineTable = () => {
    	setLoading(true);

    	const idProduct = form.getFieldValue("name_product");
    	const pricePromotion = form.getFieldValue("price_promotion");

    	if(idProduct && pricePromotion){

    		//verificando se o produto selecionado já está na promoção.
    		const flag = dataTable?.filter((item) => item?.key === idProduct).length !== 0 ? true : false;
    		
    		if(!flag){
				const product = dataProductsFilter?.filter((item) => item?.id_product === idProduct)[0];
	    		let line = {
		    		key: idProduct,
		    		name_product: product?.name_product,
		    		price_product: product?.price,
		    		price_promotion: parseFloat(pricePromotion),
		    		discount: (product?.price) - parseFloat(pricePromotion),
	    		}
	    		setDataTable([...dataTable, line]);
	    		form.setFieldsValue({
	    			category: null,
	    			flavor: null,
		    		name_product: null,
		    		price_promotion: null
    			});

    		}else{
    			message.error("Este produto já está inserido na promoção!");
    		}
    		setLoading(false);
    	}else{
    		setLoading(false);
    		message.error("Informe os campos pedidos para poder inserir o produto na promoção!");
    	}

    	
    }


    const onSavePromotion = async (values) => {
    	setLoading(true);

    	//array de produtos inseridos na promoção
    	let array = [];
    	dataTable?.map((item) => {
    		array.push({
    			id_product: item?.key,
    			price_promotion: item?.price_promotion,
    			is_active: true
    		})
    	})

    	if(values?.name_promotion){
			if(array.length !== 0){
				const response = await axios.post(BASE_URL+"promotion",
					{
						name_promotion: values?.name_promotion, 
						is_active: values?.is_active !== undefined ? values?.is_active:true, 
						description: values?.description || null,
						products: array
					}
				);

				console.log(response);

				setLoading(false);
				if(response?.status === 200){
					message.success(response?.data?.message);
					form.resetFields();
					setDataTable([]);
				}else{
					message.error(response?.data?.message);
				}

			}else{
				message.error("Insira produtos na sua promoção !");
			}
			
		}else{
			setLoading(false);
			message.error("Informe o nome da promoção, por favor !");
		}

    	setLoading(false);
    }
	


	return (
		<div>
			<Spin size="large" spinning={loading}>
				<Layout>
					<MenuSite open={expand} />
			        <Layout className="site-layout">
			          <HeaderSite title={'Cadastro de promoção'} isListView={false} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
			          <Content className="container-main">

				      	<Form layout="vertical" form={form} onFinish={onSavePromotion}>   			  
					        <Row gutter={[8, 0]}>

						      	<Col span={20}>
									<Form.Item label="Nome" name="name_promotion">
							          <Input className="input-radius"/>
							        </Form.Item>
						      	</Col>

						      	<Col span={4}>
									<Form.Item label="Status" name="is_active">
							          <Switch defaultChecked/>
							        </Form.Item>
						      	</Col>

						      	<Col span={24}>
							      	<Form.Item label="Descrição" name="description">
							      	  <TextArea rows={4} className="input-radius"/>
							        </Form.Item>
							    </Col>

							    <Col span={5}>
									<Form.Item label="Categoria" name="category">
							          	<Select onChange={getFlavorsByCategory}>
								          	{
								          		dataCategory.map((item) => (
													<Option key={item?.id_category} value={item?.id_category}>
														{item?.name_category}
									          		</Option>
								          			)
								          		)
								          	}
		  							  	</Select>
							        </Form.Item>
							    </Col>

							    <Col span={6}>
									<Form.Item label="Sabor" name="flavor">
								        <Select onChange={getProductsByCategoryAndFlavor}>
								          	{
								          		dataFlavor.map((item) => (
													<Option key={item?.id} value={item?.id}>
														{item?.name_flavor}
									          		</Option>
								          			)
								          		)
								          	}
			  							</Select>
							        </Form.Item>
							    </Col>

							    <Col span={8}>
									<Form.Item label="Produto" name="name_product">
							          	<Select>
											{
								          		dataProductsFilter.map((item) => (
													<Option key={item?.id_product} value={item?.id_product}>
														{item?.name_product}
									          		</Option>
								          			)
								          		)
								          	}
		  							  	</Select>
							        </Form.Item>
							    </Col>

							    <Col span={4}>
									<Form.Item label="Preço promocional" name="price_promotion">
							          	<Input className="input-radius" />
							        </Form.Item>
							    </Col>

							    <Col span={1}>
							        <Button 
							        	className="button" 
							        	shape="circle" 
							        	icon={<PlusOutlined />}
							        	style={{ marginTop: "25px", float: "right" }}
							        	onClick={() => insertLineTable()} 
							        />
							    </Col>

							    <Col span={24}>
							      	<Table
						              size="middle"
									  columns={columns}
									  dataSource={dataTable}
									/>
							    </Col>
						      
							    <Col span={24} style={{ marginTop: "15px" }}>
							      	<Button onClick={() => form.submit()} shape="round" className="button ac">
								       Salvar
								    </Button>
									<Button shape="round" className="button-cancel ac">
								       Cancelar
								    </Button>
							    </Col>
						    </Row>
				      	</Form>


			          </Content>
			          <FooterSite />
			        </Layout>
		      	</Layout>
		    </Spin>
  		</div>
  	);
}

export default AddPromotion;

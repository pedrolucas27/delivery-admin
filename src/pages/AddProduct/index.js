import React, { useState, useEffect } from "react";
import axios from "axios";

import { 
	Layout,
	Form, 
	Input, 
	Button, 
	Select,
	Switch,
	Row, 
	Col,
	message,
	Spin
} from 'antd';
import 'antd/dist/antd.css';
import './addProduct.css';
import '../../global.css';

import HeaderSite from "../../components/Header";
import MenuSite from "../../components/Menu";
import FooterSite from "../../components/Footer";

const { TextArea } = Input;
const { Option } = Select;
const { Content } = Layout;

const BASE_URL = "http://localhost:4020/";

function AddProduct() {
	const [form] = Form.useForm();
	const [expand, setExpand] = useState(false);
	const [dataFlavor, setDataFlavor] = useState([]);
	const [dataSize, setDataSize] = useState([]);
	const [dataCategory, setDataCategory] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		axios.get(BASE_URL+"flavor").then((response) => {
			setDataFlavor(response?.data);
		}).catch((error) => {
			console.log("BUGOU: "+ error);
		});

		axios.get(BASE_URL+"size").then((response) => {
			setDataSize(response?.data);						
		}).catch((error) => {
			console.log("BUGOU: "+ error);
		});

		axios.get(BASE_URL+"category").then((response) => {
			setDataCategory(response?.data);						
		}).catch((error) => {
			console.log("BUGOU: "+ error);
		});
	}, []);


	const onSaveProduct = async (values) => {
		setLoading(true);
		if(values?.name_product && values?.price_product && values?.flavor && values?.category && values?.size){
			const response = await axios.post(BASE_URL+"product",
				{
					name_product: values?.name_product,
					description: values?.description || null,
					price: parseFloat(values?.price_product),
					is_active: values?.is_active !== undefined ? values?.is_active:true,
					fk_id_flavor: values?.flavor,
					fk_id_category: values?.category,
					fk_id_size: values?.size
				}
			);
			
			setLoading(false);
			if(response?.status === 200){
				message.success(response?.data?.message);
				form.resetFields();
			}else{
				message.error(response?.data?.message);
			}

		}else{
			setLoading(false);
			message.error("Informe os campos pedidos, por favor !");
		}
		
	}


	return (
		<div>
			<Spin size="large" spinning={loading}>
				<Layout>
					<MenuSite open={expand} />
			        <Layout className="site-layout">
			          <HeaderSite title={'Cadastro de produto'} isListView={false} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
			          <Content className="container-main">
			            

				      	<Form layout="vertical" form={form} onFinish={onSaveProduct}>   			  
					        <Row gutter={[16, 16]}>

						      <Col span={20}>
								<Form.Item label="Nome" name="name_product">
						          <Input  className="input-radius"/>
						        </Form.Item>
						      </Col>

						      <Col span={4}>
								<Form.Item label="Status" name="is_active">
						          <Switch defaultChecked />
						        </Form.Item>
						      </Col>

						      <Col span={6}>
								<Form.Item label="Categoria" name="category">
						          <Select>
						          	{
						          		dataCategory.map((item) => (
											<Option key={item?.code} value={item?.id_category}>
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
						          <Select>
						          	{
						          		dataFlavor.map((item) => (
											<Option key={item?.code} value={item?.id}>
												{item?.name_flavor}
							          		</Option>
						          			)
						          		)
						          	}
	  							  </Select>
						        </Form.Item>
						      </Col>

						      <Col span={6}>
								<Form.Item label="Tamanho" name="size">
						          <Select>
						          	{
						          		dataSize.map((item) => (
											<Option key={item?.code} value={item?.id_size}>
												{item?.size} ({item?.unit} - {item?.abreviation})
							          		</Option>
						          			)
						          		)
						          	}
	  							  </Select>
						        </Form.Item>
						      </Col>

						      <Col span={6}>
						      	<Form.Item label="Preço" name="price_product">
						      	  <Input className="input-radius" />
						        </Form.Item>
						      </Col>

						      <Col span={24}>
						      	<Form.Item label="Descrição" name="description">
						      	  <TextArea rows={4} className="input-radius"/>
						        </Form.Item>
						      </Col>

						      <Col span={24}>
						      	<Button onClick={() => form.submit()} shape="round" className="button ac">
							       Salvar
							    </Button>
								<Button onClick={() => {form.resetFields()}} shape="round" className="button-cancel ac">
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

export default AddProduct;

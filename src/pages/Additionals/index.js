import React, { useState, useEffect } from "react";
import axios from "axios";

import { 
	Layout,
	Button,
	Form,
	Select,
	Switch,
	Input,
	Row, 
	Col,
	Table,
	Tooltip,
	Drawer,
	message,
	Spin
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined
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

function Additionals() {
	const [expand, setExpand] = useState(false);
	const [expandEditRow, setExpandEditRow] = useState(false);
	const [idUpdate, setIdUpdate] = useState(null);
	const [form] = Form.useForm();
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [dataCategory, setDataCategory] = useState([]);
	
	useEffect(() => {
		axios.get(BASE_URL+"additional").then((response) => {
			let array = [];
			response?.data.forEach((additional) => {
				array.push({
					key: additional?.id,
					code: additional?.code,
					name: additional?.name,
					description: additional?.description || "-",
					category: additional?.id_category,
					value: additional?.price,
					is_default: additional?.is_default,
					status: additional?.is_active				
				})
			})
		  	setData(array);
		}).catch((error) => {
			console.log("BUGOU: "+ error);
		});
		
		axios.get(BASE_URL+"category").then((response) => {
			setDataCategory(response?.data);						
		}).catch((error) => {
			console.log("BUGOU: "+ error);
		});
	}, []);

	const columns = [
	  { title: 'Código', dataIndex: 'code', key: 'code' },
	  { title: 'Nome', dataIndex: 'name', key: 'name' },
	  { title: 'Descrição', dataIndex: 'description', key: 'description' },
	  { title: 'Valor (R$)', dataIndex: 'value', key: 'value' },
	  { 
	  	title: 'É um adicional padrão ?', 
	  	dataIndex: 'is_default', 
	  	key: 'is_default',
	  	render: (__, record) => {
	  		return(
	  			<div>
	  				{ record?.is_default ? "Sim" : "Não" }
	  			</div>
	  		);
	  	} 
	  },
	  { 
	  	title: 'Status', 
	  	dataIndex: 'status', 
	  	key: 'status',
	  	render: (__, record) => {
	  		return(
	  			<div>
	  				{ record?.status ? "Ativo" : "Inativo" }
	  			</div>
	  		);
	  	} 
	  },
  	  {
	    title: 'Ações',
	    dataIndex: '',
	    key: 'x',
	    render: (__, record) => {
	    	return(
	    		<div>
	    			<Tooltip placement="top" title='Deletar adicional'>
	    				<DeleteOutlined className="icon-table" onClick={() => deleteAdditional(record?.key)}/>
	    			</Tooltip>
	    			<Tooltip placement="top" title='Editar adicional'>
	    				<EditOutlined className="icon-table" onClick={() => setFildsDrawer(record?.key)}/>
	    			</Tooltip>
	    		</div>
	    	)
	    },
  	  },
    ];


    const getAdditionals = async () => {
    	await axios.get(BASE_URL+"additional").then((response) => {
			let array = [];
			response?.data.forEach((additional) => {
				array.push({
					key: additional?.id,
					code: additional?.code,
					name: additional?.name,
					description: additional?.description || "-",
					value: additional?.price,
					is_default: additional?.is_default,
					status: additional?.is_active				
				})
			})
		  	setData(array);
		}).catch((error) => {
			console.log("BUGOU: "+ error);
		});
    }

    const deleteAdditional = async (id) => {
    	setLoading(true);
    	
		await axios.delete(BASE_URL+"additional/"+id).then(response => {
      		if(response?.status === 200){
				getAdditionals();
				setLoading(false);
				message.success(response?.data?.message);
			}else{
				setLoading(false);
				message.error(response?.data?.message);
			}
    	}).catch(error => {
    		setLoading(false);
    		message.error(error);
    	});
    }


    const updateAdditional = async (values) => {
    	setLoading(true);
    	if(values?.name_additional && values?.category && values?.price){
			const response = await axios.put(BASE_URL+"additional", 
				{
					id: idUpdate,  
				  	name: values?.name_additional,
					description: values?.description || null,
					is_default: values?.is_default !== undefined ? values?.is_default:true,
					price: parseFloat(values?.price),
					is_active: values?.is_active !== undefined ? values?.is_active:true,
					id_category: values?.category
				} 
			);
			
			if(response?.status === 200){
				getAdditionals();
				setLoading(false);
				message.success(response?.data?.message);
				setExpandEditRow(!expandEditRow);
			}else{
				setLoading(false);
				message.error(response?.data?.message);
			}

		}else{
			setLoading(false);
			message.error("Informe os campos pedidos, por favor !");
		}

    }


    const setFildsDrawer = (id) => {
    	const line = data?.filter((item) => item?.key === id)[0];
    	setIdUpdate(id);

    	form.setFieldsValue({
    		name_additional: line?.name,
    		category: line?.category,
    		price: line?.value,
    		is_default: line?.is_default,
    		is_active: line?.status,
    		description: line?.description
    	});

    	setExpandEditRow(!expandEditRow);
    }




	return (
		<div>
			<Spin size="large" spinning={loading}>
				<Layout>
					<MenuSite open={expand} />
			        <Layout className="site-layout">
			          <HeaderSite title={'Listagem de adicionais'} isListView={true} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
			          <Content className="container-main">
			            <Table
			              size="middle"
						  columns={columns}
						  dataSource={data}
						/>
			          </Content>
			          <FooterSite />
			        </Layout>
		      	</Layout>

		      	<Drawer
		          	title="Editar adicional"
		          	width={720}
		          	onClose={() => setExpandEditRow(!expandEditRow)} 
		          	visible={expandEditRow}
		          	bodyStyle={{ paddingBottom: 80 }}>

		          	<Form layout="vertical" form={form} onFinish={updateAdditional}>   			  
					        <Row gutter={[16, 16]}>

						      <Col span={6}>
								<Form.Item label="Nome" name="name_additional">
						          <Input className="input-radius"/>
						        </Form.Item>
						      </Col>

						      <Col span={5}>
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

						      <Col span={5}>
								<Form.Item label="Preço" name="price">
						          <Input className="input-radius"/>
						        </Form.Item>
						      </Col>

						      <Col span={4}>
								<Form.Item label="Adiconal padrão" name="is_default" valuePropName="checked">
						          <Switch />
						        </Form.Item>
						      </Col>

						      <Col span={4}>
								<Form.Item label="Status" name="is_active" valuePropName="checked">
						          <Switch />
						        </Form.Item>
						      </Col>

						      <Col span={24}>
						      	<Form.Item label="Descrição" name="description">
						      	  <TextArea rows={4} className="input-radius"/>
						        </Form.Item>
						      </Col>
						      

						      <Col span={24}>
						      	<Button onClick={() => form.submit()} shape="round" className="button ac">
							       Editar
							    </Button>
								<Button onClick={() => setExpandEditRow(!expandEditRow)} shape="round" className="button-cancel ac">
							       Cancelar
							    </Button>
						      </Col>
						    </Row>
				      	</Form>
	            </Drawer>
			</Spin>
  		</div>
  	);
}

export default Additionals;

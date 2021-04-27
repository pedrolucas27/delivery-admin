import React, { useState, useEffect } from "react";
import axios from "axios";

import { 
	Layout,
	Button, 
	Row, 
	Col,
	Table,
	Tooltip,
	Drawer,
	Input,
	Switch,
	Select, 
	Form,
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

const BASE_URL = "http://localhost:4020/";

function Categories() {
	const [expand, setExpand] = useState(false);
	const [expandEditRow, setExpandEditRow] = useState(false);
	const [form] = Form.useForm();
	const [dataCategory, setDataCategory] = useState([]);
	const [idUpdate, setIdUpdate] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		axios.get(BASE_URL+"category").then((response) => {
			let array = [];
			response?.data.forEach((category) => {
				array.push({
					key: category?.id_category,
					code: category?.code,
					name: category?.name_category,
					status: category?.is_active 
				})
			})
			setDataCategory(array);						
		}).catch((error) => {
			console.log("BUGOU: "+ error);
		});
	}, []);

	const columns = [
	  { title: 'Código', dataIndex: 'code', key: 'code' },
	  { title: 'Nome', dataIndex: 'name', key: 'name' },
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
	    			<Tooltip placement="top" title='Deletar categoria'>
	    				<DeleteOutlined className="icon-table" onClick={() => deleteCategory(record?.key)}/>
	    			</Tooltip>
	    			<Tooltip placement="top" title='Editar categoria'>
	    				<EditOutlined className="icon-table" onClick={() => setFildsDrawer(record?.key)}/>
	    			</Tooltip>
	    		</div>
	    	)
	    },
  	  },
    ];


    const getCategories = async () => {
    	await axios.get(BASE_URL+"category").then((response) => {
			let array = [];
			response?.data.forEach((category) => {
				array.push({
					key: category?.id_category,
					code: category?.code,
					name: category?.name_category,
					status: category?.is_active 
				})
			})
			setDataCategory(array);						
		}).catch((error) => {
			console.log("BUGOU: "+ error);
		});
    }



    const deleteCategory = async (id) => {
    	setLoading(true);

    	await axios.delete(BASE_URL+"category/"+id).then(response => {
      		if(response?.status === 200){
				getCategories();
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

    const updateCategory = async (values) => {
    	setLoading(true);
    	if(values?.name_category){
			const response = await axios.put(BASE_URL+"category",
				{
					id: idUpdate,
					name_category: values?.name_category, 
					is_active: values?.is_active !== undefined ? values?.is_active:true
				}
			);
			
	    	if(response?.status === 200){
				getCategories();
				setLoading(false);
				message.success(response?.data?.message);
				setExpandEditRow(!expandEditRow);
			}else{
				setLoading(false);
				message.error(response?.data?.message);
			}

		}else{
			setLoading(false);
			message.error("Informe o nome da categoria, por favor !");
		}
    }

    const setFildsDrawer = (id) => {
    	const line = dataCategory?.filter((item) => item?.key === id)[0];
    	setIdUpdate(id);

    	form.setFieldsValue({
    		name_category: line?.name,
    		is_active: line?.status
    	});

    	setExpandEditRow(!expandEditRow);
    }
    

	return (
		<div>
			<Spin size="large" spinning={loading}>
				<Layout>
					<MenuSite open={expand} />
			        <Layout className="site-layout">
			          <HeaderSite title={'Listagem de categorias'} isListView={true} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
			          <Content className="container-main">
			            <Table
			              size="middle"
						  columns={columns}
						  dataSource={dataCategory}
						/>
			          </Content>
			          <FooterSite />
			        </Layout>
		      	</Layout>

		      	<Drawer
		          	title="Editar categoria"
		          	width={720}
		          	onClose={() => setExpandEditRow(!expandEditRow)} 
		          	visible={expandEditRow}
		          	bodyStyle={{ paddingBottom: 80 }}>
		          		<Form layout="vertical" form={form} onFinish={updateCategory}>   			  
					        <Row gutter={[16, 16]}>

						      <Col span={20}>
								<Form.Item label="Nome" name="name_category">
						          <Input className="input-radius"/>
						        </Form.Item>
						      </Col>

						      <Col span={4}>
								<Form.Item label="Status" name="is_active" valuePropName="checked">
						          <Switch />
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

export default Categories;

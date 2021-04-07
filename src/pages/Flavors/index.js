import React, { useState, useEffect } from "react";
import axios from "axios";

import { 
	Layout,
	Button, 
	Row, 
	Col,
	Drawer,
	Table,
	Form,
	Input,
	Tooltip,
	Switch
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

function Flavors() {
	const [expand, setExpand] = useState(false);
	const [expandEditRow, setExpandEditRow] = useState(false);
	const [data, setData] = useState([]);
	const [idUpdate, setIdUpdate] = useState(null);
	const [form] = Form.useForm();

	useEffect(() => {
		axios.get(BASE_URL+"flavors").then((response) => {
			let array = [];
			response?.data.forEach((flavor) => {
				array.push({
					key: flavor?.id,
					code: flavor?.code,
					name: flavor?.name_flavor,
					description: flavor?.description,
					status: flavor?.is_active 
				})
			})
			console.log(array);
		  	setData(array);
		}).catch((error) => {
			console.log("BUGOU: "+ error);
		});
	}, []);


	const columns = [
	  { title: 'Código', dataIndex: 'code', key: 'code' },
	  { title: 'Nome', dataIndex: 'name', key: 'name' },
	  { title: 'Descrição', dataIndex: 'description', key: 'description' },
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
	    			<Tooltip placement="top" title='Deletar sabor'>
	    				<DeleteOutlined className="icon-table" onClick={() => deleteFlavor(record?.key)}/>
	    			</Tooltip>
	    			<Tooltip placement="top" title='Editar sabor'>
	    				<EditOutlined className="icon-table" onClick={() => setFildsDrawer(record?.key)}/>
	    			</Tooltip>
	    		</div>
	    	)
	    },
  	  },
    ];


    const deleteFlavor = async (id) => {
    	const response = await axios.delete(BASE_URL+"delFlavor", { data: { id: id } } );
    	console.log(response);
    }

    const updateFlavor = async (values) => {
		const response = await axios.put(BASE_URL+"updateFlavor", 
			{  
			  id: idUpdate, 
			  name_flavor: values?.name_flavor, 
			  description: values?.description, 
			  is_active: values?.is_active
			} 
		);
    	console.log(response);
    }

    const setFildsDrawer = (id) => {
    	const line = data?.filter((item) => item?.key === id)[0];
    	setIdUpdate(id);

    	form.setFieldsValue({
    		name_flavor: line?.name,
    		description: line?.description,
    		is_active: line?.status
    	});

    	setExpandEditRow(!expandEditRow);
    }

   
	return (
		<div>
			<Layout>
				<MenuSite open={expand} menuItem={['sub2-3']} subMenu={['sub2']}/>
		        <Layout className="site-layout">
		          <HeaderSite title={'Listagem de sabores'} isListView={true} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
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
	          	title="Editar sabor"
	          	width={720}
	          	onClose={() => setExpandEditRow(!expandEditRow)} 
	          	visible={expandEditRow}
	          	bodyStyle={{ paddingBottom: 80 }}>
	          		<Form layout="vertical" form={form} onFinish={updateFlavor}>   			  
				        <Row gutter={[16, 16]}>
					      <Col span={20}>
							<Form.Item label="Nome" name="name_flavor">
					          <Input className="input-radius"/>
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
						       Salvar
						    </Button>
							<Button shape="round" className="button-cancel ac">
						       Cancelar
						    </Button>
					      </Col>
					    </Row>
			      	</Form>
            </Drawer>

  		</div>
  	);
}

export default Flavors;

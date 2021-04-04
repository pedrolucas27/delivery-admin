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
	const [form] = Form.useForm();

	useEffect(() => {
		axios.get(BASE_URL+"flavors").then((response) => {
			let array = [];
			response?.data.forEach((flavor) => {
				array.push({
					key: flavor?.id,
					code: flavor?.code,
					name: flavor?.name_flavor,
					status: flavor?.is_active ? "Ativo" : "Inativo"
				})
			})
		  	setData(array);
		}).catch((error) => {
			console.log("BUGOU: "+ error);
		});
	}, []);


	const columns = [
	  { title: 'Código', dataIndex: 'code', key: 'code' },
	  { title: 'Nome', dataIndex: 'name', key: 'name' },
	  { title: 'Status', dataIndex: 'status', key: 'status' },
  	  {
	    title: 'Ações',
	    dataIndex: '',
	    key: 'x',
	    render: () => {
	    	return(
	    		<div>
	    			<Tooltip placement="top" title='Deletar categoria'>
	    				<DeleteOutlined className="icon-table" />
	    			</Tooltip>
	    			<Tooltip placement="top" title='Editar categoria'>
	    				<EditOutlined className="icon-table" onClick={() => setExpandEditRow(!expandEditRow)}/>
	    			</Tooltip>
	    		</div>
	    	)
	    },
  	  },
    ];

   
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
	          		<Form layout="vertical" form={form}>   			  
				        <Row gutter={[16, 16]}>
					      <Col span={20}>
							<Form.Item label="Nome">
					          <Input className="input-radius"/>
					        </Form.Item>
					      </Col>
					      <Col span={4}>
							<Form.Item label="Status">
					          <Switch defaultChecked />
					         </Form.Item>
					      </Col>
					      
					      <Col span={24}>
					      	<Form.Item label="Descrição">
					      	  <TextArea rows={4} className="input-radius"/>
					        </Form.Item>
					      </Col>
					      
					      <Col span={24}>
					      	<Button shape="round" className="button ac">
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

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
	Drawer
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

const BASE_URL = "http://localhost:4020/";

function Sizes() {
	const [expand, setExpand] = useState(false);
	const [expandEditRow, setExpandEditRow] = useState(false);
	const [data, setData] = useState([]);
	const [form] = Form.useForm();

	useEffect(() => {
		axios.get(BASE_URL+"sizes").then((response) => {
			let array = [];
			response?.data.forEach((size) => {
				array.push({
					key: size?.id_size,
					code: size?.code,
					value: size?.size,
					unit: size?.unit + " - ("+ size?.abreviation +")",
					id_unit: size?.id_unit,
					status: size?.is_active 
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
	  { title: 'Valor', dataIndex: 'value', key: 'value' },
	  { title: 'Unidade', dataIndex: 'unit', key: 'unit' },
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
				<MenuSite open={expand} menuItem={['sub2-4']} subMenu={['sub2']}/>
		        <Layout className="site-layout">
		          <HeaderSite title={'Listagem de tamanhos'} isListView={true} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
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
	          	title="Editar tamanho"
	          	width={720}
	          	onClose={() => setExpandEditRow(!expandEditRow)} 
	          	visible={expandEditRow}
	          	bodyStyle={{ paddingBottom: 80 }}>
	          		<Form layout="vertical" form={form}>   			  
				        <Row gutter={[16, 16]}>
					      <Col span={9}>
							<Form.Item label="Valor">
					          <Input className="input-radius"/>
					        </Form.Item>
					      </Col>
					      <Col span={9}>
							<Form.Item label="Únidade">
					          <Select>
  							  </Select>
					        </Form.Item>
					      </Col>
					      <Col span={6}>
							<Form.Item label="Status">
					          <Switch defaultChecked />
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

export default Sizes;

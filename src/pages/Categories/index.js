import React, { useState } from "react";

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
	Form
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

function Categories() {
	const [expand, setExpand] = useState(false);
	const [expandEditRow, setExpandEditRow] = useState(false);
	const [form] = Form.useForm();

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

    const data = [
	  {
	    key: '1',
	    code: '972483',
	    name: 'Pizza',
	    status: 'Ativo',
	  }
	];

	return (
		<div>
			<Layout>
				<MenuSite open={expand} menuItem={['sub2-2']} subMenu={['sub2']}/>
		        <Layout className="site-layout">
		          <HeaderSite title={'Listagem de categorias'} isListView={true} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
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
	          	title="Editar categoria"
	          	width={720}
	          	onClose={() => setExpandEditRow(!expandEditRow)} 
	          	visible={expandEditRow}
	          	bodyStyle={{ paddingBottom: 80 }}>
	          		<Form layout="vertical" form={form}>   			  
				        <Row gutter={[16, 16]}>
					      <Col span={10}>
							<Form.Item label="Nome">
					          <Input className="input-radius"/>
					        </Form.Item>
					      </Col>
					      <Col span={10}>
							<Form.Item label="Disponibilidade">
					          <Select
							    mode="multiple"
							    placeholder="Selecione os dias"
							    style={{ width: '100%' }}
							  >
							        
							  </Select>
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
						       Editar
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

export default Categories;

import React, { useState } from "react";

import { 
	Layout,
	Form, 
	Input, 
	Button, 
	Switch,
	Row, 
	Col,
	Select
} from 'antd';
import {
  PlusOutlined
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import '../../global.css';

import HeaderSite from "../../components/Header";
import MenuSite from "../../components/Menu";
import FooterSite from "../../components/Footer";

const { TextArea } = Input;
const { Content } = Layout;

function AddCategory() {
	const [form] = Form.useForm();
	const [expand, setExpand] = useState(false);

	

	return (
		<div>
			<Layout>
				<MenuSite open={expand} menuItem={['sub1-2']} subMenu={['sub1']}/>
		        <Layout className="site-layout">
		          <HeaderSite title={'Cadastro de categoria'} isListView={false} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
		          <Content className="container-main">

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
  		</div>
  	);
}

export default AddCategory;

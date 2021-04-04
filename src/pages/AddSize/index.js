import React, { useState } from "react";

import { 
	Layout,
	Form, 
	Input, 
	Button, 
	Radio,
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

function AddSize() {
	const [form] = Form.useForm();
	const [expand, setExpand] = useState(false);

	return (
		<div>
			<Layout>
				<MenuSite open={expand} menuItem={['sub1-4']} subMenu={['sub1']}/>
		        <Layout className="site-layout">
		          <HeaderSite title={'Cadastro de tamanho'} isListView={false} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
		          <Content className="container-main">
		            

			      	<Form layout="vertical" form={form}>   			  
				        <Row gutter={[16, 16]}>
					      <Col span={6}>
							<Form.Item label="Valor">
					          <Input className="input-radius"/>
					        </Form.Item>
					      </Col>
					      <Col span={6}>
							<Form.Item label="Unidade">
					          <Select style={{ borderRadius: '30px !important' }}>
  							  </Select>
					        </Form.Item>
					      </Col>
					      <Col span={4}>
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


		          </Content>
		          <FooterSite />
		        </Layout>
	      	</Layout>
  		</div>
  	);
}

export default AddSize;

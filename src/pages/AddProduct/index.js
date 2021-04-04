import React, { useState } from "react";

import { 
	Layout,
	Form, 
	Input, 
	Button, 
	Radio,
	Select,
	Row, 
	Col
} from 'antd';
import {
  PlusOutlined
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import './addProduct.css';
import '../../global.css';

import HeaderSite from "../../components/Header";
import MenuSite from "../../components/Menu";
import FooterSite from "../../components/Footer";

const { TextArea } = Input;
const { Option } = Select;
const { Content } = Layout;

function AddProduct() {
	const [form] = Form.useForm();
	const [expand, setExpand] = useState(false);

	return (
		<div>
			<Layout>
				<MenuSite open={expand} menuItem={['sub1-1']} subMenu={['sub1']}/>
		        <Layout className="site-layout">
		          <HeaderSite title={'Cadastro de produto'} isListView={false} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
		          <Content className="container-main">
		            

			      	<Form layout="vertical" form={form}>   			  
				        <Row gutter={[16, 16]}>
					      <Col span={5}>
							<Form.Item label="Nome">
					          <Input  className="input-radius"/>
					        </Form.Item>
					      </Col>
					      <Col span={4}>
							<Form.Item label="Categoria">
					          <Select style={{ borderRadius: '30px !important' }}>
  							  </Select>
					        </Form.Item>
					      </Col>
					      <Col span={1}>
							<Form.Item label="">
					          <Button className="button b" shape="circle" icon={<PlusOutlined />} />
					        </Form.Item>
					      </Col>
					      <Col span={4}>
							<Form.Item label="Sabor">
					          <Select>
  							  </Select>
					        </Form.Item>
					      </Col>
					      <Col span={1}>
							<Form.Item label="">
					          <Button className="button b" shape="circle" icon={<PlusOutlined />} />
					        </Form.Item>
					      </Col>
					      <Col span={4}>
							<Form.Item label="Tamanho">
					          <Select>
  							  </Select>
					        </Form.Item>
					      </Col>
					      <Col span={1}>
							<Form.Item label={""}>
					          <Button className="button b" shape="circle" icon={<PlusOutlined />} />
					        </Form.Item>
					      </Col>
					      <Col span={4}>
					      	<Form.Item label="Preço">
					      	  <Input addonBefore="R$" />
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

export default AddProduct;

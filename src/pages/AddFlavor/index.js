import React, { useState } from "react";
import axios from "axios";

import { 
	Layout,
	Form, 
	Input, 
	Button, 
	Radio,
	Switch,
	Row, 
	Col
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

const BASE_URL = "http://localhost:4020/";

function AddFlavor() {
	const [form] = Form.useForm();
	const [expand, setExpand] = useState(false);

	const onSaveFlavor = async (values) => {

		if(values?.name_flavor){
			const response = await axios.post(BASE_URL+"addFlavor",
				{
					name_flavor: values?.name_flavor,
					description: values?.description, 
					is_active: values?.is_active !== undefined ? values?.is_active:true
				}
			);
		}else{
			console.log("INFORME UM NOME VÁLIDO, POR FAVOR!");
		}

		form.resetFields();
	}
	

	return (
		<div>
			<Layout>
				<MenuSite open={expand} menuItem={['sub1-3']} subMenu={['sub1']}/>
		        <Layout className="site-layout">
		          <HeaderSite title={'Cadastro de sabor'} isListView={false} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
		          <Content className="container-main">
		            

			      	<Form layout="vertical" form={form} onFinish={onSaveFlavor}>   			  
				        <Row gutter={[16, 16]}>
					      <Col span={20}>
							<Form.Item label="Nome" name="name_flavor">
					          <Input className="input-radius"/>
					        </Form.Item>
					      </Col>
					      <Col span={4}>
							<Form.Item label="Status" name="is_active">
					          <Switch defaultChecked />
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


		          </Content>
		          <FooterSite />
		        </Layout>
	      	</Layout>
  		</div>
  	);
}

export default AddFlavor;

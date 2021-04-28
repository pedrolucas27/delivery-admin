import React, { useState } from "react";
import axios from "axios";

import { 
	Layout,
	Form, 
	Input, 
	Button, 
	Switch,
	Row, 
	Col,
	message,
	Spin
} from 'antd';
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
	const [loading, setLoading] = useState(false);
	
	const onSaveFlavor = async (values) => {
		setLoading(true);

		if(values?.name_flavor){
			const response = await axios.post(BASE_URL+"flavor",
				{
					name_flavor: values?.name_flavor,
					description: values?.description, 
					is_active: values?.is_active !== undefined ? values?.is_active:true
				}
			);
			
			setLoading(false);
			if(response?.status === 200){
				message.success(response?.data?.message);
				form.resetFields();
			}else{
				message.error(response?.data?.message);
			}

		}else{
			setLoading(false);
			message.error("Informe o nome do sabor, por favor !");
		}

	}
	

	return (
		<div>
			<Spin size="large" spinning={loading}>
				<Layout>
					<MenuSite open={expand} />
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
								<Button onClick={() => {form.resetFields()}} shape="round" className="button-cancel ac">
							       Cancelar
							    </Button>
						      </Col>
						    </Row>
				      	</Form>


			          </Content>
			          <FooterSite />
			        </Layout>
		      	</Layout>
		    </Spin>
  		</div>
  	);
}

export default AddFlavor;

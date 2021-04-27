import React, { useState } from "react";
import axios from "axios";

import { 
	Layout,
	Form, 
	Input, 
	Button, 
	Switch,
	Select,
	DatePicker,
	Row, 
	Col
} from 'antd';

import 'antd/dist/antd.css';
import '../../global.css';

import HeaderSite from "../../components/Header";
import MenuSite from "../../components/Menu";
import FooterSite from "../../components/Footer";

const { Content } = Layout;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const BASE_URL = "http://localhost:4020/";

function AddPromotion() {
	const [form] = Form.useForm();
	const [expand, setExpand] = useState(false);
	


	return (
		<div>
			<Layout>
				<MenuSite open={expand} />
		        <Layout className="site-layout">
		          <HeaderSite title={'Cadastro de promoção'} isListView={false} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
		          <Content className="container-main">

			      	<Form layout="vertical" form={form}>   			  
				        <Row gutter={[16, 16]}>

					      <Col span={10}>
							<Form.Item label="Nome" name="name_additional">
					          <Input className="input-radius"/>
					        </Form.Item>
					      </Col>

					      <Col span={8}>
							<Form.Item label="Período" name="period">
							    <RangePicker showTime />
					        </Form.Item>
					      </Col>

					      <Col span={6}>
							<Form.Item label="Status" name="is_active">
					          <Switch />
					        </Form.Item>
					      </Col>

					      <Col span={14}>
							<Form.Item label="Produto" name="product">
					          <Select>
  							  </Select>
					        </Form.Item>
					      </Col>

					      <Col span={10}>
							<Form.Item label="Desconto" name="discount">
					          <Input addonBefore="R$" />
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

export default AddPromotion;

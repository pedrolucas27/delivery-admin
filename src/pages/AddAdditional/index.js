import React, { useState, useEffect } from "react";
import axios from "axios";

import { 
	Layout,
	Form, 
	Input, 
	Button, 
	Switch,
	Select,
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

const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

const BASE_URL = "http://localhost:4020/";

function AddAdditional() {
	const [form] = Form.useForm();
	const [expand, setExpand] = useState(false);
	const [loading, setLoading] = useState(false);
	const [dataCategory, setDataCategory] = useState([]);

	useEffect(() => {
		axios.get(BASE_URL+"category").then((response) => {
			setDataCategory(response?.data);						
		}).catch((error) => {
			console.log("BUGOU: "+ error);
		});
	}, []);

	const onSaveAdditional = async (values) => {
		setLoading(true);
		if(values?.name_additional && values?.category && values?.price){
			const response = await axios.post(BASE_URL+"additional",
				{
					name: values?.name_additional,
					description: values?.description || null,
					is_default: values?.is_default !== undefined ? values?.is_default:true,
					price: parseFloat(values?.price),
					is_active: values?.is_active !== undefined ? values?.is_active:true,
					id_category: values?.category
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
			message.error("Informe os campos pedidos, por favor !");
		}
	}

	return (
		<div>
			<Spin size="large" spinning={loading}>
				<Layout>
					<MenuSite open={expand} />
			        <Layout className="site-layout">
			          <HeaderSite title={'Cadastro de adicional'} isListView={false} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
			          <Content className="container-main">

				      	<Form layout="vertical" form={form} onFinish={onSaveAdditional}>   			  
					        <Row gutter={[16, 16]}>

						      <Col span={6}>
								<Form.Item label="Nome" name="name_additional">
						          <Input className="input-radius" />
						        </Form.Item>
						      </Col>

						      <Col span={5}>
								<Form.Item label="Categoria" name="category">
						          <Select>
							          	{
							          		dataCategory.map((item) => (
												<Option key={item?.code} value={item?.id_category}>
													{item?.name_category}
								          		</Option>
							          			)
							          		)
							          	}
  							  		</Select>
						        </Form.Item>
						      </Col>

						      <Col span={5}>
								<Form.Item label="Preço (R$)" name="price">
						          <Input className="input-radius" />
						        </Form.Item>
						      </Col>

						      <Col span={4}>
								<Form.Item label="Adiconal padrão" name="is_default">
						          <Switch />
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

export default AddAdditional;

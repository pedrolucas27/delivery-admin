import React, { useState, useEffect } from "react";
import axios from "axios";

import { 
	Layout,
	Form, 
	Input, 
	Button, 
	Switch,
	Row, 
	Col,
	Select,
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
const { Option } = Select;

const BASE_URL = "http://localhost:4020/";

function AddSize() {
	const [form] = Form.useForm();
	const [expand, setExpand] = useState(false);
	const [dataUnitMenusuration, setDataUnitMenusuration] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		axios.get(BASE_URL+"unitMensuration").then((response) => {
			let array = [];
			response?.data.forEach((unit_mensuration) => {
				array.push({
					id_unit: unit_mensuration?.id_unit,
					code: unit_mensuration?.code,
					unit: unit_mensuration?.unit,
					abreviation: unit_mensuration?.abreviation,
					is_active: unit_mensuration?.is_active 
				})
			})
			console.log(array);
		  	setDataUnitMenusuration(array);
		}).catch((error) => {
			console.log("BUGOU: "+ error);
		});

	}, []);


	const onSaveSize = async (values) => {
		setLoading(true);
		if(values?.size_value && values?.unit){
			const response = await axios.post(BASE_URL+"size",
				{
					id_unit_fk: values?.unit,
					size: values?.size_value,
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
			message.error("Informe os campos pedidos, por favor !");
		}

	}


	return (
		<div>
			<Spin size="large" spinning={loading}>
				<Layout>
					<MenuSite open={expand} />
			        <Layout className="site-layout">
			          <HeaderSite title={'Cadastro de tamanho'} isListView={false} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
			          <Content className="container-main">
			            
				      	<Form layout="vertical" form={form} onFinish={onSaveSize}>   			  
					        <Row gutter={[8, 0]}>
						      <Col span={6}>
								<Form.Item label="Valor" name="size_value">
						          <Input className="input-radius"/>
						        </Form.Item>
						      </Col>
						      <Col span={6}>
								<Form.Item label="Unidade" name="unit">
						          <Select>
						          	{
						          		dataUnitMenusuration.map((item) => (
												<Option key={item?.code} value={item?.id_unit}>
													{item?.unit} - ({item?.abreviation})
							          			</Option>
						          			)
						          		)
						          	}
	  							  </Select>
						        </Form.Item>
						      </Col>
						      <Col span={4}>
								<Form.Item label="Status" name="is_active">
						          <Switch defaultChecked />
						        </Form.Item>
						      </Col>
						      <Col span={24}>
								<Form.Item label="Observação" name="description">
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

export default AddSize;

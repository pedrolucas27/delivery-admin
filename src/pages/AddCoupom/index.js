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

import { maskMoney } from "../../helpers.js";
import HeaderSite from "../../components/Header";
import MenuSite from "../../components/Menu";
import FooterSite from "../../components/Footer";

const { Content } = Layout;
const { TextArea } = Input;

const BASE_URL = "http://localhost:8080/";

function AddCoupom() {
	const [form] = Form.useForm();
	const [expand, setExpand] = useState(false);
	const [loading, setLoading] = useState(false);


	const onSaveCoupom = async (values) => {

		try {
			setLoading(true);
			if (values.name_coupom && values.price) {
				const response = await axios.post(BASE_URL + "coupom",
					{
						name_coupom: values.name_coupom,
						description: values.description || null,
						value_discount: Number(values.price.replace(",", ".")),
						is_active: values.is_active !== undefined ? values.is_active : true,
					}
				);

				setLoading(false);
				if (response.status === 200) {
					message.success(response.data.message);
					form.resetFields();
				} else {
					message.error(response.data.message);
				}
			} else {
				setLoading(false);
				message.error("Informe os campos pedidos, por favor !");
			}
		} catch (error) {
			setLoading(false);
			message.error("Erro de comunicação com o servidor, tente novamente !");
		}

	}


	const handleChangePrice = async () => {
		const field = form.getFieldValue("price");
		form.setFieldsValue({ price: await maskMoney(field) });
	}

	return (
		<div>
			<Spin size="large" spinning={loading}>
				<Layout>
					<MenuSite open={expand} current={'addCoupom'} openCurrent={'register'} />
					<Layout className="site-layout">
						<HeaderSite title={'Cadastro de cupom'} isListView={false} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
						<Content className="container-main">

							<Form layout="vertical" form={form} onFinish={onSaveCoupom}>
								<Row gutter={[8, 0]}>

									<Col span={16}>
										<Form.Item label="Nome" name="name_coupom">
											<Input className="input-radius" />
										</Form.Item>
									</Col>

									<Col span={4}>
										<Form.Item label="Valor (R$)" name="price">
											<Input className="input-radius" onKeyUp={handleChangePrice} />
										</Form.Item>
									</Col>

									<Col span={4}>
										<Form.Item label="Status" name="is_active">
											<Switch defaultChecked />
										</Form.Item>
									</Col>

									<Col span={24}>
										<Form.Item label="Descrição" name="description">
											<TextArea rows={4} className="input-radius" />
										</Form.Item>
									</Col>


									<Col span={24}>
										<Button onClick={() => form.submit()} shape="round" className="button ac">
											Salvar
							    		</Button>
										<Button onClick={() => { form.resetFields() }} shape="round" className="button-cancel ac">
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

export default AddCoupom;

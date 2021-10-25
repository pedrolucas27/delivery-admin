import React, { useState, useEffect } from "react";
import API from "../../api.js";
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
import {
	maskMoney,
	getStorageERP,
	isLoggedAdmin
} from "../../helpers.js";
import HeaderSite from "../../components/Header";
import MenuSite from "../../components/Menu";
import FooterSite from "../../components/Footer";
const { Content } = Layout;
const { TextArea } = Input;
function AddFreight() {
	isLoggedAdmin();

	const { idEstablishment } = getStorageERP();
	const [form] = Form.useForm();
	const [expand, setExpand] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		form.setFieldsValue({ price: maskMoney(0) });
	}, []);

	const onSaveFreight = async (values) => {
		try {
			setLoading(true);
			if (values.name_region && values.price) {
				const response = await API.post("freight", {
					name_region: values.name_region,
					delivery_value: Number(values.price.replace(",", ".")),
					is_active: values.is_active !== undefined ? values.is_active : true,
					description: values.description,
					id_company: idEstablishment
				});

				setLoading(false);
				if (response.status === 200) {
					form.setFieldsValue({ price: maskMoney(0) });
					message.success(response.data.message);
					form.resetFields();
				} else {
					message.error(response.data.message);
				}
			} else {
				setLoading(false);
				message.error("Informe o nome da região e o valor do frete, por favor !");
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
				<Layout className="container-body">
					<MenuSite onTitle={!expand} open={expand} current={'addFreight'} openCurrent={'register'} />
					<Layout>
						<HeaderSite title={'Cadastro de frete'} isListView={false} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
						<Content className="container-main">
							<Form layout="vertical" form={form} onFinish={onSaveFreight}>
								<Row gutter={[8, 0]}>
									<Col span={16}>
										<Form.Item label="Nome da região" name="name_region">
											<Input className="input-radius" />
										</Form.Item>
									</Col>
									<Col span={4}>
										<Form.Item label="Valor do frete (R$)" name="price">
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
export default AddFreight;
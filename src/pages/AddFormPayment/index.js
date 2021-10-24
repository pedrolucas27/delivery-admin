import React, { useState } from "react";
import API from "../../api.js";
import { getStorageERP, isLoggedAdmin } from "../../helpers.js";
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
const { Content } = Layout;
function AddFormPayment() {
	isLoggedAdmin();

	const { idEstablishment } = getStorageERP();
	const [form] = Form.useForm();
	const [expand, setExpand] = useState(false);
	const [loading, setLoading] = useState(false);
	const onSaveFormPayment = async (values) => {
		try {
			setLoading(true);
			if (values.name_form_payment) {
				const response = await API.post("form_payment",
					{
						name_form_payment: values.name_form_payment,
						is_active: values.is_active !== undefined ? values.is_active : true,
						id_company: idEstablishment
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
				message.error("Informe o nome da forma de pagamento, por favor !");
			}
		} catch (error) {
			setLoading(false);
			message.error("Erro de comunicação com o servidor, tente novamente !");
		}
	}

	return (
		<div>
			<Spin size="large" spinning={loading}>
				<Layout className="container-body">
					<MenuSite onTitle={!expand} open={expand} current={'addFormPayment'} openCurrent={'register'} />
					<Layout className="site-layout">
						<HeaderSite title={'Cadastro de forma de pagamento'} isListView={false} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
						<Content className="container-main">
							<Form layout="vertical" form={form} onFinish={onSaveFormPayment}>
								<Row gutter={[8, 0]}>
									<Col span={20}>
										<Form.Item label="Nome" name="name_form_payment">
											<Input className="input-radius" />
										</Form.Item>
									</Col>
									<Col span={4}>
										<Form.Item label="Status" name="is_active">
											<Switch defaultChecked />
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
export default AddFormPayment;

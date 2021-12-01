import React, { useState } from "react";
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
	maskNumer, 
	getStorageERP, 
	isLoggedAdmin 
} from "../../helpers.js";
import HeaderSite from "../../components/Header";
import MenuSite from "../../components/Menu";
import FooterSite from "../../components/Footer";
const { Content } = Layout;
const { TextArea } = Input;
function AddCoupom() {
	isLoggedAdmin();
	
	const { idEstablishment } = getStorageERP();
	const [form] = Form.useForm();
	const [expand, setExpand] = useState(false);
	const [loading, setLoading] = useState(false);

	const onSaveCoupom = async (values) => {
		try {
			setLoading(true);
			if (values.name_coupom && Number(values.discount_percentage > 0)) {
				const response = await API.post("coupom",
					{
						name_coupom: values.name_coupom,
						description: values.description || null,
						discount_percentage: Number(values.discount_percentage),
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
				message.error("Informe os campos pedidos, por favor !");
			}
		} catch (error) {
			setLoading(false);
			message.error("Erro de comunicação com o servidor, tente novamente !");
		}
	}

	const handleChangePercentage = async () => {
		const field = form.getFieldValue("discount_percentage");
		if(Number(field) < 100){
			form.setFieldsValue({ discount_percentage: await maskNumer(field) });
		}else{
			form.setFieldsValue({ discount_percentage: '' });
		}
	}

	return (
		<div>
			<Spin size="large" spinning={loading}>
				<Layout className="container-body">
					<MenuSite onTitle={!expand} open={expand} current={'addCoupom'} openCurrent={'register'} />
					<Layout>
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
										<Form.Item label="Porcentagem de desconto (%)" name="discount_percentage">
											<Input className="input-radius" onKeyUp={handleChangePercentage} />
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

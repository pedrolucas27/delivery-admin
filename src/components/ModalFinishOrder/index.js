import React, { useEffect, useState } from "react";
import API from "../../api.js";
import { getStorageERP, changeCommaForPoint } from "../../helpers.js";
import {
	Button,
	Row,
	Col,
	message,
	Input,
	Divider,
	Spin,
	Form,
	Typography,
	Select,
	Modal
} from 'antd';
import { maskPhoneCell } from "../../helpers.js";
import 'antd/dist/antd.css';
import '../../global.css';
const { TextArea } = Input;
const { Title } = Typography;
const { Option } = Select;
function ModalFinishOrder(props) {
	const { idEstablishment } = getStorageERP();

	const [form] = Form.useForm();
	const [dataFormPayment, setDataFormPayment] = useState([]);
	const [loading, setLoading] = useState(false);

	const [flagConsultCoupom, setFlagConsultCoupom] = useState(false);
	const [valueDiscount, setValueDiscount] = useState(0);

	useEffect(() => {
		try{
			API.get("form_payment/"+idEstablishment).then((response) => {
				setDataFormPayment(response.data);
			}).catch((error) => {
				message.error("Erro de comunicação com o servidor.");
			});
		}catch (error) {
			message.error("Erro de comunicação com o servidor. Tente novamente!");
		}
	}, []);

	const getCoupomChangeName = async () => {
		const nameCoupom = form.getFieldValue("coupom");
		if(nameCoupom){
			try{
				API.get("coupom/"+nameCoupom+"/"+idEstablishment).then((response) => {
					if(response.status === 200){
						if(response.data){
							setFlagConsultCoupom(true);
							setValueDiscount(response.data[0].value_discount);
						}
					}
				}).catch((error) => {
					message.error("Erro de comunicação com o servidor ao tentar buscar cupom.");
				});
			}catch (error) {
				message.error("Erro de comunicação com o servidor. Tente novamente!");
			}
		}else{
			message.error("Informe um cupom válido para poder aplicar!");
		}
	}

	const insertDataClientOrder = (values) => {
		setLoading(true);
		form.resetFields();
		props.insertDataOrder(values, valueDiscount);
		setLoading(false);
	}

	const setFildsPhoneCell = () => {
		const field = form.getFieldValue('phone_cell');
		form.setFieldsValue({ phone_cell: maskPhoneCell(field) });
	}

	return (
			<Spin size="large" spinning={loading}>
				<Modal
					title="Adicionar informações do pedido"
					visible={props.visibleModalFinishOrder}
					style={{ top: 10 }}
					footer={[
						<Button
							shape="round"
							className="button-cancel"
							onClick={() => props.onCancelSubmitOrder()}
						>
							Cancelar
						</Button>,
						<Button
							shape="round"
							className="button"
							onClick={() => form.submit()}
						>
							Finalizar
						</Button>
					]}
				>
					<Row>
						<Col span={24}>
							<Title level={5}>
								Dados do cliente
							</Title>
							<Divider className="line-divider" />
						</Col>
						<Col span={24}>
							<Form layout="vertical" form={form} onFinish={insertDataClientOrder}>
								<Row gutter={[6, 0]}>
									<Col span={16}>
										<Form.Item
											label="Nome"
											name="name_client"
											rules={[
												{
													required: true,
													message: 'Insira o nome.',
												}
											]}
										>
											<Input className="input-radius" />
										</Form.Item>
									</Col>
									<Col span={8}>
										<Form.Item
											label="Telefone celular"
											name="phone_cell"
											rules={[
												{
													required: true,
													message: 'Insira o telefone.',
												}
											]}
										>
											<Input maxLength={15} className="input-radius" onChange={setFildsPhoneCell}/>
										</Form.Item>
									</Col>
									<Col span={24}>
										<Form.Item
											label="Logradouro"
											name="address"
											rules={[
												{
													required: true,
													message: 'Insira o endereço.',
												}
											]}
										>
											<Input className="input-radius" />
										</Form.Item>
									</Col>
									<Col span={24}>
										<Title level={5}>
											Pagamento
										</Title>
										<Divider className="line-divider" />
									</Col>
									<Col span={24}>
										<Form.Item
											label="Forma de pagamento"
											name="form_payment"
											rules={[
												{
													required: true,
													message: 'Escolha ao menos uma forma de pagamento.',
												}
											]}
										>
											<Select mode="multiple">
												{
													dataFormPayment.map((item, index) => (
														<Option key={index} value={item.id}>
															{item.name_form_payment}
														</Option>
													))
												}
											</Select>
										</Form.Item>
									</Col>
									<Col span={16}>
										<Form.Item label="Cupom" name="coupom">
											<Input className="input-radius" />
										</Form.Item>
										<div>
											{
												flagConsultCoupom && (
													<p>Você terá um desconto de R$ {changeCommaForPoint(valueDiscount)}</p>
												)
											}
										</div>
									</Col>
									<Col span={8}>
										<Form.Item label="*" name="btn">
											<Button
												shape="round"
												className="button"
												onClick={getCoupomChangeName}
												block
											>
												Aplicar cupom
											</Button>
										</Form.Item>
									</Col>
									<Col span={24}>
										<Form.Item label="Observação" name="observation">
											<TextArea rows={3} className="input-radius" />
										</Form.Item>
									</Col>
								</Row>
							</Form>
						</Col>
					</Row>
				</Modal>
			</Spin>
	);
}
export default ModalFinishOrder;
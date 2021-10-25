import React, { useEffect, useState } from "react";
import API from "../../api.js";
import { 
	getStorageERP, 
	changeCommaForPoint, 
	maskMoney, 
	maskNumer 
} from "../../helpers.js";
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
	Checkbox,
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
	const [dataFreight, setDataFreight] = useState([]);
	const [loading, setLoading] = useState(false);
	const [flagConsultCoupom, setFlagConsultCoupom] = useState(false);
	const [valueDiscount, setValueDiscount] = useState(0);
	const [fkIdCoupom, setFkIdCoupom] = useState(null);
	const [containsCupom, setContainsCupom] = useState(false);

	useEffect(() => {
		API.get("form_payment/" + idEstablishment).then((response) => {
			setDataFormPayment(response.data);
		}).catch((error) => {
			message.error("Erro de comunicação com o servidor.");
		});

		API.get("freight/" + idEstablishment).then((response) => {			
			setDataFreight(response.data);
		}).catch((error) => {
			message.error("Erro de comunicação com o servidor.");
		});
	}, []);

	const getCoupomChangeName = async () => {
		const nameCoupom = form.getFieldValue("coupom");
		if (nameCoupom) {
			try {
				API.get("coupom/" + nameCoupom + "/" + idEstablishment).then((response) => {
					if (response.status === 200) {
						if (response.data) {
							setFlagConsultCoupom(true);
							setValueDiscount(response.data[0].value_discount);
							setFkIdCoupom(response.data[0].id_coupom);
						}
					}
				}).catch((error) => {
					message.error("Erro de comunicação com o servidor ao tentar buscar cupom.");
				});
			} catch (error) {
				message.error("Erro de comunicação com o servidor. Tente novamente!");
			}
		} else {
			message.error("Informe um cupom válido para poder aplicar!");
		}
	}

	const insertDataClientOrder = (values) => {
		setLoading(true);
		const objFreight = values.freight ? dataFreight.filter((item) => item.id === values.freight)[0]:null;
		const valueFreight = objFreight ? objFreight.delivery_value:0;
		if(values.amount_paid){
			if(Number(values.amount_paid.replace(",", ".")) >= Number(String(props.valueOrder).replace(",", "."))){
				form.resetFields();
				props.insertDataOrder(values, valueFreight, valueDiscount, fkIdCoupom);
				setLoading(false);
			}else{
				setLoading(false);
				message.error("O valor a ser pago tem que ser maior/igual ao valor total do pedido.");
			}
		}else{
			form.resetFields();
			props.insertDataOrder(values, valueFreight, valueDiscount, fkIdCoupom);
			setLoading(false);
		}		
	}

	const setFildsPhoneCell = () => {
		const field = form.getFieldValue('phone_cell');
		form.setFieldsValue({ phone_cell: maskPhoneCell(field) });
	}

	const handleChangeOfMoney = async () => {
		const field = form.getFieldValue("amount_paid");
		form.setFieldsValue({ amount_paid: await maskMoney(field) });
	}

	const handleNumberHouse = async () => {
		const field = form.getFieldValue("number_house");
		form.setFieldsValue({ number_house: await maskNumer(field) });
	}

	return (
		<Spin size="large" spinning={loading}>
			<Modal
				title="Adicionar informações do pedido"
				visible={props.visibleModalFinishOrder}
				onCancel={() => props.onCancelSubmitOrder()}
				style={{ top: 20 }}
				width={1000}
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
										<Input maxLength={15} className="input-radius" onChange={setFildsPhoneCell} />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item
										label="Rua"
										name="street"
										rules={[
											{
												required: true,
												message: 'Insira o nome da rua.',
											}
										]}
									>
										<Input className="input-radius" />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item
										label="Bairro"
										name="district"
										rules={[
											{
												required: true,
												message: 'Insira o nome bairro.',
											}
										]}
									>
										<Input className="input-radius" />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item
										label="Número"
										name="number_house"
										rules={[
											{
												required: true,
												message: 'Insira o número.',
											}
										]}
									>
										<Input className="input-radius" onKeyUp={handleNumberHouse} />
									</Form.Item>
								</Col>
								<Col span={24}>
									<Form.Item label="Observação" name="observation">
										<TextArea rows={3} className="input-radius" />
									</Form.Item>
								</Col>
								<Col span={24}>
									<Title level={5}>
										Pagamento
									</Title>
									<Divider className="line-divider" />
								</Col>
								<Col span={10}>
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
								<Col span={8}>
									<Form.Item
										label="Aplique o frete para:"
										name="freight"
										rules={[
											{
												required: true,
												message: 'Escolha uma opção de frete.',
											}
										]}
									>
										<Select>
											{
												dataFreight.map((item, index) => (
													<Option key={index} value={item.id}>
														{item.name_region} - {changeCommaForPoint(item.delivery_value)}
													</Option>
												))
											}
										</Select>
									</Form.Item>
								</Col>
								<Col span={6}>
									<Form.Item
										label="Troco para R$:"
										name="amount_paid"
									>
										<Input className="input-radius" onKeyUp={handleChangeOfMoney} />
									</Form.Item>
								</Col>
								<Col span={24}>
									<Checkbox
										value={containsCupom}
										onChange={() => setContainsCupom(!containsCupom)}
										style={{ marginBottom: '10px' }}
									>
										Possui algum cupom ?
									</Checkbox>
								</Col>

								{
									containsCupom && (
										<Col span={16}>
											<Form.Item label="Insira o cupom" name="coupom">
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
									)
								}

								{
									containsCupom && (
										<Col span={8}>
											<Form.Item label=" " name="btn">
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
									)
								}

							</Row>
						</Form>
					</Col>
				</Row>
			</Modal>
		</Spin>
	);
}
export default ModalFinishOrder;
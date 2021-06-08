import React from "react";
import {
	Button,
	Row,
	Col,
	message,
	Input,
	Divider,
	Form,
	Typography,
	Select,
	Modal
} from 'antd';

import 'antd/dist/antd.css';
import '../../global.css';

const { TextArea } = Input;
const { Title } = Typography;

function ModalFinishOrder(props) {
	const [form] = Form.useForm();

	const insertDataClientOrder = (values) => {
		form.resetFields();
		props.insertDataOrder(values);
	}

	return (
		<div>
			<Modal
				title="Adicionar informações do pedido"
				visible={props.visibleModalFinishOrder}
				style={{ top: 10 }}
				footer={[
					<Button
						shape="round"
						className="button"
						onClick={() => form.submit()}
					>
						Finalizar
					</Button>,
					<Button
						shape="round"
						className="button-cancel"
					>
						Cancelar
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
										<Input className="input-radius" />
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

								<Col span={12}>
									<Form.Item
										label="Forma de pagamento"
										name="form_payment"

									>
										<Select />
									</Form.Item>
								</Col>

								<Col span={12}>
									<Form.Item label="Cupom" name="coupom">
										<Input className="input-radius" />
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
		</div>
	);
}

export default ModalFinishOrder;
import React, { useState } from "react";
import API from "../../api.js";
import {
	Row,
	Col,
	Card,
	Button,
	Typography,
	Spin,
	message,
	Form,
	Input
} from 'antd';
import 'antd/dist/antd.css';
import './loginAdmin.css';
import { maskPhoneCell, setTokenIdAdmin } from "../../helpers.js";
import loginImage from "../../images/login_admin.png";
const { Title } = Typography;
function Login() {
	const [form] = Form.useForm();
	const [action, setAction] = useState("login");
	const [stepRegister, setStepRegister] = useState(1);
	const [loading, setLoading] = useState(false);
	const updateStepRegister = (flag) => {
		setLoading(true);
		if(flag === 0){
			setLoading(false);
			if(stepRegister === 1){
				setAction("login");
			}else{
				setStepRegister(stepRegister - 1);
			}
		}else{
			if(stepRegister === 1){
				setLoading(false);
				if(form.getFieldValue("name_u") && form.getFieldValue("phone")){
					setStepRegister(stepRegister + 1);
				} else {
					message.error("Preencha todos os campos pedidos.");
				}
			}else{
				setLoading(false);
				if(form.getFieldValue("email") && form.getFieldValue("password")){
					if(form.getFieldValue("password") === form.getFieldValue("password_confirm")){
						registerAdmin();
					}else{
						message.error("Senhas incompatíveis.");
					}
				}else{
					message.error("Preencha todos os campos pedidos.");
				}
			}
		}
	}

	const registerAdmin = async () => {
		setLoading(true);
		let admin = {
			name: form.getFieldValue("name_u"),
			email: form.getFieldValue("email"),
			password: form.getFieldValue("password"),
			phone: form.getFieldValue("phone")
		}
		try{
			const response = await API.post("createAccount/admin", admin);
			setLoading(false);
			if(response.status === 200){
				message.success(response.data.message);
				window.location.reload(true);
			}else{
				message.error(response.data.message);
			}
		}catch(error){
			setLoading(false);
			message.error("Erro ao tentar realizar cadastrado.");
		}
	}

	const authenticationAdmin = async (values) => {
		if(values.username && values.password_auth){
			setLoading(true);
			try{
				const response = await API.post("authentication/admin", { user: values.username, password: values.password_auth });
				setLoading(false);
				if(response.status === 200){
					message.success(response.data.message);
					if(response.data.id_establishment){
						setTokenIdAdmin(
							response.data.token, 
							response.data.id_establishment,
							response.data.idAdmin
						);
						window.location.href = "/dashboard";
					}else{
						setTokenIdAdmin(
							response.data.token, 
							null,
							response.data.idAdmin
						);
						window.location.href = "/registerEstablishment";
					}
				}else{
					message.error(response.data.message);
				}
			}catch(error){
				setLoading(false);
				message.error("Erro ao tentar realizar login.");
			}
		}else{
			message.error("Preencha todos os campos antes de tentar realizar login.");
		}
	}

	const handleChangePhoneCell = async () => {
		const field = form.getFieldValue("phone");
		form.setFieldsValue({ phone: await maskPhoneCell(field) });
	}

	return (
		<div>
			<Spin size="large" spinning={loading}>
				<Row>
					<Col span={14}>
						<div className="container-left-login">
							<img src={loginImage} className="img-login-admin" alt="Ícone de login" />
						</div>
					</Col>
					<Col span={10}>
						<div className="container-right-login">
							{
								action === "login" ? (
									<Card title={<Title level={3}>Entrar</Title>} className="card-login-admin">
										<Form layout="vertical" form={form} onFinish={authenticationAdmin}>
											<Form.Item name="username" label="Usuário">
												<Input className="input-radius" placeholder="E-mail ou telefone celular" />
											</Form.Item>
											<Form.Item name="password_auth" label="Senha">
												<Input className="input-radius" type="password" placeholder="Díginte sua senha" />
											</Form.Item>
											<Form.Item>
												<Row>
													<Col span={24}>
														<Button
															shape="round"
															htmlType="submit"
															className="button"
															style={{ marginTop: "10px" }}
															block
														>
															Entrar
											        	</Button>
													</Col>
												</Row>
											</Form.Item>
										</Form>
										<Row>
											<Col span={24}>
												<Button 
													onClick={() => setAction("register")}
													style={{ marginTop: "5px", color: "#D62828" }} 
													type="link" 
													block
												>
			      									Não possui conta ? Registre-se.
			    								</Button>		
											</Col>
										</Row>
									</Card>
								):(
									<Card title={<Title level={3}>Cadastro</Title>} className="card-login-admin">
										<Form layout="vertical" form={form}>
											{
												stepRegister === 1 ? (
													<div>
														<Form.Item name="name_u" label="Nome">
															<Input className="input-radius" placeholder="Ex.: João" />
														</Form.Item>
														<Form.Item name="phone" label="Telefone celular">
															<Input 
																maxLength={15} 
																className="input-radius" 
																placeholder="Ex.: (84) 9 9999-9999"
																onChange={handleChangePhoneCell} 
															/>
														</Form.Item>
													</div>
												):(
													<div>
														<Form.Item name="email" label="E-mail">
															<Input className="input-radius" placeholder="Ex.: joao@gmail.com" />
														</Form.Item>
														<Form.Item name="password" label="Senha">
															<Input className="input-radius" type="password" />
														</Form.Item>
														<Form.Item name="password_confirm" label="Confirme sua senha">
															<Input className="input-radius" type="password" />
														</Form.Item>
													</div>
												)
											}
											<Form.Item>
												<Row>
													<Col span={12}>
														<Button
															shape="round"
															className="button-cancel"
															style={{ marginTop: "10px" }}
															onClick={() => updateStepRegister(0)}
														>
															{stepRegister === 1 ? "Cancelar":"Voltar"}
											        	</Button>
													</Col>
													<Col span={12}>
														<Button
															shape="round"
															className="button"
															style={{ marginTop: "10px", float: "right" }}
															onClick={() => updateStepRegister(1)}
														>
															{stepRegister === 1 ? "Seguir":"Cadastrar"}
											        	</Button>
													</Col>
												</Row>
											</Form.Item>
										</Form>
									</Card>
								)
							}
						</div>
					</Col>
				</Row>
			</Spin>
		</div>
	);
}

export default Login;

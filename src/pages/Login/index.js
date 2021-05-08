import React from "react";

import { 
	Row, 
	Col,
	Card,
	Button,
	Typography,
	Form,
	Input
} from 'antd';

import 'antd/dist/antd.css';
import './loginAdmin.css';

import loginImage from "../../images/login_admin.png";

const { Title } = Typography;


function Login(){
	return(
		<div>
			<Row>
				<Col span={14}>
					<div className="container-left-login">
						<img src={loginImage} className="img-login-admin" alt="Ícone de login"/>		
					</div>
				</Col>
				<Col span={10}>
					<div className="container-right-login">
						<Card title={<Title level={3}>Entrar</Title>} className="card-login-admin">
							<Form layout="vertical">

							    <Form.Item name="username" label="Usuário">
							        <Input className="input-radius" placeholder="E-mail ou telefone celular" />
							    </Form.Item>

							    <Form.Item name="password" label="Senha">
							        <Input className="input-radius" type="password" placeholder="Díginte sua senha" />
							    </Form.Item>
							     

							    <Form.Item>
							        <Button 
							        	shape="round" 
							        	htmlType="submit" 
							        	className="button"
							        	style={{ marginTop: "10px" }}  
							        	block
							        >
							        	Entrar
							        </Button>
							        <Button 
							        	shape="round" 
							        	className="button-cancel" 
							        	style={{ marginTop: "10px" }} 
							        	block
							        >
							        	Cancelar
							        </Button>
							    </Form.Item>

    						</Form>
						</Card>
					</div>
				</Col>
			</Row>
		</div>
	);
}

export default Login;
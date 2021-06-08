import React from "react";
import { 
	Layout, 
	Menu,
	Button,
	Typography,
	Badge
} from 'antd';
import { 
	ShoppingCartOutlined
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import './headerWeb.css';

const { Title } = Typography;
const { Header } = Layout;


function HeaderWeb(){
	return(
		<div>
			<Header className="header-web">
      			<div className="logo-header">
      				<Title level={4} style={{ color: '#fff' }}>Logomarca</Title>
      			</div>
		      	<div className="nav-web-right">
      				<Button shape="round" className="button-cancel ac">Entrar</Button>
      			</div>
    		</Header>
		</div>
	);
}

export default HeaderWeb;
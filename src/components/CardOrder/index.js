import React from "react";
import { 
	Card,
	Row,
	Col,
	Typography,
	Tooltip,
	Button
} from 'antd';
import {
  	SettingOutlined,
  	EditOutlined,
  	EllipsisOutlined
} from '@ant-design/icons';
import '../../global.css';

const { Title } = Typography;

function CardProduct(props){
	return(
		<div>

			<Card
				hoverable 
				size="small" 
				title={<Title level={5}>Pedido 346343</Title>} 
				extra={<Button type="link">Ver detalhes</Button>}
				className="card-pdv-order"
			>
		    	<p style={{ margin: 0 }}>Card content</p>
		      	<p style={{ margin: 0 }}>Card content</p>
		      	<Row>
					<Col span={24}>
						<div className="container-icon-card">
							<p className="text-money">
								R$ 1,50
							</p>
						</div>
					</Col>
				</Row>
		      	<Row className="line-bottom-card" justify="center">
		      		<Col span={12}>
		      			<Button type="link" danger>Cancelar</Button>
		      		</Col>
		      		<Col span={12}>
		      			<Button shape="round" className="button">Atualizar</Button>
		      		</Col>
		      	</Row>
    		</Card>
		</div>
	);
}

export default CardProduct;
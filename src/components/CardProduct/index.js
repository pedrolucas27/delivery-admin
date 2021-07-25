import React from "react";
import {
	Card,
	Row,
	Col,
	Typography,
} from 'antd';
import {
	CheckCircleOutlined
} from '@ant-design/icons';
import '../../global.css';
import { changeCommaForPoint } from "../../helpers.js";
const { Title } = Typography;
function CardProduct(props) {
	return (
		<div>
			<Card
				hoverable
				className={props.check ? "card-pdv-2 check-card-pdv" : "card-pdv-2"}
				style={{ height: '175px' }}
				onClick={() => props.onChangeProduct()}
			>
				<Title level={5}>
					{props.name}
				</Title>
				<p style={{ margin: 2 }}>
					<span>Tamanho/Volume:</span> {props.size}
				</p>
				<Row>
					<Col span={24}>
						<div className="container-icon-card">
							<p className="text-money">
								R$ {changeCommaForPoint(props.price)}
							</p>
							{props.check && (
								<CheckCircleOutlined className="icon-table" />
							)}
						</div>
					</Col>
				</Row>
			</Card>
		</div>
	);
}
export default CardProduct;
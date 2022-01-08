import React from "react";
import {
	Card,
	Row,
	Col,
	Typography
} from 'antd';
import {
	CheckCircleOutlined
} from '@ant-design/icons';
import '../../../../global.css';
const { Title } = Typography;
function CardFlavor(props) {
	return (
		<div>
			<Card
				hoverable
				className={props.check ? "card-pdv-2 check-card-pdv" : "card-pdv-2"}
				onClick={() => props.onChangeFlavor()}
			>
				<Title level={3}>
					{props.name}
				</Title>
				<p style={{ margin: 2 }}>
					{props.description ? props.description : "Não possui descrição."}
				</p>
				{props.check && (
					<Row>
						<Col span={24}>
							<div className="container-icon-card">
								<CheckCircleOutlined className="icon-table" />
							</div>
						</Col>
					</Row>
				)}
			</Card>
		</div>
	);
}
export default CardFlavor;
import React from "react";
import {
	Card,
	Row,
	Col,
	Typography,
	Button
} from 'antd';
import {
	CheckCircleOutlined
} from '@ant-design/icons';
import '../../global.css';

const { Title } = Typography;

function CardProduct(props) {
	return (
		<div>
			<Card
				hoverable
				className={props.check ? "card-pdv-2 check-card-pdv" : "card-pdv-2"}
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
								R$ {props.price}
							</p>
							{props.check && (
								<CheckCircleOutlined className="icon-table" />
							)}
						</div>
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<Button
							type="link"
							className="button-detail"
							onClick={() => props.showModalDetail()}
						>
							Ver detalhes
        				</Button>
					</Col>
				</Row>

			</Card>
		</div>
	);
}

export default CardProduct;
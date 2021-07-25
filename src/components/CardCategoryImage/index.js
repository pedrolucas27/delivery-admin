import React from "react";
import {
	Card,
	Typography,
	Row,
	Col
} from 'antd';
import {
	CheckCircleOutlined
} from '@ant-design/icons';
import '../../global.css';
const { Title } = Typography;
function CardCategoryImage(props) {
	return (
		<div>
			<Card
				hoverable
				className={props.check ? "card-delivery check-card-pdv" : "card-delivery"}
				onClick={() => props.onChangeCategory()}
			>
				<Row>
					<Col span={8}>
						<img src={props.urlImage} width="32" height="32" alt="Imagem da Categoria" />
					</Col>
					<Col span={16}>
						<Title level={5}>
							{props.name}
						</Title>
						<p>
							{props.check ? "Categoria escolhida!" : "Clique para escolher."}
						</p>
						{props.check && (
							<div>
								<CheckCircleOutlined className="icon-table" />
							</div>
						)}
					</Col>
				</Row>
			</Card>
		</div>
	);
}
export default CardCategoryImage;
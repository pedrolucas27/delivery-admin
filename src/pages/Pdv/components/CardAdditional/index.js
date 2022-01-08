import React from "react";
import {
	Card,
	Typography,
	Row,
	Button,
	Col
} from 'antd';
import {
	MinusOutlined,
	CheckCircleOutlined,
	PlusOutlined
} from '@ant-design/icons';
import '../../../../global.css';
import { changeCommaForPoint } from "../../../../helpers.js";
const { Title } = Typography;
function CardAdditional(props) {
	return (
		<div>
			<Card
				hoverable
				className={props.check ? "card-pdv check-card-pdv":"card-pdv"}
				onClick={!props.isAdditionalDefault ? () => props.onChangeAdditional():() => {}}
			>
				<Title level={4}>
					{props.name}
				</Title>
				<Row>
					<Col span={24}>
						<div className="container-icon-card">
							<p className="text-money">
								R$ {changeCommaForPoint(props.price)}
							</p>
						</div>
					</Col>
				</Row>
				{
					props.isAdditionalDefault ? (
						<Row justify="center">
							<Col span={4}>
								<Button
									shape="circle"
									className="button-cancel"
									icon={<MinusOutlined />}
									disabled={props.quantity === 0 ? true : false}
									onClick={() => props.minusQuantityAdditional()}
								/>
							</Col>
							<Col span={4}>
								<div className="container-icon-card">
									<Title level={5} style={{ marginTop: 5 }}>
										{props.quantity}
									</Title>
								</div>
							</Col>
							<Col span={4}>
								<Button
									shape="circle"
									className="button"
									style={{ float: "right" }}
									icon={<PlusOutlined />}
									onClick={() => props.plusQuantityAdditional()}
								/>
							</Col>
						</Row>
					):(
						<Row>
							<Col span={24}>
								<div className="container-icon-card">
									{props.check && (
										<CheckCircleOutlined className="icon-table" />
									)}
								</div>
							</Col>
						</Row>
					)
				}
			</Card>
		</div>
	);
}
export default CardAdditional;
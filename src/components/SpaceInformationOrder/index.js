import React, { useState, useEffect } from "react";
import {
	Typography,
	Row,
	Divider,
	Col
} from 'antd';
import '../../global.css';
import { changeCommaForPoint } from "../../helpers.js";
const { Title } = Typography;
function SpaceInformationOrder(props) {
	const [dataClient, setDataClient] = useState([]);
	useEffect(() => {
		setDataClient(String(props.addressClient).split(";"));
	}, []);

	return (
		<div>
			<Row>
				<Col span={12}>
					<Title level={4} style={{ margin: 0 }}>Produto (s) do pedido</Title>
					<Divider className="line-divider" />
					{
						props.products.map((item, index) => {
							return (
								<Col span={24} key={index}>
									<p style={{ fontWeight: "bold", margin: 0 }}>{item.quantity_item}x {item.observation ? item.observation : item.name_product}</p>
									<p style={{ margin: 0 }}>- Preço: {changeCommaForPoint(item.price_item_order)}</p>
									<p style={{ margin: 0 }}>- Unidade: {item.size_product} {item.unit} - {item.abreviation}</p>
									<Divider className="line-divider" />
								</Col>
							)
						})
					}
					{
						props.additionais && (
							<Col span={24}>
								<Title level={4} style={{ margin: 0 }}>Adicional (ais) do pedido</Title>
								<Divider className="line-divider" />
								{
									props.additionais.map((item, index) => {
										return (
											<Col span={24} key={index}>
												<p style={{ fontWeight: "bold", margin: 0 }}>{item.quantity_item}x {item.name}</p>
												<p style={{ margin: 0 }}>- Preço: {changeCommaForPoint(item.price_item_order)}</p>
												<Divider className="line-divider" />
											</Col>
										)
									})
								}
							</Col>
						)
					}
				</Col>
				<Col span={12}>
					<Title level={4} style={{ margin: 0 }}>Dados do cliente</Title>
					<Divider className="line-divider" />
					{
						dataClient.map((item, index) => {
							return (
								<Col span={24} key={index}>
									<p style={{ margin: 0 }}>- {item}</p>
								</Col>
							)
						})
					}
				</Col>
			</Row>
		</div>
	);
}
export default SpaceInformationOrder;
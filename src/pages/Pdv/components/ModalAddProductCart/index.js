import React, { useState } from "react";
import {
	Button,
	Row,
	Col,
	Divider,
	Typography,
	Spin,
	Modal
} from 'antd';
import {
	PlusOutlined,
	MinusOutlined
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import '../../../../global.css';
import { changeCommaForPoint } from "../../../../helpers.js";
const { Title } = Typography;
function ModalAddProductCart(props) {
	const [quantity, setQuantity] = useState(1);
	const [loading, setLoading] = useState(false);
	const addProductOrder = () => {
		setLoading(true);
		props.onAddOrder(quantity);
		setLoading(false);
	}

	return (
			<Spin size="large" spinning={loading}>
				<Modal
					title="Adicionar no carrinho"
					visible={props.isVisibleAddCart}
					onCancel={() => props.onCancelProductChange()}
					footer={[
						<Button
							shape="round"
							className="button-cancel"
							onClick={() => props.onCancelProductChange()}
							key={0}
						>
							Cancelar
						</Button>,
						<Button
							shape="round"
							className="button"
							onClick={() => addProductOrder()}
							key={1}
						>
							Adicionar e seguir
						</Button>
					]}
				>
					<Row>
						<Col span={24}>
							<Title level={3} style={{ margin: 2 }}>
								{props.product.name}
							</Title>
							<p style={{ margin: 2 }}>
								<span>Tamanho/Volume:</span> {props.product.size}
							</p>
							<Divider className="line-divider" />
						</Col>
						<Col span={24}>
							<Row>
								<Col span={12}>
									<div className="container-icon-card">
										<Title level={3} style={{ color: '#00a000' }}>
											R$ {changeCommaForPoint(quantity * props.product.price)}
										</Title>
									</div>
								</Col>
								<Col span={12}>
									<Row justify="center">
										<Col span={4}>
											<Button
												shape="circle"
												className="button-cancel"
												icon={<MinusOutlined />}
												onClick={() => setQuantity(quantity - 1)}
												disabled={quantity === 1 ? true : false}
											/>
										</Col>
										<Col span={4}>
											<div className="container-icon-card">
												<Title level={5} style={{ marginTop: 5 }}>
													{quantity}
												</Title>
											</div>
										</Col>
										<Col span={4}>
											<Button
												shape="circle"
												className="button"
												style={{ float: "right" }}
												icon={<PlusOutlined />}
												onClick={() => setQuantity(quantity + 1)}
											/>
										</Col>
									</Row>
								</Col>
							</Row>
							<Divider className="line-divider" />
						</Col>
					</Row>
				</Modal>
			</Spin>
	);
}
export default ModalAddProductCart;
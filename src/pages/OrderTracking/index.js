import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import 'moment/locale/pt-br';

import {
	Layout,
	message,
	Tabs,
	Table,
	Badge,
	Typography,
	Tooltip,
	Spin,
	Tag,
	Row,
	Col
} from 'antd';
import {
	RedoOutlined,
	UndoOutlined,
	DeleteOutlined
} from '@ant-design/icons';

import 'antd/dist/antd.css';
import '../../global.css';

import { changeCommaForPoint } from "../../helpers.js";
import HeaderSite from "../../components/Header";
import MenuSite from "../../components/Menu";
import FooterSite from "../../components/Footer";
import SpaceInformationOrder from "../../components/SpaceInformationOrder";

const { Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;

const BASE_URL = "http://localhost:8080/";

function OrderTracking() {
	const [expand, setExpand] = useState(false);
	const [loading, setLoading] = useState(false);
	const [tab, setTab] = useState("1");
	const [allOrdersInProduction, setAllOrdersInProduction] = useState([]);
	const [allOrdersInAnalysis, setAllOrdersInAnalysis] = useState([]);

	useEffect(() => {
		let arrayInAnalysis = [];
		let arrayInProduction = [];

		axios.get(BASE_URL + "order").then((response) => {
			response.data.forEach((order) => {
				if (order.status_order === 0) {
					arrayInAnalysis.push({
						key: order.id_order,
						code: order.code,
						value: order.price_final,
						is_pdv: order.is_pdv,
						dateRequest: order.data_order,
						observation: order.observation || "-",
						addressClient: order.address_client,
						status: order.status_order,
						products: order.products
					});
				} else if (order.status_order === 1) {
					arrayInProduction.push({
						key: order.id_order,
						code: order.code,
						value: order.price_final,
						is_pdv: order.is_pdv,
						dateRequest: order.data_order,
						observation: order.observation || "-",
						addressClient: order.address_client,
						status: order.status_order,
						products: order.products
					});
				}
			})

			console.log(arrayInAnalysis.concat(arrayInProduction));

			setAllOrdersInAnalysis(arrayInAnalysis);
			setAllOrdersInProduction(arrayInProduction);
		}).catch((error) => {
			console.log("BUGOU: " + error);
		});



	}, []);


	const columns = [
		{ title: 'Código', dataIndex: 'code', key: 'code' },
		{
			title: 'Meio de solicitação do pedido',
			dataIndex: 'is_pdv',
			key: 'is_pdv',
			render: (__, record) => {
				return (
					<div>
						{record.is_pdv ?
							(
								<Tag color="#214185">PDV</Tag>
							) : (
								<Tag color="#020100">DELIVERY</Tag>
							)
						}
					</div>
				);
			}
		},
		{
			title: 'Data',
			dataIndex: 'dateRequest',
			key: 'dateRequest',
			render: (__, record) => {
				return (
					<div>
						{moment(record.dateRequest).format("DD-MM-YYYY HH:MM:SS")}
					</div>
				);
			}
		},
		{ title: 'Observação', dataIndex: 'observation', key: 'observation' },
		{
			title: 'Valor (R$)',
			dataIndex: 'value',
			key: 'value',
			render: (__, record) => {
				return (
					<div>
						{changeCommaForPoint(record.value)}
					</div>
				);
			}
		},
		{
			title: 'Ações',
			dataIndex: '',
			key: 'x',
			render: (__, record) => {
				return (
					<div>
						{
							tab === "1" && (
								<Tooltip placement="top" title='Deletar pedido'>
									<DeleteOutlined className="icon-table" />
								</Tooltip>
							)
						}

						{
							tab !== "1" && (
								<Tooltip placement="top" title='Atualizar status do pedido para uma etapa anterior'>
									<UndoOutlined
										className="icon-table"
										onClick={() => updateStatusOrder(record.key, false, record.status)}
									/>
								</Tooltip>
							)
						}


						<Tooltip placement="top" title='Atualizar status do pedido para à próxima etapa'>
							<RedoOutlined
								className="icon-table"
								onClick={() => updateStatusOrder(record.key, true, record.status)}
							/>
						</Tooltip>


					</div>
				)
			},
		},
	];



	const updateStatusOrder = async (idOrder, flag, status) => {
		console.log(tab);
		setLoading(true);

		console.log("STATUS ANTIGO -> " + status);

		const newStatus = flag ? (status + 1) : (status - 1)

		console.log("STATUS NOVO -> " + newStatus);

		const response = await axios.put(BASE_URL + "order-status",
			{
				id_order: idOrder,
				status_order: newStatus
			}
		);

		if (response.status === 200) {
			getOrders();
			setLoading(false);
			message.success(response.data.message);
		} else {
			setLoading(false);
			message.error(response.data.message);
		}
	}


	const getOrders = async () => {
		setLoading(true);
		let arrayInAnalysis = [];
		let arrayInProduction = [];

		axios.get(BASE_URL + "order").then((response) => {
			response.data.forEach((order) => {
				if (order.status_order === 0) {
					arrayInAnalysis.push({
						key: order.id_order,
						code: order.code,
						value: order.price_final,
						is_pdv: order.is_pdv,
						dateRequest: order.data_order,
						observation: order.observation || "-",
						addressClient: order.address_client,
						status: order.status_order,
						products: order.products
					});
				} else if (order.status_order === 1) {
					arrayInProduction.push({
						key: order.id_order,
						code: order.code,
						value: order.price_final,
						is_pdv: order.is_pdv,
						dateRequest: order.data_order,
						observation: order.observation || "-",
						addressClient: order.address_client,
						status: order.status_order,
						products: order.products
					});
				}
			})
			setAllOrdersInAnalysis(arrayInAnalysis);
			setAllOrdersInProduction(arrayInProduction);
		}).catch((error) => {
			console.log("BUGOU: " + error);
		});

		setLoading(false);
	}



	return (
		<div>
			<Spin size="large" spinning={loading}>
				<Layout>
					<MenuSite open={expand} />
					<Layout className="site-layout">
						<HeaderSite title={'Acompanhamento de pedidos'} isListView={false} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
						<Content className="container-main">

							<Tabs defaultActiveKey="1" size="large" onChange={(key) => setTab(key)}>
								<TabPane tab="Pedidos em análise" key="1">
									<Table
										size="middle"
										columns={columns}
										dataSource={allOrdersInAnalysis}
										expandable={{
											expandedRowRender: record => <SpaceInformationOrder addressClient={record.addressClient} products={record.products} />,
											rowExpandable: record => record.products.length !== 0,
										}}
									/>
								</TabPane>

								<TabPane tab="Pedidos em produção" key="2">
									<Table
										size="middle"
										columns={columns}
										dataSource={allOrdersInProduction}
										expandable={{
											expandedRowRender: record => <SpaceInformationOrder addressClient={record.addressClient} products={record.products} />,
											rowExpandable: record => record.products.length !== 0,
										}}
									/>
								</TabPane>

								<TabPane tab="Pedidos aguardando retirada" key="3">

								</TabPane>
							</Tabs>

						</Content>
						<FooterSite />
					</Layout>
				</Layout>
			</Spin>
		</div>
	);
}

export default OrderTracking;

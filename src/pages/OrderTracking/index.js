import React, { useState, useEffect } from "react";
import API, { API_SOCKET } from "../../api.js";
import { changeCommaForPoint, isLoggedAdmin, getStorageERP } from "../../helpers.js";
import moment from "moment";
import 'moment/locale/pt-br';
import {
	Layout,
	message,
	Popconfirm,
	Tabs,
	Table,
	Tooltip,
	Spin,
	Tag
} from 'antd';
import {
	RedoOutlined,
	UndoOutlined,
	DeleteOutlined,
	IssuesCloseOutlined,
	FieldTimeOutlined,
	DeliveredProcedureOutlined,
	HistoryOutlined,
	ContainerOutlined
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import '../../global.css';
import HeaderSite from "../../components/Header";
import MenuSite from "../../components/Menu";
import FooterSite from "../../components/Footer";
import SpaceInformationOrder from "../../components/SpaceInformationOrder";
import EmptyData from "../../components/EmptyData";

import io from "socket.io-client";

const sound = require("../../sound-order/sound.mp3");

const { Content } = Layout;
const { TabPane } = Tabs;
function OrderTracking() {
	isLoggedAdmin();

	const { idEstablishment } = getStorageERP();
	const [expand, setExpand] = useState(false);
	const [loading, setLoading] = useState(false);
	const [tab, setTab] = useState("1");
	const [allOrdersInProduction, setAllOrdersInProduction] = useState([]);
	const [allOrdersInAnalysis, setAllOrdersInAnalysis] = useState([]);
	const [allOrdersInReadyForDelivery, setAllOrdersInReadyForDelivery] = useState([]);
	const [historyOfDeliveredOrders, setHistoryOfDeliveredOrders] = useState([]);

	const [checkDeliveryOrder, setCheckDeliveryOrder] = useState(null);

	const socket = io(API_SOCKET);
	socket.on("pedidorealizadoserver", (data) => {
		setCheckDeliveryOrder(data);

		var audio = new Audio(sound);
		audio.play();
	});

	useEffect(() => {
		getOrders();
		setCheckDeliveryOrder(null);
	}, [checkDeliveryOrder]);

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
			sorter: (a, b) => new Date(a.dateRequest) - new Date(b.dateRequest),
			render: (__, record) => {
				return (
					<div>
						{moment(record.dateRequest).format("DD-MM-YYYY [ás] HH:mm:ss")}
					</div>
				);
			}
		},
		{ title: 'Observação', dataIndex: 'observation', key: 'observation' },
		{
			title: 'Valor do pedido',
			dataIndex: 'value',
			key: 'value',
			render: (__, record) => {
				return (
					<div>
						R$ {changeCommaForPoint(record.value)}
					</div>
				);
			}
		},
		{
			title: 'Valor do frete',
			dataIndex: 'freight',
			key: 'freight',
			render: (__, record) => {
				return (
					<div>
						R$ {changeCommaForPoint(record.freight)}
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
									<Popconfirm
										title="Tem certeza que deseja deletar ?"
										onConfirm={() => deleteOrder(record.key)}
										okText="Sim"
										cancelText="Não"
									>
										<DeleteOutlined className="icon-table" />
									</Popconfirm>
								</Tooltip>
							)
						}
						{
							tab !== "1" && tab !== "4" && (
								<Tooltip placement="top" title='Atualizar status do pedido para uma etapa anterior'>
									<UndoOutlined
										className="icon-table"
										onClick={() => updateStatusOrder(record.key, record.id_client_fk, false, record.status)}
									/>
								</Tooltip>
							)
						}
						{
							(tab === "1" || tab === "2" || tab === "3") && (
								<Tooltip placement="top" title='Atualizar status do pedido para à próxima etapa'>
									<RedoOutlined
										className="icon-table"
										onClick={() => updateStatusOrder(record.key, record.id_client_fk, true, record.status)}
									/>
								</Tooltip>
							)
						}
						{
							(tab === "2" || tab === "3" || tab === "4") && (
								<Tooltip
									placement="top"
									title={tab === "3" ? "Gerar nota auxiliar e enviar para entrega." : "Gerar nota auxiliar novamente."}
								>
									<ContainerOutlined
										className="icon-table"
										onClick={() => {
											generateInvoiceOrder(record.key);
										}}
									/>
								</Tooltip>
							)
						}
					</div>
				)
			},
		},
	];

	const generateInvoiceOrder = async (idOrder) => {
		try {
			setLoading(true);
			const response = await API.get("generate-invoice/" + idOrder);
			if (response.status === 200) {
				//imprimir pdf
				setLoading(false);
				message.success(response.data.message);
				setTimeout(() => {
					window.open(`https://api-master-pizza.herokuapp.com/invoices/${idOrder}`);
				}, []);
			} else {
				setLoading(false);
				message.error(response.data.message);
			}
		} catch (error) {
			setLoading(false);
			message.error("Erro de comunicação com o servidor.");
		}
	}

	const deleteOrder = async (idOrder) => {
		setLoading(true);
		try {
			API.delete("order/" + idOrder + "/" + idEstablishment).then(response => {
				if (response.status === 200) {
					getOrders();
					setLoading(false);
					message.success(response.data.message);
				} else {
					setLoading(false);
					message.error(response.data.message);
				}
			}).catch(error => {
				setLoading(false);
				message.error("Erro de comunicação com o servidor.");
			});
		} catch (error) {
			message.error("Erro de comunicação com o servidor.");
		}
	}

	const updateStatusOrder = async (idOrder, idClient, flag, status) => {
		setLoading(true);
		const newStatus = flag ? (status + 1) : (status - 1)
		try {
			const response = await API.put("order-status",
				{
					id_order: idOrder,
					status_order: newStatus,
					id_company: idEstablishment
				}
			);
			if (response.status === 200) {
				getOrders();

				socket.emit("pedidostatus", { id_client: idClient });
				setTimeout(() => {
					setLoading(false);
					message.success(response.data.message);
				}, 1500);
			} else {
				setLoading(false);
				message.error(response.data.message);
			}
		} catch (error) {
			message.error("Erro de comunicação com o servidor.");
		}
	}

	const getOrders = async () => {
		setLoading(true);
		try {
			let arrayInAnalysis = [];
			let arrayInProduction = [];
			let arrayInReadyForDelivery = [];
			let arrayInHistoryOfDeliveredOrders = [];
			API.get("order/" + idEstablishment).then((response) => {
				response.data.forEach((order) => {
					console.log(response.data)
					if (order.status_order === 0) {
						arrayInAnalysis.push({
							id_client_fk: order.id_client_fk,
							key: order.id_order,
							code: order.code,
							value: order.price_final,
							freight: order.freight,
							is_pdv: order.is_pdv,
							dateRequest: order.data_order,
							observation: order.observation || "-",
							addressClient: order.address_client,
							status: order.status_order,
							products: order.products,
							additionais: order.additionais
						});
					} else if (order.status_order === 1) {
						arrayInProduction.push({
							id_client_fk: order.id_client_fk,
							key: order.id_order,
							code: order.code,
							value: order.price_final,
							freight: order.freight,
							is_pdv: order.is_pdv,
							dateRequest: order.data_order,
							observation: order.observation || "-",
							addressClient: order.address_client,
							status: order.status_order,
							products: order.products,
							additionais: order.additionais
						});
					} else if (order.status_order === 2) {
						arrayInReadyForDelivery.push({
							id_client_fk: order.id_client_fk,
							key: order.id_order,
							code: order.code,
							value: order.price_final,
							freight: order.freight,
							is_pdv: order.is_pdv,
							dateRequest: order.data_order,
							observation: order.observation || "-",
							addressClient: order.address_client,
							status: order.status_order,
							products: order.products,
							additionais: order.additionais
						});
					} else {
						arrayInHistoryOfDeliveredOrders.push({
							id_client_fk: order.id_client_fk,
							key: order.id_order,
							code: order.code,
							value: order.price_final,
							freight: order.freight,
							is_pdv: order.is_pdv,
							dateRequest: order.data_order,
							observation: order.observation || "-",
							addressClient: order.address_client,
							status: order.status_order,
							products: order.products,
							additionais: order.additionais
						});
					}
				})
				setAllOrdersInAnalysis(arrayInAnalysis);
				setAllOrdersInProduction(arrayInProduction);
				setAllOrdersInReadyForDelivery(arrayInReadyForDelivery);
				setHistoryOfDeliveredOrders(arrayInHistoryOfDeliveredOrders);
				setLoading(false);
			}).catch((error) => {
				setLoading(false);
				message.error("Erro de comunicação com o servidor! Tente novamente recarregando á página.");
			});
		} catch (error) {
			setLoading(false);
			message.error("Erro de comunicação com o servidor! Tente novamente recarregando á página.");
		}
	}

	return (
		<div>
			<Spin size="large" spinning={loading}>
				<Layout className="container-body">
					<MenuSite open={expand} current={'orders'} openCurrent={''} />
					<Layout>
						<HeaderSite title={'Acompanhamento de pedidos'} isListView={false} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
						<Content className="container-main">
							<Tabs defaultActiveKey="1" size="large" centered onChange={(key) => setTab(key)}>
								<TabPane
									tab={
										<span>
											<IssuesCloseOutlined />
											Pedidos em análise
										</span>
									}
									key="1"
								>
									{
										allOrdersInAnalysis.length !== 0 ? (
											<Table
												size="middle"
												columns={columns}
												dataSource={allOrdersInAnalysis}
												expandable={{
													expandedRowRender: record =>
														<SpaceInformationOrder
															addressClient={record.addressClient}
															products={record.products}
															additionais={record.additionais}
														/>,
													rowExpandable: record => record.products.length !== 0,
												}}
												showSorterTooltip={false}
											/>
										) : (
											<EmptyData title='Não existe pedido (s) em análise no momento ...' />
										)
									}
								</TabPane>
								<TabPane
									tab={
										<span>
											<FieldTimeOutlined />
											Pedidos em produção
										</span>
									}
									key="2"
								>
									{
										allOrdersInProduction.length !== 0 ? (
											<Table
												size="middle"
												columns={columns}
												dataSource={allOrdersInProduction}
												expandable={{
													expandedRowRender: record =>
														<SpaceInformationOrder
															addressClient={record.addressClient}
															products={record.products}
															additionais={record.additionais}
														/>,
													rowExpandable: record => record.products.length !== 0,
												}}
												showSorterTooltip={false}
											/>
										) : (
											<EmptyData title='Não existe pedido (s) em produção no momento ...' />
										)
									}
								</TabPane>
								<TabPane
									tab={
										<span>
											<DeliveredProcedureOutlined />
											Pedidos aguardando retirada
										</span>
									}
									key="3"
								>
									{
										allOrdersInReadyForDelivery.length !== 0 ? (
											<Table
												size="middle"
												columns={columns}
												dataSource={allOrdersInReadyForDelivery}
												expandable={{
													expandedRowRender: record =>
														<SpaceInformationOrder
															addressClient={record.addressClient}
															products={record.products}
															additionais={record.additionais}
														/>,
													rowExpandable: record => record.products.length !== 0,
												}}
												showSorterTooltip={false}
											/>
										) : (
											<EmptyData title='Não existe pedido (s) aguardando retirada no momento ...' />
										)
									}
								</TabPane>
								<TabPane
									tab={
										<span>
											<HistoryOutlined />
											Histórico de pedidos entregues
										</span>
									}
									key="4"
								>
									{
										historyOfDeliveredOrders.length !== 0 ? (
											<Table
												size="middle"
												columns={columns}
												dataSource={historyOfDeliveredOrders}
												expandable={{
													expandedRowRender: record =>
														<SpaceInformationOrder
															addressClient={record.addressClient}
															products={record.products}
															additionais={record.additionais}
														/>,
													rowExpandable: record => record.products.length !== 0,
												}}
												showSorterTooltip={false}
											/>
										) : (
											<EmptyData title='Histórico de pedidos está vázio ...' />
										)
									}
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

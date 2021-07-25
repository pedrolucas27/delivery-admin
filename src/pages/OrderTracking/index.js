import React, { useState, useEffect } from "react";
import API from "../../api.js";
import moment from "moment";
import 'moment/locale/pt-br';
import {
	Layout,
	message,
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
import { changeCommaForPoint } from "../../helpers.js";
import HeaderSite from "../../components/Header";
import MenuSite from "../../components/Menu";
import FooterSite from "../../components/Footer";
import SpaceInformationOrder from "../../components/SpaceInformationOrder";
import EmptyData from "../../components/EmptyData";
const { Content } = Layout;
const { TabPane } = Tabs;
function OrderTracking() {
	const [expand, setExpand] = useState(false);
	const [loading, setLoading] = useState(false);
	const [tab, setTab] = useState("1");
	const [allOrdersInProduction, setAllOrdersInProduction] = useState([]);
	const [allOrdersInAnalysis, setAllOrdersInAnalysis] = useState([]);
	const [allOrdersInReadyForDelivery, setAllOrdersInReadyForDelivery] = useState([]);
	const [historyOfDeliveredOrders, setHistoryOfDeliveredOrders] = useState([]);

	useEffect(() => {
		try{
			let arrayInAnalysis = [];
			let arrayInProduction = [];
			let arrayInReadyForDelivery = [];
			let arrayInHistoryOfDeliveredOrders = [];
			API.get("order").then((response) => {
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
					} else if(order.status_order === 2){
						arrayInReadyForDelivery.push({
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
					} else{
						arrayInHistoryOfDeliveredOrders.push({
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
				setAllOrdersInReadyForDelivery(arrayInReadyForDelivery);
				setHistoryOfDeliveredOrders(arrayInHistoryOfDeliveredOrders);
			}).catch((error) => {
				message.error("Erro de comunicação com o servidor! Tente novamente recarregando á página.");
			});
		}catch (error) {
			message.error("Erro de comunicação com o servidor! Tente novamente recarregando á página.");
		}
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
						{moment(record.dateRequest).format("DD-MM-YYYY [ás] HH:MM:SS")}
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
									<DeleteOutlined 
										className="icon-table"
										onClick={() => deleteOrder(record.key)} 
									/>
								</Tooltip>
							)
						}
						{
							tab !== "1" && tab !== "4" && (
								<Tooltip placement="top" title='Atualizar status do pedido para uma etapa anterior'>
									<UndoOutlined
										className="icon-table"
										onClick={() => updateStatusOrder(record.key, false, record.status)}
									/>
								</Tooltip>
							)
						}
						{
							tab !== "3" && tab !== "4" && (
								<Tooltip placement="top" title='Atualizar status do pedido para à próxima etapa'>
									<RedoOutlined
										className="icon-table"
										onClick={() => updateStatusOrder(record.key, true, record.status)}
									/>
								</Tooltip>
							)
						}
						{
							(tab === "3" || tab === "4") && (
								<Tooltip 
									placement="top" 
									title={tab === "3" ? "Gerar nota fiscal e enviar para entrega.":"Gerar nota fiscal novamente."}
								>
									<ContainerOutlined
										className="icon-table"
										onClick={() => generateInvoiceOrder(record.status, record.key)}
									/>
								</Tooltip>
							)
						}
					</div>
				)
			},
		},
	];

	const generateInvoiceOrder = async (tab, idOrder) => {
		if(tab === 2){
			setLoading(true);
			try{
				const response = await API.put("order-status",
					{
						id_order: idOrder,
						status_order: 3
					}
				);
				if (response.status === 200) {
					getOrders();
					setTimeout(() => {
						setLoading(false);
						message.success(response.data.message);
					}, 1500);
				} else {
					setLoading(false);
					message.error(response.data.message);
				}
			}catch(error){
				setLoading(false);
				message.error("Erro de comunicação com o servidor.");
			}
		} 
		try{
			setLoading(true);
			const response = await API.get("generate-invoice/" + idOrder);
			if(response.status === 200){
				//imprimir pdf
				setLoading(false);
				message.success(response.data.message);
				window.location.href(response.data.pdf);
				window.open(response.data.pdf, '_blank');
			}else{
				setLoading(false);
				message.error(response.data.message);
			}
		}catch(error){
			setLoading(false);
			message.error("Erro de comunicação com o servidor.");
		}
	}

	const deleteOrder = async (idOrder) => {
		setLoading(true);
		try{
			await API.delete("order/" + idOrder).then(response => {
				if (response.status === 200) {
					getOrders();
					setLoading(false);
					message.success(response.data.message);
					window.location.href(response.data.pdf);
					window.open(response.data.pdf, '_blank');
				} else {
					setLoading(false);
					message.error(response.data.message);
				}
			}).catch(error => {
				setLoading(false);
				message.error("Erro de comunicação com o servidor.");
			});
		}catch (error) {
			message.error("Erro de comunicação com o servidor.");
		}
	}

	const updateStatusOrder = async (idOrder, flag, status) => {
		setLoading(true);
		const newStatus = flag ? (status + 1):(status - 1)
		try{
			const response = await API.put("order-status",
				{
					id_order: idOrder,
					status_order: newStatus
				}
			);
			if (response.status === 200) {
				getOrders();
				setTimeout(() => {
					setLoading(false);
					message.success(response.data.message);
				}, 1500);
			} else {
				setLoading(false);
				message.error(response.data.message);
			}
		}catch(error){
			message.error("Erro de comunicação com o servidor.");
		}
	}

	const getOrders = async () => {
		setLoading(true);
		try{
			let arrayInAnalysis = [];
			let arrayInProduction = [];
			let arrayInReadyForDelivery = [];
			let arrayInHistoryOfDeliveredOrders = [];
			API.get("order").then((response) => {
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
					}else if(order.status_order === 2){
						arrayInReadyForDelivery.push({
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
					} else{
						arrayInHistoryOfDeliveredOrders.push({
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
				setAllOrdersInReadyForDelivery(arrayInReadyForDelivery);
				setHistoryOfDeliveredOrders(arrayInHistoryOfDeliveredOrders);
				setLoading(false);
			}).catch((error) => {
				setLoading(false);
				message.error("Erro de comunicação com o servidor! Tente novamente recarregando á página.");
			});
		}catch (error) {
			setLoading(false);
			message.error("Erro de comunicação com o servidor! Tente novamente recarregando á página.");
		}
	}

	return (
		<div>
			<Spin size="large" spinning={loading}>
				<Layout>
					<MenuSite open={expand} current={'orders'} openCurrent={''}/>
					<Layout className="site-layout">
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
													expandedRowRender: record => <SpaceInformationOrder addressClient={record.addressClient} products={record.products} />,
													rowExpandable: record => record.products.length !== 0,
												}}
											/>
										):(
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
													expandedRowRender: record => <SpaceInformationOrder addressClient={record.addressClient} products={record.products} />,
													rowExpandable: record => record.products.length !== 0,
												}}
											/>
										):(
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
													expandedRowRender: record => <SpaceInformationOrder addressClient={record.addressClient} products={record.products} />,
													rowExpandable: record => record.products.length !== 0,
												}}
											/>
										):(
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
													expandedRowRender: record => <SpaceInformationOrder addressClient={record.addressClient} products={record.products} />,
													rowExpandable: record => record.products.length !== 0,
												}}
											/>
										):(
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

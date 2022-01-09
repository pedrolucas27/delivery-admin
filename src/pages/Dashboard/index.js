import React, { useState, useEffect } from "react";

import moment from "moment";
import {
	Layout,	
	Row,
	Col,
	message,
	Card,
	Typography,
	Statistic,
	Spin
} from 'antd';
import HeaderSite from "../../components/Header";
import MenuSite from "../../components/Menu";
import FooterSite from "../../components/Footer";
import PieChart from "../../components/PieChart";
import LineChartComponent from "../../components/LineChartComponent";
import {
	UserOutlined,
	DeliveredProcedureOutlined,
	ShopOutlined
} from '@ant-design/icons';
import API from "../../api.js";
import { getStorageERP, isLoggedAdmin } from "../../helpers.js";
const { Content } = Layout;
const { Title } = Typography;

function Dashboard(){
	isLoggedAdmin();
	
	const { idEstablishment } = getStorageERP();
	const [expand, setExpand] = useState(false);
	const [loading, setLoading] = useState(false);
	const [dataDashboard, setDataDashboard] = useState('');
	const [filterDash, setFilterDash] = useState("day");
	const [dataGraphLine, setDataGraphLine] = useState([]);
	const [dataGraphPie, setDataGraphPie] = useState([]); 
	const dateChangeRender = moment([]).format("DD-MM-YYYY");
	useEffect(() => {
	    getDataDay(dateChangeRender);
	}, []);

	const getDataDay = async (day) => {
		setLoading(true);
		let dateArray = String(day).split("-");
		let dayFormater = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
		try{
			await API.get('date-day/' + dayFormater + "/" + idEstablishment).then((response) => {
				setFilterDash("day");
				setDataGraphPie(response.data.dataGraph);
				setDataDashboard(response.data);
				setLoading(false);
			}).catch((error) => {
				setLoading(false);
				message.error("Erro de comunicação com o servidor! Tente novamente recarregando á página.");
			})
		} catch (error) {
			setLoading(false);
			message.error("Erro de comunicação com o servidor! Tente novamente recarregando á página.");
		}
  	};

  	const getDataMonth = async (month) => {
  		setLoading(true);
  		let arrayDate = String(month).split("-");
  		let startMonth = `${arrayDate[1]}-${arrayDate[0]}-01`;
  		let endMonth = moment(`${arrayDate[1]}-${arrayDate[0]}-01`).endOf("month").format('YYYY-MM-DD');
		try{
			await API.get('date-month/' + startMonth + '/' + endMonth + "/" + idEstablishment).then((response) => {
				setFilterDash("month");
				setDataGraphLine(response.data.dataGraph);
				setDataDashboard(response.data);
				setLoading(false);
			}).catch((error) => {
				setLoading(false);
				message.error("Erro de comunicação com o servidor! Tente novamente recarregando á página.");
			})
		} catch (error) {
			setLoading(false);
			message.error("Erro de comunicação com o servidor! Tente novamente recarregando á página.");
		}
  	};
  	
	return(
		<div>
			<Spin size="large" spinning={loading}>
				<Layout className="container-body">
					<MenuSite onTitle={!expand} open={expand} current={'dashboard'} openCurrent={''} />
					<Layout>
						<HeaderSite 
							title={'Relatório'} 
							isListView={false} 
							isDashboard={true} 
							expandMenu={expand} 
							updateExpandMenu={() => setExpand(!expand)}
							filterDataDay={(day) => getDataDay(day)}
							filterDataMonth={(month) => getDataMonth(month)} 
							dateChange={dateChangeRender}
						/>
						<Content className="container-main">
							<Row gutter={[8, 8]}>
								<Col span={8}>
									<Card hoverable className="card-statistic">
										<Statistic 
											title={
												<Title level={4}>N° de clientes cadastrados no aplicativo</Title>
											} 
											value={dataDashboard.clients_restired || 0} 
											prefix={<UserOutlined />} 
										/>
									</Card>
								</Col>
								<Col span={8}>
									<Card hoverable className="card-statistic">
										<Statistic 
											title={
												<Title level={4}>N° de pedidos realizados no Ponto de Venda</Title>
											} 
											value={dataDashboard.orders_pdv || 0} 
											prefix={<ShopOutlined />} 
										/>
									</Card>
								</Col>
								<Col span={8}>
									<Card hoverable className="card-statistic">
										<Statistic 
											title={
												<Title level={4}>N° de pedidos realizados no Delivery</Title>
											} 
											value={dataDashboard.orders_delivery || 0} 
											prefix={<DeliveredProcedureOutlined />} 
										/>
									</Card>
								</Col>
								<Col span={24}>
									<Card 
										title={
											<Title level={4}>Vendas em R$ realizadas no Pdv e Delivery</Title>
										} 
										hoverable
										className="card-chart"
									>
										{
											filterDash === "month" ? (
												<div>
													<LineChartComponent data={dataGraphLine}/>
												</div>
											):(
												<div>
													<PieChart data={dataGraphPie}/>
												</div>
											)
										}
									</Card>
								</Col>
							</Row>
						</Content>
						<FooterSite />
					</Layout>
				</Layout>
			</Spin>
		</div>
	);
}
export default Dashboard;

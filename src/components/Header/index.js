import React, { useState } from "react";
import 'moment/locale/pt-br';
import ptBR from 'antd/lib/locale/pt_BR';
import moment from "moment";
import {
	Layout,
	Row,
	Col,
	Typography,
	Radio,
	Space,
	DatePicker,
	ConfigProvider,
	Input
} from 'antd';
import {
	MenuUnfoldOutlined,
	MenuFoldOutlined
} from '@ant-design/icons';
import 'antd/dist/antd.css';
const { Header } = Layout;
const { Title } = Typography;
function HeaderSite(props) {
	const [filterDash, setFilterDash] = useState("day");
	function onChangeDateFilter(date, dateString) {
		if(filterDash === "day"){
			props.filterDataDay(dateString);
		}else{
			props.filterDataMonth(dateString);
		}
	}
	return (
		<Header style={{ padding: 0, backgroundColor: '#fff' }}>
			<Row>
				<Col span={props.isDashboard ? 14:16}>
					{
						props.expandMenu ? (
							<MenuUnfoldOutlined className='trigger' onClick={props.updateExpandMenu} />
						) : (
							<MenuFoldOutlined className='trigger' onClick={props.updateExpandMenu} />
						)
					}
					<h2 style={{ display: 'inline-block' }}>{props.title}</h2>
				</Col>
				<Col span={props.isDashboard ? 10:8}>
					{
						props.isListView && (
							<Input className="input-radius" placeholder="Pesquisar por nome, código ..." />
						)
					}
					{
						props.isDashboard && (
							<Row>
								<Col span={6}>
									<Title level={4} style={{ paddingTop: "15px", margin: 0 }}>
										Filtrar por:
									</Title>
								</Col>
								<Col span={8}>
									<Radio.Group
								        value={filterDash}
								        onChange={(e) => setFilterDash(e.target.value)}
							        >
							        	<Space >
							        		<Radio value="day">Dia</Radio>
								        	<Radio value="month">Mês</Radio>
							        	</Space>
							        </Radio.Group>
								</Col>
								<Col span={10}>
									<ConfigProvider locale={ptBR}>
										{
											filterDash === "day" ? (
												<DatePicker 
													onChange={onChangeDateFilter} 
													placeholder="Selecione o dia" 
													defaultValue={moment(props.dateChange, 'DD-MM-YYYY')}
													format="DD-MM-YYYY" 
												/>
											):(
												<DatePicker onChange={onChangeDateFilter} placeholder="Selecione o mês" picker="month" format="MM-YYYY" />
											)
										}
									</ConfigProvider>
								</Col>
							</Row>
						)
					}
				</Col>
			</Row>

		</Header>
	);
}
export default HeaderSite;

		
import React, { useState } from "react";
import 'moment/locale/pt-br';
import ptBR from 'antd/lib/locale/pt_BR';
import moment from "moment";
import {
	Layout,
	Row,
	Col,
	Typography,
	Switch,
	Radio,
	Space,
	DatePicker,
	ConfigProvider
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
	const [dateTeste, setDateTeste] = useState(moment(props.dateChange, 'DD-MM-YYYY'));
	function onChangeDateFilter(date, dateString) {
		setDateTeste(date);
		if (filterDash === "day") {
			props.filterDataDay(dateString);
		} else {
			props.filterDataMonth(dateString);
		}
	}

	function handleTypeFilterGraph(type) {
		if (type === "day") {
			props.filterDataDay(dateTeste._i);
		} else {
			let dateFormated = moment(dateTeste).format("MM-YYYY");
			props.filterDataMonth(dateFormated);
		}
		setFilterDash(type);
	}

	const onChangeOperationCompany = (status) => {
		props.changeOperation(status);
	}

	return (
		<Header style={{ padding: 0, backgroundColor: '#fff' }}>
			<Row>
				<Col span={props.isHeaderMyCompany ? 19 : 16}>
					{
						props.expandMenu ? (
							<MenuUnfoldOutlined className='trigger' onClick={props.updateExpandMenu} />
						) : (
							<MenuFoldOutlined className='trigger' onClick={props.updateExpandMenu} />
						)
					}
					<h2 style={{ display: 'inline-block' }}>{props.title}</h2>
				</Col>


				{
					props.isHeaderMyCompany && (
						<Col span={4} style={{ position: 'absolute', right: '0' }}>
							<Switch
								checkedChildren="Estabelecimento aberto"
								unCheckedChildren="Estabelecimento fechado"
								checked={props.defaultOperation}
								onChange={onChangeOperationCompany}
							/>
						</Col>

					)
				}

				{
					props.isDashboard && (
						<Col span={8} style={{ float: 'right' }}>
							<Row>
								<Col span={6}>
									<Title level={5} style={{ marginTop: 20 }}>
										Filtrar por:
									</Title>
								</Col>
								<Col span={18}>
									<Row>
										<Col span={10}>
											<Radio.Group
												value={filterDash}
												onChange={(e) => handleTypeFilterGraph(e.target.value)}
											>
												<Space>
													<Radio value="day">Dia</Radio>
													<Radio value="month">Mês</Radio>
												</Space>
											</Radio.Group>
										</Col>
										<Col span={14}>
											<ConfigProvider locale={ptBR}>
												{
													filterDash === "day" ? (
														<DatePicker
															onChange={onChangeDateFilter}
															placeholder="Selecione o dia"
															defaultValue={moment(props.dateChange, 'DD-MM-YYYY')}
															format="DD-MM-YYYY"
														/>
													) : (
														<DatePicker
															onChange={onChangeDateFilter}
															placeholder="Selecione o mês"
															picker="month"
															format="MM-YYYY"
														/>
													)
												}
											</ConfigProvider>
										</Col>
									</Row>
								</Col>
							</Row>
						</Col>
					)
				}

			</Row>
		</Header >
	);
}
export default HeaderSite;


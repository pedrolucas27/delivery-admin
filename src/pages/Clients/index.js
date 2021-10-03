import React, { useState, useEffect } from "react";
import moment from "moment";
import API from "../../api.js";
import { getStorageERP, maskPhoneCell, isLoggedAdmin } from "../../helpers.js";
import {
	Layout,
	Table,
	Tooltip,
	message,
	Popconfirm,
	Spin
} from 'antd';
import {
	DeleteOutlined
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import '../../global.css';
import HeaderSite from "../../components/Header";
import MenuSite from "../../components/Menu";
import FooterSite from "../../components/Footer";
const { Content } = Layout;


function Clients() {
	isLoggedAdmin();

	const { idEstablishment } = getStorageERP();
	const [expand, setExpand] = useState(false);
	const [dataClient, setDataClient] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		getClients();
	}, []);

	const columns = [
		{ title: 'Código', dataIndex: 'code', key: 'code' },
		{ title: 'Nome', dataIndex: 'name', key: 'name' },
		{ title: 'E-mail', dataIndex: 'email', key: 'email' },
		{ title: 'Telefone celular', dataIndex: 'phoneCell', key: 'phoneCell',
			render: (__, record) => {
				return (
					<div>
						{maskPhoneCell(record.phoneCell)}
					</div>
				);
			}

		},
		{
			title: 'Data de cadastrado',
			dataIndex: 'dateRegister',
			key: 'dateRegister',
			render: (__, record) => {
				return (
					<div>
						{moment(record.dateRegister).format("DD-MM-YYYY")}
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
						<Tooltip placement="top" title='Deletar cliente'>
							<DeleteOutlined className="icon-table" onClick={() => deleteClient(record.key)} />
						</Tooltip>
					</div>
				)
			},
		},
	];

	const deleteClient = async (idClient) => {
		setLoading(true);
		try{
			const response = await API.delete("client/" + idClient + "/" + idEstablishment);
			setLoading(false);
			if(response.status === 200){
				getClients();
				message.success(response.data.message);
			}else{
				message.error(response.data.message);
			}
		}catch (error) {
			setLoading(false);
			message.error("Erro de comunicação com o servidor.");
		}
	}

	const getClients = async () => {
		setLoading(true);
		try{
			API.get("client/" + idEstablishment)
			.then((response) => {
				let array = [];
				response.data.forEach((client) => {
					array.push({
						key: client.id_client,
						code: client.code,
						name: client.name_client,
						email: client.email_client,
						phoneCell: client.phone_client,
						dateRegister: client.date_register
					})
				})
				setDataClient(array);
				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
				message.error("Erro de comunicação com o servidor.");
			})
		}catch (error) {
			setLoading(false);
			message.error("Erro de comunicação com o servidor.");
		}
	}


	return (
		<div>
			<Spin size="large" spinning={loading}>
				<Layout>
					<MenuSite onTitle={!expand} open={expand} current={'clients'} />
					<Layout className="site-layout">
						<HeaderSite title={'Clientes cadastrados'} isListView={true} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
						<Content className="container-main">
							<Table
								size="middle"
								columns={columns}
								dataSource={dataClient}
							/>
						</Content>
						<FooterSite />
					</Layout>
				</Layout>
			</Spin>
		</div>
	);
}
export default Clients;

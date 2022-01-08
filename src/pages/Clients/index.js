import React, { useState, useEffect } from "react";
import moment from "moment";
import API from "../../api.js";
import {
	getStorageERP,
	maskPhoneCell,
	isLoggedAdmin
} from "../../helpers.js";
import {
	Layout,
	Table,
	Tooltip,
	message,
	Popconfirm,
	Spin,
	Typography
} from 'antd';
import {
	DeleteOutlined,
	EditOutlined
} from '@ant-design/icons';
import HeaderSite from "../../components/Header";
import MenuSite from "../../components/Menu";
import FooterSite from "../../components/Footer";
import ModalAddPassword from "./components/ModalAddPassword";
import 'antd/dist/antd.css';
import '../../global.css';
const { Content } = Layout;
const { Title } = Typography;
function Clients() {
	isLoggedAdmin();

	const { idEstablishment } = getStorageERP();
	const [expand, setExpand] = useState(false);
	const [dataClient, setDataClient] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [idClient, setIdClient] = useState(null);

	useEffect(() => {
		getClients();
	}, []);

	const columns = [
		{ title: 'Código', dataIndex: 'code', key: 'code' },
		{ title: 'Nome', dataIndex: 'name', key: 'name' },
		{ title: 'E-mail', dataIndex: 'email', key: 'email' },
		{
			title: 'Telefone celular', dataIndex: 'phoneCell', key: 'phoneCell',
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
							<Popconfirm
								title="Tem certeza que deseja deletar ?"
								onConfirm={() => deleteClient(record.key)}
								okText="Sim"
								cancelText="Não"
							>
								<DeleteOutlined className="icon-table" />
							</Popconfirm>
						</Tooltip>
						<Tooltip placement="top" title='Atualizar senha do cliente'>
							<EditOutlined
								className="icon-table"
								onClick={() => {
									setIdClient(record.key);
									setShowModal(!showModal);
								}}
							/>
						</Tooltip>
					</div>
				)
			},
		},
	];

	const deleteClient = async (idClient) => {
		setLoading(true);
		try {
			const response = await API.delete("client/" + idClient + "/" + idEstablishment);
			setLoading(false);
			if (response.status === 200) {
				getClients();
				message.success(response.data.message);
			} else {
				message.error(response.data.message);
			}
		} catch (error) {
			setLoading(false);
			message.error("Erro de comunicação com o servidor.");
		}
	}

	const getClients = async () => {
		setLoading(true);
		try {
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
		} catch (error) {
			setLoading(false);
			message.error("Erro de comunicação com o servidor.");
		}
	}

	const updatePasswordClinet = async (data) => {
		if (String(data.newPassword).length >= 6) {
			if (data.newPassword === data.newPasswordConfirm) {
				let obj = {
					password: data.newPassword,
					id_client: idClient,
					id_company: idEstablishment
				}
				const result = await API.put("client-update-passw", obj);
				if (result.status === 200) {
					message.success(result.data.message);
					setShowModal(!showModal);

					setTimeout(() => { window.location.reload(); }, 2000);
				} else {
					message.error(result.data.message);
				}
			} else {
				message.error("Senhas incompatíveis.");
			}
		} else {
			message.error("A senha deve conter no mínimo 6 dígitos.");
		}
	}

	return (
		<div>
			<Spin size="large" spinning={loading}>
				<Layout className="container-body">
					<MenuSite onTitle={!expand} open={expand} current={'clients'} />
					<Layout className="site-layout">
						<HeaderSite title={'Clientes cadastrados'} isListView={true} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
						<Content className="container-main">
							<Table
								size="middle"
								columns={columns}
								dataSource={dataClient}
								locale={{
									emptyText: (
										<Title level={4} style={{ margin: 30 }}>Não existe clientes cadastrados no Delivery.</Title>
									)
								}}
							/>
						</Content>
						<FooterSite />
					</Layout>
				</Layout>
				<ModalAddPassword
					isVisibleNewPassword={showModal}
					onCancelNewPassword={() => setShowModal(!showModal)}
					savePassword={(data) => updatePasswordClinet(data)}
				/>
			</Spin>
		</div>
	);
}
export default Clients;
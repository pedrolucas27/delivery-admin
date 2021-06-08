import React, { useState, useEffect } from "react";
import axios from "axios";

import {
	Layout,
	Button,
	Row,
	Col,
	Drawer,
	Table,
	Form,
	Input,
	Tooltip,
	Switch,
	Spin,
	Select,
	message
} from 'antd';
import {
	DeleteOutlined,
	EditOutlined
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import '../../global.css';

import HeaderSite from "../../components/Header";
import MenuSite from "../../components/Menu";
import FooterSite from "../../components/Footer";

const { Content } = Layout;
const { TextArea } = Input;
const { Option } = Select;

const BASE_URL = "http://localhost:8080/";

function Flavors() {
	const [expand, setExpand] = useState(false);
	const [expandEditRow, setExpandEditRow] = useState(false);
	const [data, setData] = useState([]);
	const [idUpdate, setIdUpdate] = useState(null);
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [dataCategory, setDataCategory] = useState([]);

	useEffect(() => {
		try {
			axios.get(BASE_URL + "category").then((response) => {
				setDataCategory(response.data);
			}).catch((error) => {
				console.log("BUGOU: " + error);
			});

			axios.get(BASE_URL + "flavor").then((response) => {
				let array = [];
				response.data.forEach((flavor) => {
					array.push({
						key: flavor.id,
						code: flavor.code,
						name: flavor.name_flavor,
						description: flavor.description || "-",
						category: flavor.id_category,
						status: flavor.is_active
					})
				})
				setData(array);
			}).catch((error) => {
				console.log("BUGOU: " + error);
			});
		} catch (error) {
			message.error("Erro de comunicação com o servidor.");
		}

	}, []);


	const columns = [
		{ title: 'Código', dataIndex: 'code', key: 'code' },
		{ title: 'Nome', dataIndex: 'name', key: 'name' },
		{ title: 'Descrição', dataIndex: 'description', key: 'description' },
		{
			title: 'Categoria pertencente',
			dataIndex: 'category',
			key: 'category',
			render: (__, record) => {
				return (
					<div>
						{ typeof (dataCategory.filter((item) => item.id_category === record.category)[0].name_category) || "-"}
					</div>
				);
			}
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (__, record) => {
				return (
					<div>
						{ record.status ? "Ativo" : "Inativo"}
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
						<Tooltip placement="top" title='Deletar sabor'>
							<DeleteOutlined className="icon-table" onClick={() => deleteFlavor(record.key)} />
						</Tooltip>
						<Tooltip placement="top" title='Editar sabor'>
							<EditOutlined className="icon-table" onClick={() => setFildsDrawer(record.key)} />
						</Tooltip>
					</div>
				)
			},
		},
	];


	const getFlavors = async () => {
		try {
			await axios.get(BASE_URL + "flavor").then((response) => {
				let array = [];
				response.data.forEach((flavor) => {
					array.push({
						key: flavor.id,
						code: flavor.code,
						name: flavor.name_flavor,
						description: flavor.description || "-",
						category: flavor.id_category,
						status: flavor.is_active
					})
				})
				setData(array);
			}).catch((error) => {
				message.error("Erro de comunicação com o servidor.");
			});
		} catch (error) {
			message.error("Erro de comunicação com o servidor.");
		}
	}



	const deleteFlavor = async (id) => {
		try {
			setLoading(true);
			await axios.delete(BASE_URL + "flavor/" + id).then(response => {
				if (response.status === 200) {
					getFlavors();
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
			setLoading(false);
			message.error("Erro de comunicação com o servidor, tente novamente!");
		}
	}

	const updateFlavor = async (values) => {
		try {
			setLoading(true);
			if (values.name_flavor && values.category) {
				const response = await axios.put(BASE_URL + "flavor",
					{
						id: idUpdate,
						name_flavor: values.name_flavor,
						description: values.description,
						is_active: values.is_active,
						id_category: values.category
					}
				);

				if (response.status === 200) {
					getFlavors();
					setLoading(false);
					message.success(response.data.message);
					setExpandEditRow(!expandEditRow);
				} else {
					setLoading(false);
					message.error(response.data.message);
				}

			} else {
				setLoading(false);
				message.error("Informe o nome do sabor, por favor !");
			}
		} catch (error) {
			setLoading(false);
			message.error("Erro de comunicação com o servidor, tente novamente!");
		}

	}

	const setFildsDrawer = (id) => {
		const line = data.filter((item) => item.key === id)[0];
		setIdUpdate(id);

		form.setFieldsValue({
			name_flavor: line.name,
			description: line.description,
			is_active: line.status,
			category: line.category
		});

		setExpandEditRow(!expandEditRow);
	}


	return (
		<div>
			<Spin size="large" spinning={loading}>
				<Layout>
					<MenuSite open={expand} current={'flavors'} openCurrent={'list'} />
					<Layout className="site-layout">
						<HeaderSite title={'Listagem de sabores'} isListView={true} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
						<Content className="container-main">
							<Table
								size="middle"
								columns={columns}
								dataSource={data}
							/>
						</Content>
						<FooterSite />
					</Layout>
				</Layout>

				<Drawer
					title="Editar sabor"
					width={720}
					onClose={() => setExpandEditRow(!expandEditRow)}
					visible={expandEditRow}
					bodyStyle={{ paddingBottom: 80 }}>
					<Form layout="vertical" form={form} onFinish={updateFlavor}>
						<Row gutter={[16, 16]}>
							<Col span={14}>
								<Form.Item label="Nome" name="name_flavor">
									<Input className="input-radius" />
								</Form.Item>
							</Col>
							<Col span={6}>
								<Form.Item label="Categoria" name="category">
									<Select>
										{
											dataCategory.map((item) => (
												<Option key={item.code} value={item.id_category}>
													{item.name_category}
												</Option>
											)
											)
										}
									</Select>
								</Form.Item>
							</Col>
							<Col span={4}>
								<Form.Item label="Status" name="is_active" valuePropName="checked">
									<Switch />
								</Form.Item>
							</Col>

							<Col span={24}>
								<Form.Item label="Descrição" name="description">
									<TextArea rows={4} className="input-radius" />
								</Form.Item>
							</Col>

							<Col span={24}>
								<Button onClick={() => form.submit()} shape="round" className="button ac">
									Editar
							    </Button>
								<Button onClick={() => setExpandEditRow(!expandEditRow)} shape="round" className="button-cancel ac">
									Cancelar
							    </Button>
							</Col>
						</Row>
					</Form>
				</Drawer>
			</Spin>
		</div>
	);
}

export default Flavors;

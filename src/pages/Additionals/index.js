import React, { useState, useEffect } from "react";
import API from "../../api.js";
import { maskMoney, changeCommaForPoint, getStorageERP, isLoggedAdmin } from "../../helpers.js";
import {
	Layout,
	Button,
	Form,
	Select,
	Switch,
	Input,
	Row,
	Col,
	Table,
	Tooltip,
	Drawer,
	message,
	Spin
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
function Additionals() {
	isLoggedAdmin();

	const { idEstablishment } = getStorageERP();
	const [expand, setExpand] = useState(false);
	const [expandEditRow, setExpandEditRow] = useState(false);
	const [idUpdate, setIdUpdate] = useState(null);
	const [form] = Form.useForm();
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [dataCategory, setDataCategory] = useState([]);
	useEffect(() => {
			setLoading(true);
			getAdditionals();
			setLoading(false);
	}, []);

	const columns = [
		{ title: 'Código', dataIndex: 'code', key: 'code' },
		{ title: 'Nome', dataIndex: 'name', key: 'name' },
		{ title: 'Descrição', dataIndex: 'description', key: 'description' },
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
						<Tooltip placement="top" title='Deletar adicional'>
							<DeleteOutlined className="icon-table" onClick={() => deleteAdditional(record.key)} />
						</Tooltip>
						<Tooltip placement="top" title='Editar adicional'>
							<EditOutlined className="icon-table" onClick={() => setFildsDrawer(record.key)} />
						</Tooltip>
					</div>
				)
			},
		},
	];

	const getAdditionals = async () => {
		try {
			API.get("category/" + idEstablishment).then((response) => {
				setDataCategory(response.data);
			}).catch((error) => {
				message.error("Erro de comunicação com o servidor.");
			});
			API.get("additional/" + idEstablishment).then((response) => {
				let array = [];
				response.data.forEach((additional) => {
					array.push({
						key: additional.id,
						code: additional.code,
						name: additional.name,
						description: additional.description || "-",
						value: additional.price,
						status: additional.is_active,
						id_category: additional.id_category
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

	const deleteAdditional = async (id) => {
		setLoading(true);
		try {
			API.delete("additional/" + id + "/" + idEstablishment).then(response => {
				if (response.status === 200) {
					getAdditionals();
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

	const updateAdditional = async (values) => {
		try {
			setLoading(true);
			if (values.name_additional && values.category && values.price) {
				const response = await API.put("additional",
					{
						id: idUpdate,
						name: values.name_additional,
						description: values.description || null,
						price: Number(values.price.replace(",", ".")),
						is_active: values.is_active !== undefined ? values.is_active : true,
						id_category: values.category,
						id_company: idEstablishment
					}
				);
				if (response.status === 200) {
					getAdditionals();
					setLoading(false);
					message.success(response.data.message);
					setExpandEditRow(!expandEditRow);
				} else {
					setLoading(false);
					message.error(response.data.message);
				}
			} else {
				setLoading(false);
				message.error("Informe os campos pedidos, por favor !");
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
			name_additional: line.name,
			price: changeCommaForPoint(line.value),
			is_active: line.status,
			description: line.description,
			category: line.id_category
		});
		setExpandEditRow(!expandEditRow);
	}

	const handleChangePrice = async () => {
		const field = form.getFieldValue("price");
		form.setFieldsValue({ price: await maskMoney(field) });
	}

	return (
		<div>
			<Spin size="large" spinning={loading}>
				<Layout>
					<MenuSite onTitle={!expand} open={expand} current={'additionals'} openCurrent={'list'} />
					<Layout className="site-layout">
						<HeaderSite title={'Listagem de adicionais'} isListView={true} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
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
					title="Editar adicional"
					width={720}
					onClose={() => setExpandEditRow(!expandEditRow)}
					visible={expandEditRow}
					bodyStyle={{ paddingBottom: 80 }}>
					<Form layout="vertical" form={form} onFinish={updateAdditional}>
						<Row gutter={[16, 16]}>
							<Col span={8}>
								<Form.Item label="Nome" name="name_additional">
									<Input className="input-radius" />
								</Form.Item>
							</Col>
							<Col span={6}>
								<Form.Item label="Categoria" name="category">
									<Select>
										{
											dataCategory.map((item) => (
												<Option key={item.id_category} value={item.id_category}>
													{item.name_category}
												</Option>
											)
											)
										}
									</Select>
								</Form.Item>
							</Col>
							<Col span={5}>
								<Form.Item label="Preço" name="price">
									<Input className="input-radius" onKeyUp={handleChangePrice} />
								</Form.Item>
							</Col>
							<Col span={5}>
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
export default Additionals;

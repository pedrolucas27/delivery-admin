import React, { useState, useEffect } from "react";
import API from "../../api.js";
import { maskMoney, changeCommaForPoint, getStorageERP, isLoggedAdmin } from "../../helpers.js";
import {
	Row,
	Col,
	Input,
	Select,
	Layout,
	Button,
	Tooltip,
	Form,
	Table,
	Spin,
	message,
	Popconfirm,
	Switch,
	Drawer
} from 'antd';
import 'antd/dist/antd.css';
import '../../global.css';
import {
	DeleteOutlined,
	EditOutlined,
	PlusOutlined
} from '@ant-design/icons';
import HeaderSite from "../../components/Header";
import MenuSite from "../../components/Menu";
import FooterSite from "../../components/Footer";
import ListProductsPromotion from "../../components/ListProductsPromotion";
const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
function Promotions() {
	isLoggedAdmin();

	const { idEstablishment } = getStorageERP();
	const [expand, setExpand] = useState(false);
	const [expandEditRow, setExpandEditRow] = useState(false);
	const [loading, setLoading] = useState(false);
	const [dataPromotion, setDataPromotion] = useState([]);
	const [dataCategory, setDataCategory] = useState([]);
	const [dataFlavor, setDataFlavor] = useState([]);
	const [dataProductsFilter, setDataProductsFilter] = useState([]);
	const [dataTable, setDataTable] = useState([]);
	const [idUpdate, setIdUpdate] = useState(null);
	const [form] = Form.useForm();
	const [idCategoryProductPromotion, setIdCategoryProductPromotion] = useState(null);
	useEffect(() => {
		try {
			setLoading(true);
			getPromotions();
			form.setFieldsValue({ price_promotion: maskMoney(0) });
			API.get("category/" + idEstablishment).then((response) => {
				setDataCategory(response.data);
			}).catch((error) => {
				message.error("Erro de comunicação com o servidor.");
			});
			setLoading(false);
		} catch (error) {
			message.error("Erro de comunicação com o servidor.");
		}
	}, []);

	const getFlavorsByCategory = async (idCategory) => {
		setLoading(true);
		setIdCategoryProductPromotion(idCategory);
		await API.get("flavor/byCategory/" + idCategory + "/" + idEstablishment).then((response) => {
			setDataFlavor(response.data);
			setLoading(false);
		}).catch((error) => {
			setLoading(false);
			message.error("Erro de comunicação com o servidor.");
		});

	}

	const getProductsByCategoryAndFlavor = async (idFlavor) => {
		setLoading(true);
		await API.get("product/others/" + idCategoryProductPromotion + "/" + idFlavor + "/" + idEstablishment).then((response) => {
			setDataProductsFilter(response.data);
			setLoading(false);
		}).catch((error) => {
			setLoading(false);
			message.error("Erro de comunicação com o servidor.");
		});
	}

	const columns = [
		{ title: 'Código', dataIndex: 'code', key: 'code' },
		{ title: 'Nome', dataIndex: 'name', key: 'name' },
		{ title: 'Descrição', dataIndex: 'description', key: 'description' },
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
						<Tooltip placement="top" title='Deletar promoção' onClick={() => deletePromotion(record.key)}>
							<DeleteOutlined className="icon-table" />
						</Tooltip>
						<Tooltip placement="top" title='Editar promoção' onClick={() => setFildsDrawer(record.key)}>
							<EditOutlined className="icon-table" />
						</Tooltip>
					</div>
				)
			},
		},
	];

	const columnsTable2 = [
		{ title: 'Produto', dataIndex: 'name_product', key: 'name_product' },
		{
			title: 'Preço original (R$)',
			dataIndex: 'price_product',
			key: 'price_product',
			render: (__, record) => {
				return (
					<div>
						{changeCommaForPoint(record.price_product)}
					</div>
				)
			},
		},
		{
			title: 'Preço promocional (R$)',
			dataIndex: 'price_promotion',
			key: 'price_promotion',
			render: (__, record) => {
				return (
					<div>
						{changeCommaForPoint(record.price_promotion)}
					</div>
				)
			},
		},
		{
			title: 'Desconto (R$)',
			dataIndex: 'discount',
			key: 'discount',
			render: (__, record) => {
				return (
					<div>
						{changeCommaForPoint(record.discount)}
					</div>
				)
			},
		},
		{
			title: 'Ações',
			dataIndex: '',
			key: 'x',
			render: (__, record) => {
				return (
					<div>
						<Tooltip placement="top" title='Deletar promoção'>
							<DeleteOutlined className="icon-table" onClick={() => deleteLineTable(record.key)} />
						</Tooltip>
					</div>
				)
			},
		},
	];

	const deleteLineTable = async (key) => {
		try {
			let isNewProduct = dataTable.filter((item) => item.key === key)[0].is_new_product;
			if (!isNewProduct) {
				setLoading(true);
				API.delete("product-promotion/" + key + "/" + idEstablishment).then((response) => {
					if (response.status === 200) {
						setLoading(false);
						message.success(response.data.message);
						const newDataTable = dataTable.filter((item) => item.key !== key);
						setDataTable(newDataTable);
					} else {
						setLoading(false);
						message.error(response.data.message);
					}
				}).catch((error) => {
					setLoading(false);
					message.error("Erro de comunicação com o servidor.");
				})
			} else {
				const newDataTable = dataTable.filter((item) => item.key !== key);
				setDataTable(newDataTable);
			}
		} catch (error) {
			setLoading(false);
			message.error("Erro de comunicação com o servidor, tente novamente!");
		}
	}

	const getPromotions = async () => {
		try {
			API.get("promotion/" + idEstablishment).then((response) => {
				let array = [];
				response.data.forEach((promotion) => {
					array.push({
						key: promotion.id_promotion,
						code: promotion.code,
						name: promotion.name_promotion,
						description: promotion.description || "-",
						status: promotion.is_active,
						products: promotion.products
					})
				})
				setDataPromotion(array);
			}).catch((error) => {
				message.error("Erro de comunicação com o servidor.");
			});
		} catch (error) {
			message.error("Erro de comunicação com o servidor.");
		}
	}

	const deletePromotion = async (id) => {
		try {
			setLoading(true);
			API.delete("promotion/" + id + "/" + idEstablishment).then(response => {
				if (response.status === 200) {
					getPromotions();
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

	const onUpdatePromotion = async (values) => {
		try {
			setLoading(true);
			if (values.name_promotion) {
				let array = [];
				dataTable.forEach((item) => {
					if (item.is_new_product) {
						array.push({
							id_product: item.key,
							price_promotion: item.price_promotion,
							is_active: true
						})
					}
				})
				if (dataTable.length !== 0) {
					const response = await API.put("promotion",
						{
							idPromotion: idUpdate,
							name_promotion: values.name_promotion,
							description: values.description,
							is_active: values.is_active,
							id_company: idEstablishment,
							newProductsPromotion: array
						}
					);
					if (response.status === 200) {
						getPromotions();
						setExpandEditRow(!expandEditRow);
						setLoading(false);
						message.success(response.data.message);
						form.resetFields();
						form.setFieldsValue({ price_promotion: maskMoney(0) });
					} else {
						setExpandEditRow(!expandEditRow);
						setLoading(false);
						message.error(response.data.message);
						form.resetFields();
						form.setFieldsValue({ price_promotion: maskMoney(0) });
					}
				} else {
					setLoading(false);
					message.error("Informe produtos na promoção, por favor !");
				}
			} else {
				setLoading(false);
				message.error("Informe o nome da promoção, por favor !");
			}
		} catch (error) {
			setLoading(false);
			message.error("Erro de comunicação com o servidor, tente novamente!");
		}
	}

	const insertLineTable = () => {
		setLoading(true);
		const idProduct = form.getFieldValue("name_product");
		const pricePromotion = form.getFieldValue("price_promotion");
		if (idProduct && pricePromotion) {
			const flag = dataTable.filter((item) => item.key === idProduct).length !== 0 ? true : false;
			if (!flag) {
				const product = dataProductsFilter.filter((item) => item.id_product === idProduct)[0];
				let line = {
					key: idProduct,
					name_product: product.name_product,
					price_product: product.price,
					price_promotion: Number(pricePromotion.replace(",", ".")),
					discount: (product.price) - Number(pricePromotion.replace(",", ".")),
					is_new_product: true
				}
				setDataTable([...dataTable, line]);
				form.setFieldsValue({
					category: null,
					flavor: null,
					name_product: null,
					price_promotion: maskMoney(0)
				});

			} else {
				message.error("Este produto já está inserido na promoção!");
			}
			setLoading(false);
		} else {
			setLoading(false);
			message.error("Informe os campos pedidos para poder inserir o produto na promoção!");
		}
	}

	const setFildsDrawer = (id) => {
		setLoading(true);
		const line = dataPromotion.filter((item) => item.key === id)[0];
		setIdUpdate(id);
		let array = [];
		line.products.forEach((product) => {
			array.push({
				key: product.id,
				name_product: product.name_product,
				price_product: product.price,
				price_promotion: product.price_pp,
				discount: product.price - product.price_pp,
				is_new_product: false
			})
		})
		setDataTable(array);
		form.setFieldsValue({
			name_promotion: line.name,
			is_active: line.status,
			description: line.description
		});
		setLoading(false);
		setExpandEditRow(!expandEditRow);
	}

	const handleChangePrice = async () => {
		const field = form.getFieldValue("price_promotion");
		form.setFieldsValue({ price_promotion: await maskMoney(field) });
	}

	return (
		<div>
			<Spin size="large" spinning={loading}>
				<Layout>
					<MenuSite open={expand} current={'promotions'} openCurrent={'list'} />
					<Layout className="site-layout">
						<HeaderSite title={'Listagem das promoções'} isListView={true} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
						<Content className="container-main">
							<Table
								size="middle"
								columns={columns}
								dataSource={dataPromotion}
								expandable={{
									expandedRowRender: record => <ListProductsPromotion dataProducts={record.products} />,
									rowExpandable: record => record.products.length !== 0,
								}}
							/>
						</Content>
						<FooterSite />
					</Layout>
				</Layout>

				<Drawer
					title="Editar promoção"
					width={900}
					onClose={() => setExpandEditRow(!expandEditRow)}
					visible={expandEditRow}
					bodyStyle={{ paddingBottom: 80 }}>
					<Form layout="vertical" form={form} onFinish={onUpdatePromotion}>
						<Row gutter={[16, 16]}>
							<Col span={20}>
								<Form.Item label="Nome" name="name_promotion">
									<Input className="input-radius" />
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
							<Col span={5}>
								<Form.Item label="Categoria" name="category">
									<Select onChange={getFlavorsByCategory}>
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
							<Col span={6}>
								<Form.Item label="Sabor" name="flavor">
									<Select onChange={getProductsByCategoryAndFlavor}>
										{
											dataFlavor.map((item) => (
												<Option key={item.id} value={item.id}>
													{item.name_flavor}
												</Option>
											)
											)
										}
									</Select>
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item label="Produto" name="name_product">
									<Select>
										{
											dataProductsFilter.map((item) => (
												<Option key={item.id_product} value={item.id_product}>
													{item.name_product}
												</Option>
											)
											)
										}
									</Select>
								</Form.Item>
							</Col>
							<Col span={4}>
								<Form.Item label="Preço promocional" name="price_promotion">
									<Input className="input-radius" onKeyUp={handleChangePrice} />
								</Form.Item>
							</Col>
							<Col span={1}>
								<Button
									className="button"
									shape="circle"
									icon={<PlusOutlined />}
									style={{ marginTop: "25px", float: "right" }}
									onClick={() => insertLineTable()}
								/>
							</Col>
							<Col span={24}>
								<Table
									size="middle"
									columns={columnsTable2}
									dataSource={dataTable}
								/>
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
export default Promotions;

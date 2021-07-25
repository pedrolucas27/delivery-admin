import React, { useState, useEffect } from "react";
import API from "../../api.js";
import {
	Layout,
	Form,
	Input,
	Button,
	Switch,
	Select,
	Row,
	Col,
	message,
	Spin,
	Tooltip,
	Table
} from 'antd';
import {
	DeleteOutlined,
	PlusOutlined
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import '../../global.css';
import { maskMoney, changeCommaForPoint } from "../../helpers.js";
import HeaderSite from "../../components/Header";
import MenuSite from "../../components/Menu";
import FooterSite from "../../components/Footer";
const { Content } = Layout;
const { TextArea } = Input;
const { Option } = Select;
function AddPromotion() {
	const [form] = Form.useForm();
	const [expand, setExpand] = useState(false);
	const [loading, setLoading] = useState(false);
	const [dataTable, setDataTable] = useState([]);
	const [dataCategory, setDataCategory] = useState([]);
	const [dataFlavor, setDataFlavor] = useState([]);
	const [dataProductsFilter, setDataProductsFilter] = useState([]);
	const [idCategoryProductPromotion, setIdCategoryProductPromotion] = useState(null);
	useEffect(() => {
		try {
			form.setFieldsValue({ price_promotion: maskMoney(0) });
			API.get("category").then((response) => {
				setDataCategory(response.data);
			}).catch((error) => {
				message.error("Erro de comunicação com o servidor.");
			});
		} catch (error) {
			message.error("Erro de comunicação com o servidor.");
		}
	}, []);

	const getFlavorsByCategory = async (idCategory) => {
		try {
			setLoading(true);
			setIdCategoryProductPromotion(idCategory);
			await API.get("flavor/byCategory/" + idCategory).then((response) => {
				setDataFlavor(response.data);
			}).catch((error) => {
				message.error("Erro de comunicação com o servidor.");
			});
			setLoading(false);
		} catch (error) {
			setLoading(false);
			message.error("Erro de comunicação com o servidor.");
		}
	}

	const getProductsByCategoryAndFlavor = async (idFlavor) => {
		try {
			setLoading(true);
			await API.get("product/others/" + idCategoryProductPromotion + "/" + idFlavor).then((response) => {
				setLoading(false);
				setDataProductsFilter(response.data);
			}).catch((error) => {
				setLoading(false);
				message.error("Erro de comunicação com o servidor.");
			});
		} catch (error) {
			setLoading(false);
			message.error("Erro de comunicação com o servidor.");
		}
	}

	const columns = [
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

	const deleteLineTable = (key) => {
		const newDataTable = dataTable.filter((item) => item.key !== key);
		setDataTable(newDataTable);
	}

	const insertLineTable = () => {
		setLoading(true);
		const idProduct = form.getFieldValue("name_product");
		const pricePromotion = form.getFieldValue("price_promotion");
		if (idProduct && pricePromotion) {
			//verificando se o produto selecionado já está na promoção.
			const flag = dataTable.filter((item) => item.key === idProduct).length !== 0 ? true : false;
			if (!flag) {
				const product = dataProductsFilter.filter((item) => item.id_product === idProduct)[0];
				let line = {
					key: idProduct,
					name_product: product.name_product,
					price_product: product.price,
					price_promotion: Number(pricePromotion.replace(",", ".")),
					discount: (product.price) - Number(pricePromotion.replace(",", ".")),
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

	const onSavePromotion = async (values) => {
		try {
			setLoading(true);
			//array de produtos inseridos na promoção
			let array = [];
			dataTable.forEach((item) => {
				array.push({
					id_product: item.key,
					price_promotion: item.price_promotion,
					is_active: true
				})
			})
			if (values.name_promotion) {
				if (array.length !== 0) {
					const response = await API.post("promotion",
						{
							name_promotion: values.name_promotion,
							is_active: values.is_active !== undefined ? values.is_active : true,
							description: values.description || null,
							products: array
						}
					);
					setLoading(false);
					if (response.status === 200) {
						message.success(response.data.message);
						form.resetFields();
						setDataTable([]);
					} else {
						message.error(response.data.message);
					}
				} else {
					message.error("Insira produtos na sua promoção !");
				}
			} else {
				setLoading(false);
				message.error("Informe o nome da promoção, por favor !");
			}
		} catch (error) {
			setLoading(false);
			message.error("Erro de comunicação com o servidor, tente novamente !");
		}
	}

	const handleChangePrice = async () => {
		const field = form.getFieldValue("price_promotion");
		form.setFieldsValue({ price_promotion: await maskMoney(field) });
	}

	return (
		<div>
			<Spin size="large" spinning={loading}>
				<Layout>
					<MenuSite open={expand} current={'addPromotion'} openCurrent={'register'} />
					<Layout className="site-layout">
						<HeaderSite title={'Cadastro de promoção'} isListView={false} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
						<Content className="container-main">
							<Form layout="vertical" form={form} onFinish={onSavePromotion}>
								<Row gutter={[8, 0]}>
									<Col span={20}>
										<Form.Item label="Nome" name="name_promotion">
											<Input className="input-radius" />
										</Form.Item>
									</Col>
									<Col span={4}>
										<Form.Item label="Status" name="is_active">
											<Switch defaultChecked />
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
											columns={columns}
											dataSource={dataTable}
										/>
									</Col>
									<Col span={24} style={{ marginTop: "15px" }}>
										<Button onClick={() => form.submit()} shape="round" className="button ac">
											Salvar
								    </Button>
										<Button shape="round" className="button-cancel ac">
											Cancelar
								    </Button>
									</Col>
								</Row>
							</Form>
						</Content>
						<FooterSite />
					</Layout>
				</Layout>
			</Spin>
		</div>
	);
}
export default AddPromotion;

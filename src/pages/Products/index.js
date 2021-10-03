import React, { useState, useEffect } from "react";
import API from "../../api.js";
import { maskMoney, maskNumer, changeCommaForPoint, getStorageERP, isLoggedAdmin } from "../../helpers.js";
import {
	Layout,
	Form,
	Input,
	Button,
	Select,
	Switch,
	Row,
	Col,
	Upload,
	Table,
	message,
	Popconfirm,
	Drawer,
	Tooltip,
	Spin
} from 'antd';
import {
	DeleteOutlined,
	PlusOutlined,
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

function getBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});
}

function Products() {
	isLoggedAdmin();

	const { idEstablishment } = getStorageERP();
	const [form] = Form.useForm();
	const [expand, setExpand] = useState(false);
	const [expandEditRow, setExpandEditRow] = useState(false);
	const [loading, setLoading] = useState(false);
	const [idUpdate, setIdUpdate] = useState(null);
	const [dataCategory, setDataCategory] = useState([]);
	const [dataFlavor, setDataFlavor] = useState([]);
	const [dataUnitMensuration, setDataUnitMensuration] = useState([]);
	const [dataProduct, setDataProduct] = useState([]);

	const [imageProduct, setImageProduct] = useState(null);
	const [isUpdateImage, setIsUpdateImage] = useState(false);

	useEffect(() => {
			setLoading(true);
			API.get("category/" + idEstablishment).then((response) => {
				setDataCategory(response.data);
			}).catch((error) => {
				message.error("Erro de comunicação com o servidor.");
			});
			API.get("flavor/" + idEstablishment).then((response) => {
				setDataFlavor(response.data);
			}).catch((error) => {
				message.error("Erro de comunicação com o servidor.");
			});
			API.get("unitMensuration").then((response) => {
				setDataUnitMensuration(response.data);
			}).catch((error) => {
				message.error("Erro de comunicação com o servidor.");
			});
			getProducts();
			setLoading(false);
	}, []);

	const getFlavorsByCategory = async (idCategory) => {
		setLoading(true);
		try {
			form.setFieldsValue({ flavor: null });
			API.get("flavor/byCategory/" + idCategory + "/" + idEstablishment).then((response) => {
				setDataFlavor(response.data);
				setLoading(false);
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
		{ title: 'Código', dataIndex: 'code', key: 'code' },
		{ title: 'Produto', dataIndex: 'product', key: 'product' },
		{ title: 'Categoria', dataIndex: 'category', key: 'category' },
		{ title: 'Sabor', dataIndex: 'flavor', key: 'flavor' },
		{ title: 'Tamanho/Volume', dataIndex: 'size', key: 'size' },
		{ title: 'Descrição', dataIndex: 'description', key: 'description' },
		{
			title: 'Preço (R$)',
			dataIndex: 'price',
			key: 'price',
			render: (__, record) => {
				return (
					<div>
						{changeCommaForPoint(record.price)}
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
						<Tooltip placement="top" title='Deletar produto'>
							<DeleteOutlined className="icon-table" onClick={() => deleteProduct(record.key)} />
						</Tooltip>
						<Tooltip placement="top" title='Editar produto'>
							<EditOutlined className="icon-table" onClick={() => setFildsDrawer(record.key)} />
						</Tooltip>
					</div>
				)
			},
		},
	];

	const getProducts = async () => {
		try {
			API.get("product/" + idEstablishment).then((response) => {
				let array = [];
				response.data.forEach((product) => {
					array.push({
						key: product.id_product,
						code: product.code,
						product: product.name_product,
						description: product.description || "-",
						price: product.price,
						status: product.is_active,
						id_category: product.id_category,
						category: product.name_category,
						id_flavor: product.id,
						flavor: product.name_flavor,
						size_value: product.size_product,
						id_unit_fk: product.fk_id_unit,
						size: product.size_product + " (" + product.unit + " - " + product.abreviation + ")",
						urlImage: product.image ? `http://192.168.0.107:8080/${product.image}`:null
					})
				})
				setDataProduct(array);
			}).catch((error) => {
				message.error("Erro de comunicação com o servidor.");
			});
		} catch (error) {
			message.error("Erro de comunicação com o servidor.");
		}
	}

	const deleteProduct = async (id) => {
		try {
			setLoading(true);
			API.delete("product/" + id + "/" + idEstablishment).then(response => {
				if (response.status === 200) {
					getProducts();
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
			message.error("Erro de comunicação com o servidor, tente novamente !");
		}
	}

	const updateProduct = async (values) => {
		try {
			setLoading(true);
			if (values.name_product && values.price_product && values.flavor && values.category && values.size) {
				const response = await API.put("product",
					{
						id: idUpdate,
						name_product: values.name_product,
						description: values.description || null,
						price: Number(values.price_product.replace(",", ".")),
						is_active: values.is_active !== undefined ? values.is_active : true,
						fk_id_flavor: values.flavor,
						fk_id_category: values.category,
						size_product: values.size || 1,
						fk_id_unit: values.unitMensuration || null,
						base64image: imageProduct,
						isUpdateImage: isUpdateImage,
						id_company: idEstablishment
					}
				);
				if (response.status === 200) {
					getProducts();
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
			message.error("Erro de comunicação com o servidor, tente novamente !");
		}
	}

	const setFildsDrawer = (id) => {
		const line = dataProduct.filter((item) => item.key === id)[0];
		setIdUpdate(id);
		if(line.urlImage){
			setImageProduct(line.urlImage);
		}
		form.setFieldsValue({
			name_product: line.product,
			description: line.description,
			price_product: changeCommaForPoint(line.price),
			is_active: line.status,
			flavor: line.id_flavor,
			category: line.id_category,
			unitMensuration: line.id_unit_fk,
			size: line.size_value
		});
		setExpandEditRow(!expandEditRow);
	}

	const handleChangeImage = async (file) => {
		const image = await getBase64(file.fileList[0].originFileObj);
		setIsUpdateImage(true);
		setImageProduct(image);
	}

	const handleChangePrice = async () => {
		const field = form.getFieldValue("price_product");
		form.setFieldsValue({ price_product: await maskMoney(field) });
	}

	const handleChangeSize = async () => {
		const field = form.getFieldValue("size");
		form.setFieldsValue({ size: await maskNumer(field) });
	}

	const uploadButton = (
		<div className="div-icon-upload">
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>Upload</div>
		</div>
	);

	return (
		<div>
			<Spin size="large" spinning={loading}>
				<Layout>
					<MenuSite open={expand} current={'products'} openCurrent={'list'} />
					<Layout className="site-layout">
						<HeaderSite title={'Listagem de produtos'} isListView={true} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
						<Content className="container-main">
							<Table
								size="middle"
								columns={columns}
								dataSource={dataProduct}
							/>
						</Content>
						<FooterSite />
					</Layout>
				</Layout>
				<Drawer
					title="Editar produto"
					width={800}
					onClose={() => setExpandEditRow(!expandEditRow)}
					visible={expandEditRow}
					bodyStyle={{ paddingBottom: 80 }}>
					<Form layout="vertical" form={form} onFinish={updateProduct}>
						<Row gutter={[16, 16]}>
							<Col span={20}>
								<Form.Item label="Nome" name="name_product">
									<Input className="input-radius" />
								</Form.Item>
							</Col>
							<Col span={4}>
								<Form.Item label="Status" name="is_active" valuePropName="checked">
									<Switch />
								</Form.Item>
							</Col>
							<Col span={6}>
								<Form.Item label="Categoria" name="category">
									<Select onChange={getFlavorsByCategory}>
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
							<Col span={6}>
								<Form.Item label="Sabor" name="flavor">
									<Select>
										{
											dataFlavor.map((item) => (
												<Option key={item.code} value={item.id}>
													{item.name_flavor}
												</Option>
											)
											)
										}
									</Select>
								</Form.Item>
							</Col>
							<Col span={3}>
								<Form.Item label="Tamanho" name="size">
									<Input className="input-radius" onKeyUp={handleChangeSize} />
								</Form.Item>
							</Col>
							<Col span={5}>
								<Form.Item label="Unidade de Medida" name="unitMensuration">
									<Select>
										{
											dataUnitMensuration.map((item) => (
												<Option key={item.code} value={item.id_unit}>
													{item.unit} - {item.abreviation}
												</Option>
											)
											)
										}
									</Select>
								</Form.Item>
							</Col>
							<Col span={4}>
								<Form.Item label="Preço" name="price_product">
									<Input className="input-radius" onKeyUp={handleChangePrice} />
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item label="Descrição" name="description">
									<TextArea rows={4} className="input-radius" />
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item label="" name="image">
									<Upload
										action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
										listType="picture-card"
										showUploadList={false}
										onChange={handleChangeImage}
									>
										{imageProduct ? <img src={imageProduct} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
									</Upload>
								</Form.Item>
							</Col>
							<Col span={24}>
							<Button onClick={() => form.submit()} shape="round" className="button ac">
								Editar
							</Button>
							<Button onClick={() => { form.resetFields() }} shape="round" className="button-cancel ac">
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
export default Products;

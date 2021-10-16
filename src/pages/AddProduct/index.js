import React, { useState, useEffect } from "react";
import API from "../../api.js";
import { maskMoney, getStorageERP, maskNumer, isLoggedAdmin } from "../../helpers.js";
import {
	Layout,
	Form,
	Input,
	Button,
	Select,
	Switch,
	Row,
	Col,
	message,
	Upload,
	Spin
} from 'antd';
import {
	PlusOutlined
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import './addProduct.css';
import '../../global.css';
import HeaderSite from "../../components/Header";
import MenuSite from "../../components/Menu";
import FooterSite from "../../components/Footer";
const { TextArea } = Input;
const { Option } = Select;
const { Content } = Layout;

function getBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});
}

function AddProduct() {
	isLoggedAdmin();
	
	const { idEstablishment } = getStorageERP();
	const [form] = Form.useForm();
	const [expand, setExpand] = useState(false);
	const [dataFlavor, setDataFlavor] = useState([]);
	const [dataUnitMensuration, setDataUnitMensuration] = useState([]);
	const [dataCategory, setDataCategory] = useState([]);
	const [loading, setLoading] = useState(false);
	const [imageProduct, setImageProduct] = useState(null);
	useEffect(() => {
			form.setFieldsValue({ size: 1, price_product: maskMoney(0) });
			API.get("unitMensuration").then((response) => {
				setDataUnitMensuration(response.data);
			}).catch((error) => {
				message.error("Erro de comunicação com o servidor, tente novamente !");
			});
			API.get("category/"+idEstablishment).then((response) => {
				setDataCategory(response.data);
			}).catch((error) => {
				message.error("Erro de comunicação com o servidor, tente novamente !");
			});
	}, []);

	const getFlavorsByCategory = async (idCategory) => {
		setLoading(true);
		try {
			form.setFieldsValue({ flavor: null });
			await API.get("flavor/byCategory/" + idCategory + "/" + idEstablishment).then((response) => {
				setDataFlavor(response.data);
				setLoading(false);
			}).catch((error) => {
				setLoading(false);
				message.error("Erro de comunicação com o servidor, tente novamente !");
			});
		} catch (error) {
			message.error("Erro de comunicação com o servidor.");
		}
	}

	const onSaveProduct = async (values) => {
		try {
			setLoading(true);
			if (values.name_product && values.price_product && values.flavor && values.category) {
				const response = await API.post("product",
					{
						name_product: values.name_product,
						description: values.description || null,
						price: Number(values.price_product.replace(",", ".")),
						is_active: values.is_active !== undefined ? values.is_active : true,
						base64image: imageProduct,
						size_product: values.size || 1,
						fk_id_flavor: values.flavor,
						fk_id_category: values.category,
						fk_id_unit: values.unitMensuration || null,
						id_company: idEstablishment
					}
				);
				setLoading(false);
				if (response.status === 200) {
					message.success(response.data.message);
					form.resetFields();
					setImageProduct(null);
					form.setFieldsValue({ size: 1, price_product: maskMoney(0) });
				} else {
					message.error(response.data.message);
				}
			} else {
				setLoading(false);
				message.error("Informe os campos pedidos, por favor !");
			}
		} catch (error) {
			setLoading(false);
			message.error("Erro de comunicação com o servidor, tente novamente !");
		}
	}

	const handleChangeImage = async (file) => {
		const image = await getBase64(file.fileList[0].originFileObj);
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
				<Layout className="container-body">
					<MenuSite onTitle={!expand} open={expand} current={'addProduct'} openCurrent={'register'} />
					<Layout>
						<HeaderSite title={'Cadastro de produto'} isListView={false} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
						<Content className="container-main">
							<Form
								layout="vertical"
								form={form}
								onFinish={onSaveProduct}
							>
								<Row gutter={[8, 0]}>
									<Col span={20}>
										<Form.Item label="Nome" name="name_product">
											<Input className="input-radius" />
										</Form.Item>
									</Col>
									<Col span={4}>
										<Form.Item label="Status" name="is_active">
											<Switch defaultChecked />
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
											Salvar
								    	</Button>
										<Button onClick={() => { form.resetFields() }} shape="round" className="button-cancel ac">
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
export default AddProduct;

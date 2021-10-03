import React, { useState, useEffect } from "react";
import API from "../../api.js";
import { getStorageERP, isLoggedAdmin } from "../../helpers.js";
import {
	Layout,
	Button,
	Row,
	Col,
	Table,
	Tooltip,
	Drawer,
	Input,
	Switch,
	Form,
	message,
	Popconfirm,
	Upload,
	Spin
} from 'antd';
import {
	DeleteOutlined,
	EditOutlined,
	PlusOutlined
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import '../../global.css';
import HeaderSite from "../../components/Header";
import MenuSite from "../../components/Menu";
import FooterSite from "../../components/Footer";
const { Content } = Layout;

function getBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});
}

function Categories() {
	isLoggedAdmin();

	const { idEstablishment } = getStorageERP();
	const [expand, setExpand] = useState(false);
	const [expandEditRow, setExpandEditRow] = useState(false);
	const [form] = Form.useForm();
	const [dataCategory, setDataCategory] = useState([]);
	const [idUpdate, setIdUpdate] = useState(null);
	const [loading, setLoading] = useState(false);
	const [imageCategory, setImageCategory] = useState(null);
	const [isUpdateImage, setIsUpdateImage] = useState(false);

	useEffect(() => {
		getCategories();
	}, []);

	const columns = [
		{ title: 'Código', dataIndex: 'code', key: 'code' },
		{ title: 'Nome', dataIndex: 'name', key: 'name' },
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
						<Tooltip placement="top" title='Deletar categoria'>
							<Popconfirm
								 title="Tem certeza que deseja deletar ?"
								 onConfirm={() => deleteCategory(record.key)}
								 okText="Sim"
								 cancelText="Não"
							 >
								<DeleteOutlined className="icon-table" />
							</Popconfirm>
						</Tooltip>
						<Tooltip placement="top" title='Editar categoria'>
							<EditOutlined className="icon-table" onClick={() => setFildsDrawer(record.key)} />
						</Tooltip>
					</div>
				)
			},
		},
	];

	const getCategories = async () => {
		setLoading(true);
		try {
			API.get("category/" + idEstablishment).then((response) => {
				let array = [];
				response.data.forEach((category) => {
					array.push({
						key: category.id_category,
						code: category.code,
						name: category.name_category,
						status: category.is_active,
						urlImage: category.image ? `http://192.168.0.107:8080/${category.image}`:null
					})
				})
				setDataCategory(array);
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

	const deleteCategory = async (id) => {
		try {
			setLoading(true);
			API.delete("category/" + id + "/" + idEstablishment).then(response => {
				if (response.status === 200) {
					getCategories();
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

	const updateCategory = async (values) => {
		try {
			setLoading(true);
			if (values.name_category) {
				const response = await API.put("category",
					{
						id: idUpdate,
						name_category: values.name_category,
						is_active: values.is_active !== undefined ? values.is_active : true,
						base64image: imageCategory,
						isUpdateImage: isUpdateImage,
						id_company: idEstablishment
					}
				);

				console.log(response);
				if (response.status === 200) {
					setExpandEditRow(!expandEditRow);
					setLoading(false);
					message.success(response.data.message);
					setIsUpdateImage(false);
					setImageCategory(null);
					getCategories();
				} else {
					setLoading(false);
					message.error(response.data.message);
				}
			} else {
				setLoading(false);
				message.error("Informe o nome da categoria, por favor !");
			}
		} catch (error) {
			setLoading(false);
			message.error("Erro de comunicação com o servidor, tente novamente!");
		}
	}

	const setFildsDrawer = (id) => {
		const line = dataCategory.filter((item) => item.key === id)[0];
		setIdUpdate(id);
		if(line.urlImage){
			setImageCategory(line.urlImage);
		}
		form.setFieldsValue({
			name_category: line.name,
			is_active: line.status
		});
		setExpandEditRow(!expandEditRow);
	}

	const handleChangeImage = async (file) => {
		const image = await getBase64(file.fileList[0].originFileObj);
		setIsUpdateImage(true);
		setImageCategory(image);
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
					<MenuSite onTitle={!expand} open={expand} current={'categories'} openCurrent={'list'} />
					<Layout className="site-layout">
						<HeaderSite title={'Listagem de categorias'} isListView={true} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
						<Content className="container-main">
							<Table
								size="middle"
								columns={columns}
								dataSource={dataCategory}
							/>
						</Content>
						<FooterSite />
					</Layout>
				</Layout>
				<Drawer
					title="Editar categoria"
					width={720}
					onClose={() => setExpandEditRow(!expandEditRow)}
					visible={expandEditRow}
					bodyStyle={{ paddingBottom: 80 }}>
					<Form layout="vertical" form={form} onFinish={updateCategory}>
						<Row gutter={[16, 16]}>
							<Col span={20}>
								<Form.Item label="Nome" name="name_category">
									<Input className="input-radius" />
								</Form.Item>
							</Col>
							<Col span={4}>
								<Form.Item label="Status" name="is_active" valuePropName="checked">
									<Switch />
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
										{imageCategory ? <img src={imageCategory} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
									</Upload>
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
export default Categories;

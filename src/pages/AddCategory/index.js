import React, { useState } from "react";
import API from "../../api.js";
import { getStorageERP, isLoggedAdmin } from "../../helpers.js";
import {
	Layout,
	Form,
	Input,
	Button,
	Switch,
	Row,
	Col,
	Upload,
	message,
	Spin
} from 'antd';
import {
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

function AddCategory() {
	isLoggedAdmin();

	const { idEstablishment } = getStorageERP();
	const [form] = Form.useForm();
	const [expand, setExpand] = useState(false);
	const [loading, setLoading] = useState(false);
	const [imageCategory, setImageCategory] = useState(null);

	const onSaveCategory = async (values) => {
		try {
			setLoading(true);
			if (values.name_category) {
				const response = await API.post("category",
					{
						name_category: values.name_category,
						is_active: values.is_active !== undefined ? values.is_active : true,
						base64image: imageCategory,
						id_company: idEstablishment
					}
				);

				setLoading(false);
				if (response.status === 200) {
					message.success(response.data.message);
					setImageCategory(null);
					form.resetFields();
				} else {
					message.error(response.data.message);
				}

			} else {
				setLoading(false);
				message.error("Informe o nome da categoria, por favor !");
			}
		} catch (error) {
			setLoading(false);
			message.error("Erro de comunicação com o servidor, tente novamente !");
		}

	}

	const handleChangeImage = async (file) => {
		const image = await getBase64(file.fileList[0].originFileObj);
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
				<Layout className="container-body">
					<MenuSite onTitle={!expand} open={expand} current={'addCategory'} openCurrent={'register'} />
					<Layout>
						<HeaderSite title={'Cadastro de categoria'} isListView={false} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
						<Content className="container-main">
							<Form layout="vertical" form={form} onFinish={onSaveCategory}>
								<Row gutter={[8, 0]}>
									<Col span={20}>
										<Form.Item label="Nome" name="name_category">
											<Input className="input-radius" />
										</Form.Item>
									</Col>
									<Col span={4}>
										<Form.Item label="Status" name="is_active">
											<Switch defaultChecked />
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
											Salvar
							    		</Button>
										<Button
											onClick={() => {
												form.resetFields();
												setImageCategory(null);
											}}
											shape="round"
											className="button-cancel ac"
										>
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
export default AddCategory;

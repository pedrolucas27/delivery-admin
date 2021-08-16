import React, { useState, useEffect } from "react";
import moment from "moment";
import API from "../../api.js";
import { getStorageERP, isLoggedAdmin, maskPhoneCell } from "../../helpers.js";
import {
	Layout,
	Form,
	Input,
	Button,
	TimePicker,
	Row,
	Col,
	Upload,
	message,
	Typography,
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
const { RangePicker } = TimePicker;
const { Title } = Typography;

function getBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});
}

function MyCompany() {
	isLoggedAdmin();

	const { idEstablishment } = getStorageERP();
	const [form] = Form.useForm();
	const [expand, setExpand] = useState(false);
	const [loading, setLoading] = useState(false);
	const [imageCompany, setImageCompany] = useState(null);
	const [editableCompany, setEditableCompany] = useState(false);
	const [timeWorkEstablishment, setTimeWorkEstablishment] = useState(null);

	useEffect(() => {
		setFildsCompany();
	}, []);
    
	const setFildsCompany = async () => {
		setLoading(true);
		try{
			const response = await API.get("establishment/"+idEstablishment);
			if(response.data.length !== 0){
				setTimeWorkEstablishment(
					[moment(response.data[0].start_time).format("h:mm:ss"), moment(response.data[0].end_time).format("h:mm:ss")]
				);
				form.setFieldsValue({
					name_establishment: response.data[0].name,
					phone_cell: maskPhoneCell(response.data[0].phone),
					time_work: [moment(response.data[0].start_time).format("h:mm:ss"), moment(response.data[0].end_time).format("h:mm:ss")],
					cep: response.data[0].cep,
					city: response.data[0].city,
					street: response.data[0].street,
					district: response.data[0].district,
					number_house: response.data[0].number_house,
					user_facebook: response.data[0].user_facebook,
					user_whatsapp: maskPhoneCell(response.data[0].user_whatsapp),
					user_instagram: response.data[0].user_instagram,
				});
				setLoading(false);
			} else{
				setLoading(false);
				message.error("Erro ao tentar listar informações da empresa!");
			}
		}catch(error){
			setLoading(false);
			message.error("Erro ao tentar listar informações da empresa!");
		}
	}

	const onUpdateCompany = async (values) => {
		setLoading(true);
		try{
			const response = await API.put("establishment", {
			    name: values.name_establishment, 
			    phone: values.phone_cell,
		        image: imageCompany,
		        user_instagram: values.user_instagram,
		        user_facebook: values.user_facebook,
			    user_whatsapp: values.user_whatsapp,
			    cep: values.cep,
		        city: values.city,
			    street: values.street,
			    district: values.district,
			    number_house: values.number_house,
			    start_time: timeWorkEstablishment[0],
			    end_time: timeWorkEstablishment[1],
			    id_establishment: idEstablishment
			});
			setLoading(false);
			if(response.status === 200){
				message.success(response.data.message);
				setTimeout(() => {
					window.location.reload(true);
				}, 500);
			}else{
				message.error(response.data.message);
			}
		}catch (error) {
			setLoading(false);
			message.error("Erro ao tentar atualizar dados da empresa. Tente novamente!");
		}
	}

	const handleChangeImage = async (file) => {
		const image = await getBase64(file.fileList[0].originFileObj);
		setImageCompany(image);
	}

	const handleChangePhoneCell = async () => {
		const field = form.getFieldValue("phone_cell");
		form.setFieldsValue({ phone_cell: await maskPhoneCell(field) });
	}

	const handleChangePhoneCellUserWpp = async () => {
		const field = form.getFieldValue("user_whatsapp");
		form.setFieldsValue({ user_whatsapp: await maskPhoneCell(field) });
	}

	function onChangeTimeWork(time, timeString){
		setTimeWorkEstablishment(timeString);
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
					<MenuSite open={expand} current={'myCompany'} openCurrent={''} />
					<Layout className="site-layout">
						<HeaderSite title={'Dados cadastrais'} isListView={false} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
						<Content className="container-main">
							<Form
								layout="vertical"
								form={form}
								onFinish={onUpdateCompany}
							>
								<Row gutter={[8, 0]}>
									<Col span={24}>
										<Title level={3}>
											Dados básicos
										</Title>
									</Col>
									<Col span={14}>
										<Form.Item 
											label="Nome" 
											name="name_establishment" 
											rules={[
												{
													required: true,
												}
											]}
										>
											<Input disabled={!editableCompany} className="input-radius" />
										</Form.Item>
									</Col>
									<Col span={5}>
										<Form.Item 
											label="Telefone celular" 
											name="phone_cell"
											rules={[
												{
													required: true,
												}
											]}
										>
											<Input disabled={!editableCompany} maxLength={15} className="input-radius" onChange={handleChangePhoneCell} />
										</Form.Item>
									</Col>
									<Col span={5}>
										<Form.Item 
											label="Horário de funcionamento" 
											name="time_work"
											rules={[
												{
													required: true,
												}
											]}
										>
											<RangePicker disabled={!editableCompany} onChange={onChangeTimeWork} className="input-radius" format="h:mm:ss"/>
										</Form.Item>
									</Col>
									<Col span={24}>
										<Title level={3}>
											Endereço
										</Title>
									</Col>
									<Col span={5}>
										<Form.Item 
											label="Cep" 
											name="cep"
											rules={[
												{
													required: true,
												}
											]}
										>
											<Input disabled={!editableCompany} className="input-radius" />
										</Form.Item>
									</Col>
									<Col span={5}>
										<Form.Item 
											label="Cidade" 
											name="city"
											rules={[
												{
													required: true,
												}
											]}
										>
											<Input disabled={!editableCompany} className="input-radius" />
										</Form.Item>
									</Col>
									<Col span={6}>
										<Form.Item 
											label="Rua" 
											name="street"
											rules={[
												{
													required: true,
												}
											]}
										>
											<Input disabled={!editableCompany} className="input-radius" />
										</Form.Item>
									</Col>
									<Col span={5}>
										<Form.Item 
											label="Bairro" 
											name="district"
											rules={[
												{
													required: true,
												}
											]}
										>
											<Input disabled={!editableCompany} className="input-radius" />
										</Form.Item>
									</Col>
									<Col span={3}>
										<Form.Item 
											label="Número" 
											name="number_house"
											rules={[
												{
													required: true,
												}
											]}
										>
											<Input disabled={!editableCompany} className="input-radius" />
										</Form.Item>
									</Col>
									<Col span={24}>
										<Title level={3}>
											Redes sociais
										</Title>
									</Col>
									<Col span={8}>
										<Form.Item label="Instagram" name="user_instagram">
											<Input disabled={!editableCompany} className="input-radius" />
										</Form.Item>
									</Col>
									<Col span={8}>
										<Form.Item label="Whatsapp" name="user_whatsapp">
											<Input disabled={!editableCompany} className="input-radius" maxLength={15} onChange={handleChangePhoneCellUserWpp} />
										</Form.Item>
									</Col>
									<Col span={8}>
										<Form.Item label="Facebook" name="user_facebook">
											<Input disabled={!editableCompany} className="input-radius" />
										</Form.Item>
									</Col>
									<Col span={24}>
										<Form.Item label="" name="image">
											<Upload
												disabled={!editableCompany}
												action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
												listType="picture-card"
												showUploadList={false}
												onChange={handleChangeImage}
											>
												{imageCompany ? <img src={imageCompany} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
											</Upload>
										</Form.Item>
									</Col>
									<Col span={24}>
										<Button 
											disabled={!editableCompany} 
											onClick={() => form.submit()} 
											shape="round" 
											className="button ac"
										>
											Atualizar
								    	</Button>
										<Button 
											disabled={!editableCompany} 
											onClick={() => {
												setEditableCompany(!editableCompany);
												setFildsCompany();
											}} 
											shape="round" 
											className="button-cancel ac"
										>
											Cancelar
									    </Button>
									    <Button 
									    	disabled={editableCompany} 
									    	onClick={() => setEditableCompany(!editableCompany)} 
									    	shape="round" 
									    	className="button ac"
									    >
											Habilitar campos para edição
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

export default MyCompany;

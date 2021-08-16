import React, { useState } from "react";
import API from "../../api.js";
import { getStorageERP, maskPhoneCell } from "../../helpers.js";
import {
	Layout,
	Form,
	Input,
	Button,
	Row,
	Col,
	message,
	Typography,
	TimePicker,
	Upload,
	Spin
} from 'antd';
import {
	PlusOutlined
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import '../../global.css';
import FooterSite from "../../components/Footer";
const { Content, Header } = Layout;
const { Title } = Typography;
const { RangePicker } = TimePicker;

function getBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});
}

function RegisterEstablishment() {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [imageCompany, setImageCompany] = useState(null);
	const [timeWorkEstablishment, setTimeWorkEstablishment] = useState(null);

	const onRegisterEstablishment = async (values) => {
		setLoading(true);
		try{
			if(timeWorkEstablishment){
				const { idAdmin } = getStorageERP();
				const response = await API.post("establishment", {
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
			        id_admin: idAdmin
				});
				setLoading(false);
				if(response.status === 200){
					localStorage.setItem('@masterpizza-admin-app/idEstablishment', response.data.idEstablishment);
					message.success(response.data.message);
					window.location.href = "dashboard";
				}else{
					message.error(response.data.message);
				}
			}else{
				setLoading(false);
				message.error("Informe o horário de funcionamento.");
			}
		}catch(error){
			setLoading(false);
			message.error("Erro ao tentar realizar cadastrado.");
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
					<Header style={{ backgroundColor: "#214185", width: '100%' }}>
      					<div className="header-register-establishment"> 
      						<Title level={3} style={{ margin: 0, color: '#fff' }}>
								Cadastre sua empresa
							</Title>
      					</div>
    				</Header>
					<Content className="container-main">
							<Form
								layout="vertical"
								form={form}
								onFinish={onRegisterEstablishment}
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
											<Input className="input-radius" />
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
											<Input maxLength={15} className="input-radius" onChange={handleChangePhoneCell} />
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
											<RangePicker onChange={onChangeTimeWork} className="input-radius" format="h:mm:ss"/>
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
											<Input className="input-radius" />
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
											<Input className="input-radius" />
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
											<Input className="input-radius" />
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
											<Input className="input-radius" />
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
											<Input className="input-radius" />
										</Form.Item>
									</Col>
									<Col span={24}>
										<Title level={3}>
											Redes sociais
										</Title>
									</Col>
									<Col span={8}>
										<Form.Item label="Instagram" name="user_instagram">
											<Input className="input-radius" />
										</Form.Item>
									</Col>
									<Col span={8}>
										<Form.Item label="Whatsapp" name="user_whatsapp">
											<Input className="input-radius" maxLength={15} onChange={handleChangePhoneCellUserWpp} />
										</Form.Item>
									</Col>
									<Col span={8}>
										<Form.Item label="Facebook" name="user_facebook">
											<Input className="input-radius" />
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
												{imageCompany ? <img src={imageCompany} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
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
			</Spin>
		</div>
	);
}
export default RegisterEstablishment;

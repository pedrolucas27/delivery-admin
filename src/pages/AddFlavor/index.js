import React, { useState, useEffect } from "react";
import API from "../../api.js";
import {
	Layout,
	Form,
	Input,
	Button,
	Switch,
	Row,
	Col,
	message,
	Select,
	Spin
} from 'antd';
import 'antd/dist/antd.css';
import '../../global.css';
import HeaderSite from "../../components/Header";
import MenuSite from "../../components/Menu";
import FooterSite from "../../components/Footer";
const { TextArea } = Input;
const { Content } = Layout;
const { Option } = Select;
function AddFlavor() {
	const [form] = Form.useForm();
	const [expand, setExpand] = useState(false);
	const [loading, setLoading] = useState(false);
	const [dataCategory, setDataCategory] = useState([]);
	useEffect(() => {
		try {
			API.get("category").then((response) => {
				setDataCategory(response.data);
			}).catch((error) => {
				message.error("Erro de comunicação com o servidor.");
			});
		} catch (error) {
			message.error("Erro de comunicação com o servidor.");
		}
	}, []);

	const onSaveFlavor = async (values) => {
		try {
			setLoading(true);
			if (values.name_flavor && values.category) {
				const response = await API.post("flavor",
					{
						name_flavor: values.name_flavor,
						description: values.description,
						is_active: values.is_active !== undefined ? values.is_active : true,
						id_category: values.category
					}
				);
				setLoading(false);
				if (response.status === 200) {
					message.success(response.data.message);
					form.resetFields();
				} else {
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


	return (
		<div>
			<Spin size="large" spinning={loading}>
				<Layout>
					<MenuSite open={expand} current={'addFlavor'} openCurrent={'register'} />
					<Layout className="site-layout">
						<HeaderSite title={'Cadastro de sabor'} isListView={false} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
						<Content className="container-main">
							<Form layout="vertical" form={form} onFinish={onSaveFlavor}>
								<Row gutter={[8, 0]}>
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
										<Form.Item label="Status" name="is_active">
											<Switch defaultChecked />
										</Form.Item>
									</Col>
									<Col span={24}>
										<Form.Item label="Descrição" name="description">
											<TextArea rows={4} className="input-radius" />
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
export default AddFlavor;

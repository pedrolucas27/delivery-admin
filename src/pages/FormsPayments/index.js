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
function FormsPayments() {
	isLoggedAdmin();

	const { idEstablishment } = getStorageERP();
	const [expand, setExpand] = useState(false);
	const [expandEditRow, setExpandEditRow] = useState(false);
	const [form] = Form.useForm();
	const [dataFormPayment, setDataFormPayment] = useState([]);
	const [idUpdate, setIdUpdate] = useState(null);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		setLoading(true);
		
		getFormsPayments();

		setLoading(false);
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
						<Tooltip placement="top" title='Deletar forma de pagamento'>
							<DeleteOutlined className="icon-table" onClick={() => deleteFormPayment(record.key)} />
						</Tooltip>
						<Tooltip placement="top" title='Editar forma de pagamento'>
							<EditOutlined className="icon-table" onClick={() => setFildsDrawer(record.key)} />
						</Tooltip>
					</div>
				)
			},
		},
	];

	const deleteFormPayment = async (id) => {
		setLoading(true);
		await API.delete("form_payment/" + id + "/" + idEstablishment).then(response => {
			if (response.status === 200) {
				getFormsPayments();
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
	}

	const getFormsPayments = async () => {
		await API.get("form_payment/" + idEstablishment).then((response) => {
			let array = [];
			response.data.forEach((formPayment) => {
				array.push({
					key: formPayment.id,
					code: formPayment.code,
					name: formPayment.name_form_payment,
					status: formPayment.is_active
				})
			})
			setDataFormPayment(array);
		}).catch((error) => {
			message.error("Erro de comunicação com o servidor.");
		});
	}

	const onUpdateFormPayment = async (values) => {
		setLoading(true);
		if (values.name_form_payment) {
			const response = await API.put("form_payment",
				{
					id: idUpdate,
					name_form_payment: values.name_form_payment,
					is_active: values.is_active !== undefined ? values.is_active : true,
					id_company: idEstablishment
				}
			);
			setLoading(false);
			if (response.status === 200) {
				getFormsPayments();
				message.success(response.data.message);
				setExpandEditRow(!expandEditRow);
				form.resetFields();
			} else {
				message.error(response.data.message);
			}
		} else {
			setLoading(false);
			message.error("Informe o nome da forma de pagamento, por favor !");
		}
	}

	const setFildsDrawer = (id) => {
		const line = dataFormPayment.filter((item) => item.key === id)[0];
		setIdUpdate(id);
		form.setFieldsValue({
			name_form_payment: line.name,
			is_active: line.status
		});
		setExpandEditRow(!expandEditRow);
	}

	return (
		<div>
			<Spin size="large" spinning={loading}>
				<Layout>
					<MenuSite open={expand} current={'formsPayments'} openCurrent={'list'} />
					<Layout className="site-layout">
						<HeaderSite title={'Listagem de formas de pagamentos'} isListView={true} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
						<Content className="container-main">
							<Table
								size="middle"
								columns={columns}
								dataSource={dataFormPayment}
							/>
						</Content>
						<FooterSite />
					</Layout>
				</Layout>
				<Drawer
					title="Editar forma de pagamento"
					width={720}
					onClose={() => setExpandEditRow(!expandEditRow)}
					visible={expandEditRow}
					bodyStyle={{ paddingBottom: 80 }}>
					<Form layout="vertical" form={form} onFinish={onUpdateFormPayment}>
						<Row gutter={[8, 0]}>
							<Col span={20}>
								<Form.Item label="Nome" name="name_form_payment">
									<Input className="input-radius" />
								</Form.Item>
							</Col>
							<Col span={4}>
								<Form.Item label="Status" name="is_active" valuePropName="checked">
									<Switch />
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
export default FormsPayments;

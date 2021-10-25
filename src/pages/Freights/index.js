import React, { useState, useEffect } from "react";
import API from "../../api.js";
import {
    maskMoney,
    changeCommaForPoint,
    getStorageERP,
    isLoggedAdmin
} from "../../helpers.js";
import {
    Layout,
    Button,
    Form,
    Switch,
    Input,
    Row,
    Col,
    Table,
    Tooltip,
    Drawer,
    message,
    Popconfirm,
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
const { TextArea } = Input;

function Freights() {
    isLoggedAdmin();

    const { idEstablishment } = getStorageERP();
    const [expand, setExpand] = useState(false);
    const [expandEditRow, setExpandEditRow] = useState(false);
    const [idUpdate, setIdUpdate] = useState(null);
    const [form] = Form.useForm();
    const [dataFreight, setDataFreight] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        getFreights();
        setLoading(false);
    }, []);


    const columns = [
        { title: 'Código', dataIndex: 'code', key: 'code' },
        { title: 'Região', dataIndex: 'region', key: 'region' },
        { title: 'Descrição', dataIndex: 'description', key: 'description' },
        {
            title: 'Valor do frete (R$)',
            dataIndex: 'value_freight',
            key: 'value_freight',
            render: (__, record) => {
                return (
                    <div>
                        {changeCommaForPoint(record.value_freight)}
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
                        {record.status ? "Ativo" : "Inativo"}
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
                        <Tooltip placement="top" title='Deletar cupom'>
                            <Popconfirm
                                title="Tem certeza que deseja deletar ?"
                                onConfirm={() => deleteFreight(record.key)}
                                okText="Sim"
                                cancelText="Não"
                            >
                                <DeleteOutlined className="icon-table" />
                            </Popconfirm>
                        </Tooltip>
                        <Tooltip placement="top" title='Editar cupom'>
                            <EditOutlined className="icon-table" onClick={() => setFildsDrawer(record.key)}/>
                        </Tooltip>
                    </div>
                )
            },
        },
    ];

    const getFreights = async () => {
		try {		
			API.get("freight/" + idEstablishment).then((response) => {
				let array = [];
				response.data.forEach((freight) => {
					array.push({
						key: freight.id,
						code: freight.code,
						region: freight.name_region,
						description: freight.description || "-",
						value_freight: freight.delivery_value,
						status: freight.is_active
					})
				})
				setDataFreight(array);
			}).catch((error) => {
				message.error("Erro de comunicação com o servidor.");
			});
		} catch (error) {
			message.error("Erro de comunicação com o servidor.");
		}
	}

    const deleteFreight = (id) => {
        try {
			setLoading(true);
			API.delete("freight/" + id + "/" + idEstablishment).then(response => {
				if (response.status === 200) {
					getFreights();
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
   

    const updateFreight = async (values) => {
        try {
			setLoading(true);
			if (values.name_region && values.price) {
				const response = await API.put("freight",
					{
						id: idUpdate,
						name_region: values.name_region,
                        delivery_value: Number(values.price.replace(",", ".")),
                        is_active: values.is_active,
						description: values.description,
						id_company: idEstablishment
					}
				);
				if (response.status === 200) {
					getFreights();
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
			message.error("Erro de comunicação com o servidor, tente novamente!");
		}
    }

    const setFildsDrawer = (id) => {
        const line = dataFreight.filter((item) => item.key === id)[0];
        console.log(line);
        setIdUpdate(id);
        form.setFieldsValue({
            name_region: line.region,
            price: changeCommaForPoint(line.value_freight),
            is_active: line.status,
            description: line.description
        });
        setExpandEditRow(!expandEditRow);
    }

    const handleChangePrice = async () => {
        const field = form.getFieldValue("price");
        form.setFieldsValue({ price: await maskMoney(field) });
    }

    return (
        <div>
            <Spin size="large" spinning={loading}>
                <Layout className="container-body">
                    <MenuSite onTitle={!expand} open={expand} current={'freights'} openCurrent={'list'} />
                    <Layout>
                        <HeaderSite title={'Listagem de fretes'} isListView={true} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
                        <Content className="container-main">
                            <Table
                                size="middle"
                                columns={columns}
                                dataSource={dataFreight}
                            />
                        </Content>
                        <FooterSite />
                    </Layout>
                </Layout>
                <Drawer
                    title="Editar cupom"
                    width={720}
                    onClose={() => setExpandEditRow(!expandEditRow)}
                    visible={expandEditRow}
                    bodyStyle={{ paddingBottom: 80 }}>
                    <Form layout="vertical" form={form} onFinish={updateFreight}>
                        <Row gutter={[8, 0]}>
                            <Col span={14}>
                                <Form.Item label="Nome da região" name="name_region">
                                    <Input className="input-radius" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="Valor do frete (R$)" name="price">
                                    <Input className="input-radius" onKeyUp={handleChangePrice} />
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
export default Freights;
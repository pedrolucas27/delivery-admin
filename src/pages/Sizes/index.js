import React, { useState, useEffect } from "react";
import axios from "axios";

import { 
	Layout,
	Button,
	Form,
	Select,
	Switch,
	Input,
	Row, 
	Col,
	Table,
	Tooltip,
	Drawer,
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
const { TextArea } = Input;
const { Option } = Select;

const BASE_URL = "http://localhost:4020/";

function Sizes() {
	const [expand, setExpand] = useState(false);
	const [expandEditRow, setExpandEditRow] = useState(false);
	const [idUpdate, setIdUpdate] = useState(null);
	const [data, setData] = useState([]);
	const [dataUnitMenusuration, setDataUnitMenusuration] = useState([]);
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);

	useEffect(() => {

		axios.get(BASE_URL+"size").then((response) => {
			let array = [];
			response?.data.forEach((size) => {
				array.push({
					key: size?.id_size,
					code: size?.code,
					value: size?.size,
					unit: size?.unit + " - ("+ size?.abreviation +")",
					description: size?.description,
					id_unit: size?.id_unit,
					status: size?.is_active 
				})
			})
		  	setData(array);
		}).catch((error) => {
			console.log("BUGOU: "+ error);
		});

		axios.get(BASE_URL+"unitMensuration").then((response) => {
			let array = [];
			response?.data.forEach((unit_mensuration) => {
				array.push({
					id_unit: unit_mensuration?.id_unit,
					code: unit_mensuration?.code,
					unit: unit_mensuration?.unit,
					abreviation: unit_mensuration?.abreviation,
					is_active: unit_mensuration?.is_active 
				})
			})
		  	setDataUnitMenusuration(array);
		}).catch((error) => {
			console.log("BUGOU: "+ error);
		});

	}, []);


	const columns = [
	  { title: 'Código', dataIndex: 'code', key: 'code' },
	  { title: 'Valor', dataIndex: 'value', key: 'value' },
	  { title: 'Unidade', dataIndex: 'unit', key: 'unit' },
	  { title: 'Descrição', dataIndex: 'description', key: 'description' },
	  { 
	  	title: 'Status', 
	  	dataIndex: 'status', 
	  	key: 'status',
	  	render: (__, record) => {
	  		return(
	  			<div>
	  				{ record?.status ? "Ativo" : "Inativo" }
	  			</div>
	  		);
	  	} 
	  },
  	  {
	    title: 'Ações',
	    dataIndex: '',
	    key: 'x',
	    render: (__, record) => {
	    	return(
	    		<div>
	    			<Tooltip placement="top" title='Deletar tamanho'>
	    				<DeleteOutlined className="icon-table" onClick={() => deleteSize(record?.key)}/>
	    			</Tooltip>
	    			<Tooltip placement="top" title='Editar tamanho'>
	    				<EditOutlined className="icon-table" onClick={() => setFildsDrawer(record?.key)}/>
	    			</Tooltip>
	    		</div>
	    	)
	    },
  	  },
    ];

    const getSizes = async () => {
    	await axios.get(BASE_URL+"size").then((response) => {
			let array = [];
			response?.data.forEach((size) => {
				array.push({
					key: size?.id_size,
					code: size?.code,
					value: size?.size,
					unit: size?.unit + " - ("+ size?.abreviation +")",
					description: size?.description,
					id_unit: size?.id_unit,
					status: size?.is_active 
				})
			})
		  	setData(array);
		}).catch((error) => {
			console.log("BUGOU: "+ error);
		});
    }


    const deleteSize = async (id) => {
    	setLoading(true);
    	    	
		await axios.delete(BASE_URL+"size/"+id).then(response => {
      		if(response?.status === 200){
				getSizes();
				setLoading(false);
				message.success(response?.data?.message);
			}else{
				setLoading(false);
				message.error(response?.data?.message);
			}
    	}).catch(error => {
    		setLoading(false);
    		message.error(error);
    	});
    }

    const updateSize = async (values) => {
    	setLoading(true);
    	if(values?.size_value && values?.unit){
			const response = await axios.put(BASE_URL+"size", 
				{  
				  id_size: idUpdate,
				  id_unit_fk: values?.unit, 
				  size: values?.size_value, 
				  description: values?.description, 
				  is_active: values?.is_active
				} 
			);

			if(response?.status === 200){
				getSizes();
				setLoading(false);
				message.success(response?.data?.message);
				setExpandEditRow(!expandEditRow);
			}else{
				setLoading(false);
				message.error(response?.data?.message);
			}

		}else{
			setLoading(false);
			message.error("Informe os campos pedidos, por favor !");
		}

    }


    const setFildsDrawer = (id) => {

    	const line = data?.filter((item) => item?.key === id)[0];
    	console.log(line);
    	setIdUpdate(id);

    	form.setFieldsValue({
    		size_value: line?.value,
    		unit: line?.id_unit,
    		description: line?.description,
    		is_active: line?.status
    	});

    	setExpandEditRow(!expandEditRow);
    }


	return (
		<div>
			<Spin size="large" spinning={loading}>
				<Layout>
					<MenuSite open={expand} />
			        <Layout className="site-layout">
			          <HeaderSite title={'Listagem de tamanhos'} isListView={true} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
			          <Content className="container-main">
			            <Table
			              size="middle"
						  columns={columns}
						  dataSource={data}
						/>
			          </Content>
			          <FooterSite />
			        </Layout>
		      	</Layout>

		      	<Drawer
		          	title="Editar tamanho"
		          	width={720}
		          	onClose={() => setExpandEditRow(!expandEditRow)} 
		          	visible={expandEditRow}
		          	bodyStyle={{ paddingBottom: 80 }}>
		          		<Form layout="vertical" form={form} onFinish={updateSize}>   			  
					        <Row gutter={[16, 16]}>
						      <Col span={6}>
								<Form.Item label="Valor" name="size_value">
						          <Input className="input-radius"/>
						        </Form.Item>
						      </Col>
						      <Col span={6}>
								<Form.Item label="Unidade" name="unit">
						          <Select>
						          	{
						          		dataUnitMenusuration.map((item) => (
												<Option key={item?.code} value={item?.id_unit}>
													{item?.unit} - ({item?.abreviation})
							          			</Option>
						          			)
						          		)
						          	}
	  							  </Select>
						        </Form.Item>
						      </Col>
						      <Col span={4}>
								<Form.Item label="Status" name="is_active" valuePropName="checked">
						          <Switch />
						        </Form.Item>
						      </Col>
						      <Col span={24}>
								<Form.Item label="Observação" name="description">
						        	<TextArea rows={4} className="input-radius"/>
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

export default Sizes;

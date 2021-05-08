import React, { useState, useEffect } from "react";
import axios from "axios";

import { 
	Layout,
	Button,
	Table,
	Tooltip,
	Spin,
	message 
} from 'antd';

import 'antd/dist/antd.css';
import '../../global.css';

import {
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';

import HeaderSite from "../../components/Header";
import MenuSite from "../../components/Menu";
import FooterSite from "../../components/Footer";

const { Content } = Layout;

const BASE_URL = "http://localhost:4020/";

function Promotions(){
	const [expand, setExpand] = useState(false);
	const [loading, setLoading] = useState(false);
	const [dataPromotion, setDataPromotion] = useState([]);

	// {
	// 	key: ,
	// 	code: ,
	// 	name: ,
	// 	description: ,
	// 	status: ,
	// 	products: [
	// 		{
	// 			id: ,
	// 			name_product: ,
	// 			category: ,
	// 			flavor: ,
	// 			size: ,
	// 			status: ,
	// 			price_pp: ,
	// 			price:
	// 		}
	// 	]
	// }


	useEffect(() => {
		axios.get(BASE_URL+"promotion").then((response) => {
			console.log(response);						
		}).catch((error) => {
			console.log("BUGOU: "+ error);
		});
	}, []);

	const columns = [
	  { title: 'Código', dataIndex: 'code', key: 'code' },
	  { title: 'Nome', dataIndex: 'name', key: 'name' },
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
	    			<Tooltip placement="top" title='Deletar promoção'>
	    				<DeleteOutlined className="icon-table" />
	    			</Tooltip>
	    			<Tooltip placement="top" title='Editar promoção'>
	    				<EditOutlined className="icon-table" />
	    			</Tooltip>
	    		</div>
	    	)
	    },
  	  },
    ];


	return(
		<div>
			<Spin size="large" spinning={loading}>
				<Layout>
					<MenuSite open={expand} />
				    <Layout className="site-layout">
				        <HeaderSite title={'Listagem das promoções'} isListView={true} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
					    <Content className="container-main">    
							<Table
				              size="middle"
							  columns={columns}
							  dataSource={[]}
							/>
					    </Content>
					    <FooterSite />
				 	</Layout>
			   	</Layout>
			</Spin>
	  	</div>
	);
}

export default Promotions;
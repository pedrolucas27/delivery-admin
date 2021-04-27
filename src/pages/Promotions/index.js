import React, { useState } from "react";

import { 
	Layout,
	Button, 
} from 'antd';

import 'antd/dist/antd.css';
import '../../global.css';

import HeaderSite from "../../components/Header";
import MenuSite from "../../components/Menu";
import FooterSite from "../../components/Footer";

const { Content } = Layout;

function Promotions(){
	const [expand, setExpand] = useState(false);

	return(
		<div>
			<Layout>
				<MenuSite open={expand} />
			    <Layout className="site-layout">
			        <HeaderSite title={'Listagem das promoções'} isListView={true} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
				    <Content className="container-main">
				            

				    </Content>
				    <FooterSite />
			 	</Layout>
		   	</Layout>
	  	</div>
	);
}

export default Promotions;
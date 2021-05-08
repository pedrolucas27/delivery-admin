import React, { useState } from "react";

import { 
	Layout,
	message,
	Spin,
	Tabs,
  	Badge,
  	Typography,
  	Row,
  	Col 
} from 'antd';

import 'antd/dist/antd.css';
import '../../global.css';

import HeaderSite from "../../components/Header";
import MenuSite from "../../components/Menu";
import FooterSite from "../../components/Footer";
import CardOrder from "../../components/CardOrder";

const { Content } = Layout;
const { Title } = Typography;
const { TabPane }  = Tabs;

function OrderTracking() {
	const [expand, setExpand] = useState(false);
	const [loading, setLoading] = useState(false);

	return (
		<div>
			<Spin size="large" spinning={loading}>
				<Layout>
					<MenuSite open={expand} />
			        <Layout className="site-layout">
			        <HeaderSite title={'Acompanhamento de pedidos'} isListView={false} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
			        <Content className="container-main">

							<Tabs defaultActiveKey="1" type="card" size="large">
			          			<TabPane tab={
					                <Badge count={5}>
					                    <Title level={5}>Pedidos em análise</Title>
					                </Badge>
			                		} 
			                		key="1"
			            		>

			            			<Row style={{ padding: "10px" }}>
										<Col span={8}>
											<CardOrder />
										</Col>
	      							</Row>
			          			</TabPane>


			          			<TabPane tab={
					                <Badge count={5}>
					                    <Title level={5}>Pedidos em produção</Title>
					                </Badge>
			                		}
			                		key="2"
			              		>

			         		  	</TabPane>

			              		<TabPane tab={
			                  		<Badge count={10}>
			                  	  		<Title level={5}>Pedidos aguardando retirada</Title>
			                  		</Badge>
			                		}
			                		key="3"
			              		>

			              		</TabPane>
			       			</Tabs>

			        </Content>
			        <FooterSite />
			        </Layout>
		      	</Layout>
		    </Spin>
  		</div>
  	);
}

export default OrderTracking;

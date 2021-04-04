import React, { useState } from "react";

import { 
	Layout,
	Row,
	Col,
	Input 
} from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import 'antd/dist/antd.css';

const { Header } = Layout;


function HeaderSite(props){
	return(
		<Header style={{ padding: 0, backgroundColor: '#fff' }}>
			<Row>
				<Col span={16}>
					{
						props.expandMenu ? (
							<MenuUnfoldOutlined className='trigger' onClick={props.updateExpandMenu}/>
						):(
							<MenuFoldOutlined className='trigger' onClick={props.updateExpandMenu}/>
						)
					}
					<h2 style={{ display: 'inline-block' }}>{props.title}</h2>        
				</Col>
				<Col span={8}>
					{
						props.isListView && (
							<Input className="input-radius" placeholder="Pesquisar por nome, código ..."/>
						)
					}
				</Col>
			</Row>
			
		</Header>
	);
}

export default HeaderSite;
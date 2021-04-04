import React, { useState } from "react";
import { Layout, Menu } from 'antd';
import {
  LineChartOutlined,
  FormOutlined,
  OrderedListOutlined,
  BellOutlined,
  UsergroupAddOutlined,
  ShopOutlined
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import '../../global.css';

const { Sider } = Layout;
const { SubMenu } = Menu;

function MenuSite(props){

  function redirect(path){
    window.location.href = path;
  }


	return(
		    <Sider className="menu" trigger={null} collapsible collapsed={props.open}>
          <div className="logo" />
          <Menu className="menu" mode="inline" selectedKeys={props.menuItem} openKeys={props.subMenu}>
            <Menu.Item className="i-menu" key="1" icon={<LineChartOutlined />}>
              Relatório
            </Menu.Item>

            <Menu.Item className="i-menu" key="2" icon={<UsergroupAddOutlined />}>
              Meus clientes
            </Menu.Item>

            <Menu.Item className="i-menu" key="3" icon={<BellOutlined />}>
              Pedidos
            </Menu.Item>

            <Menu.Item className="i-menu" key="5" icon={<ShopOutlined />}>
              Pdv
            </Menu.Item>

            <SubMenu className="i-menu" key="sub1" icon={<FormOutlined />} title="Cadastros">
              <Menu.Item className="i-menu" key="sub1-1" onClick={() => redirect('/addProduct')}>Produto</Menu.Item>
              <Menu.Item className="i-menu" key="sub1-2" onClick={() => redirect('/addCategory')}>Categoria</Menu.Item>
              <Menu.Item className="i-menu" key="sub1-3" onClick={() => redirect('/addFlavor')}>Sabor</Menu.Item>
              <Menu.Item className="i-menu" key="sub1-4" onClick={() => redirect('/addSize')}>Tamanho</Menu.Item>
              <Menu.Item className="i-menu" key="sub1-5" onClick={() => redirect('/#')}>Borda</Menu.Item>
              <Menu.Item className="i-menu" key="sub1-6" onClick={() => redirect('/#')}>Cupom</Menu.Item>
              <Menu.Item className="i-menu" key="sub1-7" onClick={() => redirect('/#')}>Promoção</Menu.Item>
            </SubMenu>

            <SubMenu className="i-menu" key="sub2" icon={<OrderedListOutlined />} title="Listagens">
              <Menu.Item className="i-menu" key="sub2-1" onClick={() => redirect('/products')}>Produtos</Menu.Item>
              <Menu.Item className="i-menu" key="sub2-2" onClick={() => redirect('/categories')}>Categorias</Menu.Item>
              <Menu.Item className="i-menu" key="sub2-3" onClick={() => redirect('/flavors')}>Sabores</Menu.Item>              
              <Menu.Item className="i-menu" key="sub2-4" onClick={() => redirect('/sizes')}>Tamanhos</Menu.Item>
              <Menu.Item className="i-menu" key="sub2-5" onClick={() => redirect('/#')}>Bordas</Menu.Item>
              <Menu.Item className="i-menu" key="sub2-6" onClick={() => redirect('/#')}>Cupons</Menu.Item>
              <Menu.Item className="i-menu" key="sub2-7" onClick={() => redirect('/#')}>Promoções</Menu.Item>
            </SubMenu>


          </Menu>
        </Sider>
	);
}

export default MenuSite;
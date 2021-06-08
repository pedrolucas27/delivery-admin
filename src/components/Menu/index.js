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

function MenuSite(props) {

  function redirect(path) {
    window.location.href = path;
  }


  return (
    <Sider className="menu" trigger={null} collapsible collapsed={props.open}>
      <div className="logo" />
      <Menu className="menu" mode="inline" selectedKeys={[props.current]} openKeys={[props.openCurrent]}>
        <Menu.Item className="i-menu" key="dashboard" icon={<LineChartOutlined />}>
          Relatório
            </Menu.Item>

        <Menu.Item className="i-menu" key="clients" icon={<UsergroupAddOutlined />}>
          Meus clientes
            </Menu.Item>

        <Menu.Item className="i-menu" key="orders" icon={<BellOutlined />}>
          Pedidos
            </Menu.Item>

        <Menu.Item className="i-menu" key="pdv" icon={<ShopOutlined />}>
          Pdv
            </Menu.Item>

        <SubMenu className="i-menu" key="register" icon={<FormOutlined />} title="Cadastros">
          <Menu.Item className="i-menu" key="addProduct" onClick={() => redirect('/addProduct')}>Produto</Menu.Item>
          <Menu.Item className="i-menu" key="addCategory" onClick={() => redirect('/addCategory')}>Categoria</Menu.Item>
          <Menu.Item className="i-menu" key="addFlavor" onClick={() => redirect('/addFlavor')}>Sabor</Menu.Item>
          <Menu.Item className="i-menu" key="addAdditional" onClick={() => redirect('/addAdditional')}>Adiconal</Menu.Item>
          <Menu.Item className="i-menu" key="addCoupom" onClick={() => redirect('/addCoupom')}>Cupom</Menu.Item>
          <Menu.Item className="i-menu" key="addPromotion" onClick={() => redirect('/addPromotion')}>Promoção</Menu.Item>
          <Menu.Item className="i-menu" key="addFormPayment" onClick={() => redirect('/addFormPayment')}>F. de Pagamento</Menu.Item>
        </SubMenu>

        <SubMenu className="i-menu" key="list" icon={<OrderedListOutlined />} title="Listagens">
          <Menu.Item className="i-menu" key="products" onClick={() => redirect('/products')}>Produtos</Menu.Item>
          <Menu.Item className="i-menu" key="categories" onClick={() => redirect('/categories')}>Categorias</Menu.Item>
          <Menu.Item className="i-menu" key="flavors" onClick={() => redirect('/flavors')}>Sabores</Menu.Item>
          <Menu.Item className="i-menu" key="additionals" onClick={() => redirect('/additionals')}>Adicionais</Menu.Item>
          <Menu.Item className="i-menu" key="coupons" onClick={() => redirect('/coupons')}>Cupons</Menu.Item>
          <Menu.Item className="i-menu" key="promotions" onClick={() => redirect('/promotions')}>Promoções</Menu.Item>
          <Menu.Item className="i-menu" key="formsPayments" onClick={() => redirect('/formsPayments')}>Fs. de Pagamento</Menu.Item>
        </SubMenu>

      </Menu>
    </Sider>
  );
}

export default MenuSite;
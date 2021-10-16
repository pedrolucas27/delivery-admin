import React from "react";
import { Layout } from 'antd';
import 'antd/dist/antd.css';
const { Footer } = Layout;
function FooterSite() {
	return (
		<Footer style={{ textAlign: 'center', bottom: 0 }}> Master Pizza @2021 </Footer>
	);
}
export default FooterSite;

import React from "react";
import {
	Typography,
	Col
} from 'antd';
import emptyImage from "../../images/empty.png";
const { Title } = Typography;
function EmptyData(props) {
	return (
		<Col span={24} style={{ textAlign: 'center' }}>
			<Title level={2} style={{ margin: 10 }}>
				{props.title}
			</Title>
			<img src={emptyImage} width='100' height='100' alt='Imagem empty' />
		</Col>
	);
}
export default EmptyData;
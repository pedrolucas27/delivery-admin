import React from "react";
import {
	List,
	Typography
} from 'antd';
import 'antd/dist/antd.css';
import { changeCommaForPoint } from "../../helpers.js";
const { Title } = Typography;
function ListProductsPromotion(props) {
	return (
		<div>
			<List
				header={<div>Produtos que estão nesta promoção</div>}
				bordered
				dataSource={props.dataProducts}
				renderItem={item => (
					<List.Item key={item.id_product}>
						<div>
							<Title level={5}>{item.name_product}</Title>
							<p>
								<span style={{ fontWeight: "bold" }}>Preço promocional: </span>
								{changeCommaForPoint(item.price_pp)}
							</p>
						</div>
					</List.Item>
				)}
			/>
		</div>
	);
}
export default ListProductsPromotion;
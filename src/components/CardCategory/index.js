import React from "react";
import { 
	Card,
	Typography
} from 'antd';
import {
  	CheckCircleOutlined
} from '@ant-design/icons';
import '../../global.css';

const { Title } = Typography;

function CardCategory(props){
	return(
		<div>
			<Card
				hoverable 
				className={props?.check ? "card-pdv check-card-pdv" : "card-pdv"}
				onClick={() => props.onChangeCategory()}
			>
				<Title level={3}>
					{props?.name}
				</Title>
				<p>
					{props?.check ? "Categoria escolhida!":"Clique para escolher."}
				</p>
				{props?.check && (
					<div>
						<CheckCircleOutlined className="icon-table" />
					</div>
				)}
																    	
			</Card>
		</div>
	);
}

export default CardCategory;
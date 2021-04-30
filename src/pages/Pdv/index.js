import React, { useState, useEffect } from "react";
import axios from "axios";

import { 
	Layout,
	Button, 
	Row, 
	Col,
	message,
	Spin,
	Steps,
	Card,
	Typography
} from 'antd';
import {
  	CheckCircleOutlined
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import '../../global.css';

import HeaderSite from "../../components/Header";
import MenuSite from "../../components/Menu";
import FooterSite from "../../components/Footer";

const { Content } = Layout;
const { Step } = Steps;
const { Title } = Typography;

const BASE_URL = "http://localhost:4020/";

function Pdv() {
	const [expand, setExpand] = useState(false);
	const [stepCurrent, setStepCurrent] = useState(0);
	const [isGuirland, setIsGuirland] = useState(false);
	const [loading, setLoading] = useState(false);

	const [dataCategory, setDataCategory] = useState([]);
	const [dataFlavor, setDataFlavor] = useState([]);
	const [dataProductsByFilter, setDataProductsByFilter] = useState([]);


	//ID's que compõe o pedido
	const [idCategoryOrder, setIdCategoryOrder] = useState(null);
	const [idFlavorOrder, setIdFlavorOrder] = useState(null);
	const [idProductOrder, setIdProductOrder] = useState(null);

	useEffect(() => {
		axios.get(BASE_URL+"category").then((response) => {
			let array = [];
			response?.data.forEach((category) => {
				array.push({
					id: category?.id_category,
					name: category?.name_category,
					check: false
				})
			})
			setDataCategory(array);						
		}).catch((error) => {
			console.log("BUGOU: "+ error);
		});


	}, []);


	const getFlavorsByCategory = async (idCategory) => {
		await axios.get(BASE_URL+"flavor/byCategory/"+idCategory).then((response) => {
			let array = [];
			response?.data.forEach((flavor) => {
				array.push({
					id: flavor?.id,
					name: flavor?.name_flavor,
					description: flavor?.description,
					check: false
				})
			})
			setDataFlavor(array);						
		}).catch((error) => {
			console.log("BUGOU: "+ error);
		});
	}

	const getProductsByCategoryAndFlavor = async (idCategory, idFlavor) => {
		await axios.get(BASE_URL+"product/others/"+idCategory+"/"+idFlavor).then((response) => {
			console.log(response);
			// let array = [];
			// response?.data.forEach((flavor) => {
			// 	array.push({
			// 		id: flavor?.id,
			// 		name: flavor?.name_flavor,
			// 		description: flavor?.description,
			// 		check: false
			// 	})
			// })
			// setDataFlavor(array);						
		}).catch((error) => {
			console.log("BUGOU: "+ error);
		});
	}


	const updateStepCurrent = () => {
		setLoading(true);
		if(stepCurrent !== 3){
			if(stepCurrent === 0){
				console.log("Indo para o caso 1: listagem de sabores");
				getFlavorsByCategory(idCategoryOrder);
			}else if(stepCurrent === 1){
				console.log("Indo para caso 2: listagem de produtos");
				getProductsByCategoryAndFlavor(idCategoryOrder, idFlavorOrder);
			}else{
				//caso 2
			}
			setLoading(false);
			setStepCurrent(stepCurrent + 1);
		}else{
			setLoading(false);
			console.log("Abrir modal para inserir dados de entrega do cliente.")
		}
		
	}

	const onChangeCategory = (idCategory) => {
		setLoading(true);
		setIdCategoryOrder(idCategoryOrder !== null ? null:idCategory);

		const category = dataCategory?.filter((item) => item?.id === idCategory)[0];
		const newCategory = { id: idCategory, name: category?.name, check: !category?.check };

		let array = [];
		dataCategory?.map((item) => {
			if(item?.id !== idCategory){
				array.push({ id: item?.id, name: item?.name, check: false });
			}else{
				array.push(newCategory);
			}
		})		
		setDataCategory(array);
		setLoading(false);
	}


	const onChangeFlavor = (idFlavor) => {
		setLoading(true);
		setIdFlavorOrder(idFlavorOrder !== null ? null:idFlavor);

		const flavor = dataFlavor?.filter((item) => item?.id === idFlavor)[0];
		const newFlavor = { id: idFlavor, name: flavor?.name, description: flavor?.description, check: !flavor?.check };

		let array = [];
		dataFlavor?.map((item) => {
			if(item?.id !== idFlavor){
				array.push({ id: item?.id, name: item?.name, description: item?.description, check: false });
			}else{
				array.push(newFlavor);
			}
		})		
		setDataFlavor(array);
		setLoading(false);
	}


	return (
		<div>
			<Spin size="large" spinning={loading}>
				<Layout>
					<MenuSite open={expand} />
			        <Layout className="site-layout">
				        <HeaderSite title={'Ponto de venda'} isListView={false} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
				        <Content className="container-main">
				    		<Row>
				    			<Col span={24}>
				    				<Steps current={stepCurrent}>
	          							<Step key={0} title="Categoria" />
	          							<Step key={1} title="Sabor" />
	          							<Step key={2} title={isGuirland ? "Opção":"Produto"} />
	          							<Step key={3} title="Resumo" />
	      							</Steps>
	      							 <div className="steps-content">
	      							 	{
	      							 		stepCurrent === 0 ? (
	      							 			<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
	      							 				{
	      							 					dataCategory?.map((category) => {
	      							 						return(
																<Col span={8} key={category?.id}>
				      							 					<Card
				      							 						hoverable 
				      							 						className={category?.check ? "card-pdv check-card-pdv" : "card-pdv"}
				      							 						onClick={() => onChangeCategory(category?.id)}
				      							 					>
																    	<Title level={3}>
																			{category?.name}
																    	</Title>
																    	<p>
																    		{category?.check ? "Categoria escolhida!":"Clique para escolher."}
																    	</p>
																    	{category?.check && (
																			<div>
																	    		<CheckCircleOutlined className="icon-table" />
																	    	</div>
																    	)}
																    	
																    </Card>
				      							 				</Col>
	      							 						)
	      							 					})
	      							 				}
	      							 			</Row>
	      							 		):
	      							 		stepCurrent === 1 ? (
	      							 			<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
	      							 				{
	      							 					dataFlavor?.map((flavor) => {
	      							 						return(
																<Col span={8} key={flavor?.id}>
				      							 					<Card
				      							 						hoverable 
				      							 						className={flavor?.check ? "card-pdv-2 check-card-pdv" : "card-pdv-2"}
				      						      						onClick={() => onChangeFlavor(flavor?.id)}
				      							 					>
																    	<Title level={3}>
																			{flavor?.name}
																    	</Title>
																    	<p style={{ margin: 2 }}>
																    		{flavor?.description ? flavor?.description:"Não possui descrição."}
																    	</p>

																    	{flavor?.check && (
																    		<Row>
																	    		<Col span={24}>
																	    			<div className="container-icon-card">
																	    				<CheckCircleOutlined className="icon-table" />
																	    			</div>
																	    		</Col>
																    		</Row>
																    	)}
																    </Card>
				      							 				</Col>
	      							 						)
	      							 					})
	      							 				}
	      							 			</Row>
	      							 		):
	      							 		stepCurrent === 2 ? (
	      							 			<p>Tamanho</p>
	      							 		):(
	      							 			<p>Resumo</p>
	      							 		)
	      							 	}
	      							 </div>

	      							 <div style={{ marginTop: "15px" }}>
										<Button 
											onClick={() => updateStepCurrent()} 
											shape="round" 
											className="button" 
											style={{ margin: "5px" }}
										>
										    {stepCurrent !== 3 ? "Seguir":"Finalizar pedido"}
										</Button>
										{
											stepCurrent !== 0 && (
												<Button 
													onClick={() => setStepCurrent(stepCurrent - 1)} 
													shape="round" 
													className="button-cancel" 
													style={{ margin: "5px" }}
												>
										    		Voltar
												</Button>
											)
										}	
	      							 </div>

				    			</Col>
				    		</Row>    		    
				        </Content>
			          <FooterSite />
			        </Layout>
		      	</Layout>
		    </Spin>
  		</div>
  	);
}

export default Pdv;

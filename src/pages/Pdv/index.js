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
	Typography,
	Modal,
	Table,
	Tooltip,
} from 'antd';
import {
	DeleteOutlined
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import '../../global.css';

import { changeCommaForPoint } from "../../helpers.js";
import HeaderSite from "../../components/Header";
import MenuSite from "../../components/Menu";
import FooterSite from "../../components/Footer";
import CardProduct from "../../components/CardProduct";
import CardFlavor from "../../components/CardFlavor";
import CardCategory from "../../components/CardCategory";
import CardAdditional from "../../components/CardAdditional";
import ModalAddProductCart from "../../components/ModalAddProductCart";
import ModalFinishOrder from "../../components/ModalFinishOrder";

const { Content } = Layout;
const { Step } = Steps;
const { Title } = Typography;

const BASE_URL = "http://localhost:8080/";

function Pdv() {
	const [expand, setExpand] = useState(false);
	const [stepCurrent, setStepCurrent] = useState(0);
	const [loading, setLoading] = useState(false);

	const [dataCategory, setDataCategory] = useState([]);
	const [dataFlavor, setDataFlavor] = useState([]);
	const [dataProductsByFilter, setDataProductsByFilter] = useState([]);
	const [dataAdditionalsByCategory, setDataAdditionalsByCategory] = useState([]);


	//ID's que compõe o pedido
	const [idCategoryOrder, setIdCategoryOrder] = useState(null);
	const [idFlavorOrder, setIdFlavorOrder] = useState(null);
	const [idsFlavorsProductMisto, setIdsFlavorsProductMisto] = useState([]);
	const [idProductOrder, setIdProductOrder] = useState(null);

	//states auxiliares
	const [nameCategoryChange, setNameCategoryChange] = useState(null);
	const [visibleAddProductCard, setVisibleAddProductCart] = useState(false);
	const [dataProductsCart, setDataProductsCart] = useState([]);
	const [productModal, setProductModal] = useState('');
	const [visibleModalFinishOrder, setVisibleModalFinishOrder] = useState(false);
	const [valueTotalOrder, setValueTotalOrder] = useState(0);

	useEffect(() => {
		axios.get(BASE_URL + "category").then((response) => {
			let array = [];
			response.data.forEach((category) => {
				array.push({
					id: category.id_category,
					name: category.name_category,
					check: false
				})
			})
			setDataCategory(array);
		}).catch((error) => {
			console.log("BUGOU: " + error);
		});
	}, []);

	const columns = [
		{ title: 'Produto', dataIndex: 'product', key: 'product' },
		{ title: 'Quantidade', dataIndex: 'quantity', key: 'quantity' },
		{
			title: 'Preço (R$)',
			dataIndex: 'price',
			key: 'price',
			render: (__, record) => {
				return (
					<div>
						{changeCommaForPoint(record.price)}
					</div>
				)
			},
		},
		{
			title: 'Ações',
			dataIndex: '',
			key: 'x',
			render: (__, record) => {
				return (
					<div>
						<Tooltip placement="top" title='Deletar item'>
							<DeleteOutlined className="icon-table" onClick={() => deleteProductOrder(record.key)} />
						</Tooltip>
					</div>
				)
			},
		},
	];


	const deleteProductOrder = (idProductOrder) => {
		setLoading(true);
		const priceProductRemove = dataProductsCart.filter((item) => item.key === idProductOrder)[0].price;
		const newData = dataProductsCart.filter((item) => item.key !== idProductOrder);
		setValueTotalOrder(valueTotalOrder - priceProductRemove);
		setDataProductsCart(newData);
		setLoading(false);
	}


	const getFlavorsByCategory = async (idCategory) => {
		await axios.get(BASE_URL + "flavor/byCategory/" + idCategory).then((response) => {
			let array = [];
			response.data.forEach((flavor) => {
				array.push({
					id: flavor.id,
					name: flavor.name_flavor,
					description: flavor.description,
					check: false
				})
			})
			setDataFlavor(array);
		}).catch((error) => {
			console.log("BUGOU: " + error);
		});
	}

	const getAdditionalsByCategory = async (idCategory) => {
		await axios.get(BASE_URL + "additional/" + idCategory).then((response) => {
			let array = [];
			response.data.forEach((additional) => {
				array.push({
					id: additional.id,
					name: additional.name,
					price: parseFloat(additional.price),
					quantity: 0
				})
			})
			setDataAdditionalsByCategory(array);
			return array;
		}).catch((error) => {
			console.log("BUGOU: " + error);
		});
	}

	const getProductsByCategoryAndFlavor = async (idCategory, idFlavor) => {
		await axios.get(BASE_URL + "product/others/" + idCategory + "/" + idFlavor).then((response) => {
			let array = [];
			response.data.forEach((product) => {
				array.push({
					id: product.id_product,
					name: product.name_product,
					description: product.description,
					price: parseFloat(product.price),
					size: product.size_product + " (" + product.unit + " - " + product.abreviation + ")"
				})
			})
			setDataProductsByFilter(array);
		}).catch((error) => {
			console.log("BUGOU: " + error);
		});
	}


	const getProductsByMisto = async (idCategory) => {
		let array = [];
		await axios.get(BASE_URL + "product/others/" + idCategory).then((response) => {
			response.data.forEach((product) => {
				if ((product.fk_id_flavor === idsFlavorsProductMisto[0]) || (product.fk_id_flavor === idsFlavorsProductMisto[1])) {
					array.push(product);
				}
			})
		}).catch((error) => {
			console.log("BUGOU: " + error);
		});

		filterProductsMistoPerSize(array);
	}

	const filterProductsMistoPerSize = (products) => {
		let sizesSimilar = [];
		let productsMisto = [];

		const productsFlavorOne = products.filter((item) => item.fk_id_flavor === idsFlavorsProductMisto[0]);
		const productsFlavorTwo = products.filter((item) => item.fk_id_flavor === idsFlavorsProductMisto[1]);

		for (let i = 0; i < productsFlavorOne.length; i++) {
			for (let j = 0; j < productsFlavorTwo.length; j++) {
				if (productsFlavorOne[i].fk_id_unit === productsFlavorTwo[j].fk_id_unit) {
					sizesSimilar.push(productsFlavorOne[i].fk_id_unit);
					productsMisto.push({
						id: productsFlavorOne[i].id_product,
						id_2: productsFlavorTwo[j].id_product,
						name: "Pizza: 1/2 " + productsFlavorOne[i].name_flavor + " + 1/2 " + productsFlavorTwo[j].name_flavor,
						description: "Produto misto.",
						price: parseFloat(productsFlavorOne[i].price + productsFlavorTwo[j].price),
						size: productsFlavorOne[i].size_product + " (" + productsFlavorOne[i].unit + " - " + productsFlavorOne[i].abreviation + ")"
					});
				}
			}
		}

		setDataProductsByFilter(productsMisto);
	}


	const updateStepCurrent = () => {
		setLoading(true);
		if (stepCurrent !== 3) {
			if (stepCurrent === 0) {
				if (idCategoryOrder !== null) {
					getFlavorsByCategory(idCategoryOrder);
					setStepCurrent(stepCurrent + 1);
				} else {
					message.warning('Escolha uma categoria para poder seguir.');
				}
			} else if (stepCurrent === 1) {
				if ((nameCategoryChange !== 'PIZZA') && (nameCategoryChange !== 'PIZZAS')) {
					getProductsByCategoryAndFlavor(idCategoryOrder, idFlavorOrder);
					setStepCurrent(stepCurrent + 1);
				} else {
					if (idsFlavorsProductMisto.length === 1) {
						getProductsByCategoryAndFlavor(idCategoryOrder, idsFlavorsProductMisto[0]);
						setStepCurrent(stepCurrent + 1);
					} else {
						getProductsByMisto(idCategoryOrder);
						setStepCurrent(stepCurrent + 1);
					}
				}
			} else if (stepCurrent === 2) {
				getAdditionalsByCategory(idCategoryOrder);
				setStepCurrent(stepCurrent + 1);
			} else {
				//caso 2 -> ABRIR MODAL PARA CONFIRMAR ITEM (QUANTIDADE, ADICIONAIS, OBSERVAÇÃO...)
				console.log("FAZER ALGUMA COISA");
			}
			setLoading(false);
		} else {
			setLoading(false);
			console.log("Abrir modal para inserir dados de entrega do cliente.")
		}
	}




	const onChangeCategory = (idCategory) => {
		setLoading(true);
		setIdCategoryOrder(idCategoryOrder === idCategory ? null : idCategory);

		const category = dataCategory.filter((item) => item.id === idCategory)[0];
		const newCategory = { id: idCategory, name: category.name, check: !category.check };

		const nameCatgeory = category.name.toUpperCase();
		setNameCategoryChange(nameCatgeory);

		let array = [];
		dataCategory.forEach((item) => {
			if (item.id !== idCategory) {
				array.push({ id: item.id, name: item.name, check: false });
			} else {
				array.push(newCategory);
			}
		})

		setDataCategory(array);
		setLoading(false);
	}


	const onChangeFlavor = (idFlavor) => {
		setLoading(true);

		if ((nameCategoryChange !== 'PIZZA') && (nameCategoryChange !== 'PIZZAS')) {
			setIdFlavorOrder(idFlavorOrder === idFlavor ? null : idFlavor);
			const flavor = dataFlavor.filter((item) => item.id === idFlavor)[0];
			const newFlavor = { id: idFlavor, name: flavor.name, description: flavor.description, check: !flavor.check };

			let array = [];
			dataFlavor.forEach((item) => {
				if (item.id !== idFlavor) {
					array.push({ id: item.id, name: item.name, description: item.description, check: false });
				} else {
					array.push(newFlavor);
				}
			})
			setDataFlavor(array);
		} else {
			const exist = idsFlavorsProductMisto.filter((id) => id === idFlavor).length !== 0 ? true : false;

			if (!exist) {
				if (idsFlavorsProductMisto.length < 2) {
					setIdsFlavorsProductMisto([...idsFlavorsProductMisto, idFlavor]);
					const flavor = dataFlavor.filter((item) => item.id === idFlavor)[0];
					const newFlavor = { id: idFlavor, name: flavor.name, description: flavor.description, check: true };

					let array = [];
					dataFlavor.forEach((item) => {
						if (item.id !== idFlavor) {
							array.push(item);
						} else {
							array.push(newFlavor);
						}
					})
					setDataFlavor(array);

				} else {
					message.warning('Escolha no máximo dois sabores.');
				}
			} else {
				setIdsFlavorsProductMisto(idsFlavorsProductMisto.filter((item) => item !== idFlavor));
				const flavor = dataFlavor.filter((item) => item.id === idFlavor)[0];
				const newFlavor = { id: idFlavor, name: flavor.name, description: flavor.description, check: false };

				let array = [];
				dataFlavor.forEach((item) => {
					if (item.id !== idFlavor) {
						array.push(item);
					} else {
						array.push(newFlavor);
					}
				})
				setDataFlavor(array);
			}

		}

		setLoading(false);
	}


	const onChangeProductOuthers = (idProduct) => {
		const line = dataProductsByFilter.filter((item) => item.id === idProduct)[0];
		setProductModal(line);
		setIdProductOrder(idProduct);

		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			setVisibleAddProductCart(true);
		}, 1500);
	}


	const addProductCart = async (quantity) => {
		setLoading(true);
		let productCart = null;
		if (idsFlavorsProductMisto && (idsFlavorsProductMisto.length === 2)) {
			productCart = {
				key: productModal.id,
				key2: productModal.id_2,
				product: productModal.name,
				quantity: quantity,
				price: quantity * productModal.price,
				is_additional: false,
				is_product_misto: true,
				object: productModal
			};
		} else {
			productCart = {
				key: productModal.id,
				key2: null,
				product: productModal.name,
				quantity: quantity,
				price: quantity * productModal.price,
				is_additional: false,
				is_product_misto: false,
				object: productModal
			};
		}


		setValueTotalOrder(valueTotalOrder + productCart.price);
		setDataProductsCart([...dataProductsCart, productCart]);
		setLoading(true);

		const additionals = await getAdditionalsByCategory(idCategoryOrder);
		if (additionals && additionals.length !== 0) {
			setStepCurrent(stepCurrent + 1);
		} else {
			setStepCurrent(4);
		}

		setVisibleAddProductCart(false);
		setLoading(false);
	}


	const backToStart = async () => {
		setLoading(true);

		setStepCurrent(0);
		setIdCategoryOrder(null);
		setIdFlavorOrder(null);
		setIdProductOrder(null);
		setIdsFlavorsProductMisto([]);

		await axios.get(BASE_URL + "category").then((response) => {
			let array = [];
			response.data.forEach((category) => {
				array.push({
					id: category.id_category,
					name: category.name_category,
					check: false
				})
			})
			setDataCategory(array);
		}).catch((error) => {
			console.log("BUGOU: " + error);
		});

		setLoading(false);
	}


	const viewOrder = () => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			setStepCurrent(4);
		}, 1500);
	}


	const updateQuantityAdditional = (flag, idAdditional) => {
		const additional = dataAdditionalsByCategory.filter((item) => item.id === idAdditional)[0];
		const newAdditional = {
			id: additional.id,
			name: additional.name,
			price: parseFloat(additional.price),
			quantity: flag ? (additional.quantity + 1) : (additional.quantity - 1)
		}
		let array = [];
		dataAdditionalsByCategory.forEach((item) => {
			if (item.id !== idAdditional) {
				array.push({
					id: item.id,
					name: item.name,
					price: parseFloat(item.price),
					quantity: item.quantity
				});
			} else {
				array.push(newAdditional);
			}
		})
		setDataAdditionalsByCategory(array);
	}


	const includeAdditionalsOrder = () => {
		setLoading(true);

		let additionals = [];
		let count = 0;
		dataAdditionalsByCategory.forEach((item) => {
			if (item.quantity !== 0) {
				additionals.push({
					key: item.id,
					key2: null,
					product: item.name,
					quantity: item.quantity,
					price: item.quantity * item.price,
					is_additional: true,
					is_product_misto: false,
					object: item
				});

				count = count + (item.quantity * item.price)
			}
		})

		setValueTotalOrder(valueTotalOrder + count);
		setDataProductsCart(dataProductsCart.concat(additionals));
		setStepCurrent(4);
		setLoading(false);
	}



	const onFinishOrder = async (values) => {
		setLoading(true);

		let array = [];
		let price_order = 0;

		dataProductsCart.forEach((item) => {
			array.push({
				id_cart_fk: null,
				id_product_fk: !item.is_additional ? item.key : null,
				id_product_fk2: item.key2 || null,
				quantity_item: item.quantity,
				price_item_order: (item.quantity * item.price),
				observation: null,
				id_additional_fk: item.is_additional ? item.key : null
			});

			price_order = price_order + (item.quantity * item.price)

		})


		let address = `Nome: ${values.name_client};Telefone: ${values.phone_cell};Endereço: ${values.address}`

		const responseProductCart = await axios.post(BASE_URL + "cart_product",
			{
				products: array,
				is_pdv: true
			}
		);


		const arrayIdsProducts = responseProductCart.data.ids_products_cart;
		if (responseProductCart.status === 200) {
			const responseOrder = await axios.post(BASE_URL + "createOrder",
				{
					name_coupom: values.coupom || null,
					price: price_order,
					status_order: 0,
					observation: values.observation || null,
					address_client: String(address),
					id_client_fk: null,
					is_pdv: true
				}
			);


			const idOrder = responseOrder.data.id_order;
			if (responseOrder.status === 200) {

				const responseProductOrder = await axios.post(BASE_URL + "createProductsOrder",
					{
						id_order: idOrder,
						ids_products: arrayIdsProducts
					}
				);

				if (responseProductOrder.status === 200) {
					message.success(responseProductOrder.data.message);
					setVisibleModalFinishOrder(false);
					setDataProductsCart([]);
					setLoading(false);

					window.location.href = "/orderTracking";
				} else {
					message.error(responseProductOrder.data.message);
					setLoading(false);
				}


			} else {
				message.error(responseOrder.data.message);
				setLoading(false);
			}

		} else {
			message.error(responseProductCart.data.message);
			setLoading(false);
		}



	}



	const showModalInfo = (idProduct) => {
		const product = dataProductsByFilter.filter((item) => item.id === idProduct)[0];
		Modal.info({
			title: 'Informações do produto',
			content: (
				<div>
					<p className="p-modal-detail">
						<span className="span-modal-detail">Nome:</span> {product.name}
					</p>
					<p className="p-modal-detail">
						<span className="span-modal-detail">Tamanho:</span> {product.id_size ? product.size : "-"}
					</p>
					<p className="p-modal-detail">
						<span className="span-modal-detail">Descrição:</span> {product.description || "-"}
					</p>
				</div>
			),
			okButtonProps: { className: 'button', shape: 'round' },
			onOk() { },
		});
	}


	return (
		<div>
			<Spin size="large" spinning={loading}>
				<Layout>
					<MenuSite open={expand} current={'pdv'} openCurrent={''} />
					<Layout className="site-layout">
						<HeaderSite title={'Ponto de venda'} isListView={false} expandMenu={expand} updateExpandMenu={() => setExpand(!expand)} />
						<Content className="container-main">
							<Row>
								<Col span={24}>
									<Steps current={stepCurrent}>
										<Step key={0} title="Categoria" />
										<Step key={1} title="Sabor" />
										<Step key={2} title="Produto" />
										<Step key={3} title="Adicionais" />
										<Step key={4} title="Pedido" />
									</Steps>
									<div className="steps-content">
										{
											stepCurrent === 0 ? (
												<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
													{
														dataCategory.map((category) => {
															return (
																<Col span={8} key={category.id}>
																	<CardCategory
																		check={category.check}
																		name={category.name}
																		onChangeCategory={() => onChangeCategory(category.id)}
																	/>
																</Col>
															)
														})
													}
												</Row>
											) :
												stepCurrent === 1 ? (
													<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
														{
															dataFlavor.map((flavor) => {
																return (
																	<Col span={8} key={flavor.id}>
																		<CardFlavor
																			check={flavor.check}
																			name={flavor.name}
																			description={flavor.description}
																			onChangeFlavor={() => onChangeFlavor(flavor.id)}
																		/>
																	</Col>
																)
															})
														}
													</Row>
												) :
													stepCurrent === 2 ? (
														<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
															{
																dataProductsByFilter.map((product) => {
																	return (
																		<Col span={8} key={product.id}>
																			<CardProduct
																				name={product.name}
																				price={product.price}
																				size={product.size}
																				showModalDetail={() => showModalInfo(product.id)}
																				onChangeProduct={() => onChangeProductOuthers(product.id)}
																			/>
																		</Col>
																	)
																})
															}
														</Row>
													) :

														stepCurrent === 3 ?
															dataAdditionalsByCategory.length !== 0 ? (
																<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
																	{
																		dataAdditionalsByCategory.map((additional) => {
																			return (
																				<Col span={8} key={additional.id}>
																					<CardAdditional
																						name={additional.name}
																						price={additional.price}
																						quantity={additional.quantity}
																						minusQuantityAdditional={() => updateQuantityAdditional(false, additional.id)}
																						plusQuantityAdditional={() => updateQuantityAdditional(true, additional.id)}
																					/>
																				</Col>
																			)
																		})
																	}
																</Row>
															) : (
																<p>Esta categoria não possui adicionais.</p>
															)


															: (
																<div>
																	<Table
																		size="middle"
																		columns={columns}
																		dataSource={dataProductsCart}
																	/>
																	<Row justify="center">
																		<Col span={10}>
																			<Title level={3}>Valor total do pedido: R$ {valueTotalOrder}</Title>
																		</Col>
																	</Row>
																</div>

															)
										}
									</div>

									{
										stepCurrent === 4 ? (
											<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="center">
												<Col span={6}>
													<Button
														shape="round"
														className="button-cancel"
														style={{ margin: "5px" }}
														onClick={() => {
															setDataProductsCart([]);
															setValueTotalOrder(0);
														}}
														block
													>
														Limpar pedido
													</Button>
												</Col>
												<Col span={6}>
													<Button
														shape="round"
														className="button"
														style={{ margin: "5px" }}
														onClick={() => backToStart()}
														block
													>
														Continuar comprando
													</Button>
												</Col>
												<Col span={6}>
													<Button
														shape="round"
														className="button-finish"
														style={{ margin: "5px" }}
														onClick={() => setVisibleModalFinishOrder(true)}
														block
													>
														Finalizar pedido
													</Button>
												</Col>
											</Row>
										) : (

											<div style={{ marginTop: "15px" }}>
												<Button
													onClick={
														stepCurrent !== 3
															?
															() => updateStepCurrent()
															:
															() => includeAdditionalsOrder()
													}
													shape="round"
													className="button"
													style={{ margin: "5px" }}
												>
													{stepCurrent !== 3 ? "Seguir" : "Incluir no pedido"}
												</Button>

												{
													stepCurrent !== 0 && (
														<Button
															onClick={() => setStepCurrent(stepCurrent - 1)}
															shape="round"
															className="button-cancel"
															style={{ margin: "5px" }}
														>
															{stepCurrent !== 3 ? "Voltar" : "Cancelar"}
														</Button>
													)
												}

												{
													dataProductsCart.length !== 0 && (
														<Button
															shape="round"
															className="button-finish ac"
															style={{ margin: "5px" }}
															onClick={viewOrder}
														>
															Ver pedido
														</Button>
													)
												}

											</div>
										)
									}



								</Col>
							</Row>
						</Content>
						<FooterSite />

						<ModalAddProductCart
							isVisibleAddCart={visibleAddProductCard}
							product={productModal}
							onAddOrder={(quantity) => addProductCart(quantity)}
							onCancelProductChange={() => {
								setIdProductOrder(null);
								setVisibleAddProductCart(!visibleAddProductCard);
							}}
						/>

						<ModalFinishOrder
							visibleModalFinishOrder={visibleModalFinishOrder}
							insertDataOrder={(values) => onFinishOrder(values)}
						/>

					</Layout>
				</Layout>
			</Spin>
		</div>
	);
}

export default Pdv;

import React, { useState, useEffect } from "react";
import API from "../../api.js";
import { changeCommaForPoint, isLoggedAdmin, getStorageERP } from "../../helpers.js";
import {
	Layout,
	Button,
	Row,
	Col,
	message,
	Spin,
	Steps,
	Typography,
	Table,
	Tooltip,
	Popconfirm
} from 'antd';
import {
	DeleteOutlined
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import '../../global.css';
import HeaderSite from "../../components/Header";
import MenuSite from "../../components/Menu";
import FooterSite from "../../components/Footer";
import CardProduct from "../../components/CardProduct";
import CardFlavor from "../../components/CardFlavor";
import CardCategory from "../../components/CardCategory";
import CardAdditional from "../../components/CardAdditional";
import ModalAddProductCart from "../../components/ModalAddProductCart";
import ModalFinishOrder from "../../components/ModalFinishOrder";
import EmptyData from "../../components/EmptyData";
const { Content } = Layout;
const { Step } = Steps;
const { Title } = Typography;
function Pdv() {
	isLoggedAdmin();

	const { idEstablishment } = getStorageERP();
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

	//states auxiliares
	const [nameCategoryChange, setNameCategoryChange] = useState(null);
	const [visibleAddProductCard, setVisibleAddProductCart] = useState(false);
	const [dataProductsCart, setDataProductsCart] = useState([]);
	const [productModal, setProductModal] = useState('');
	const [visibleModalFinishOrder, setVisibleModalFinishOrder] = useState(false);
	const [valueTotalOrder, setValueTotalOrder] = useState(0);

	useEffect(() => {
		getCategoriesActives();
	}, []);

	const columns = [
		{ title: 'Produto', dataIndex: 'product', key: 'product' },
		{ title: 'Quantidade', dataIndex: 'quantity', key: 'quantity' },
		{
			title: 'Preço unitário',
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
							<Popconfirm
								 title="Tem certeza que deseja deletar ?"
								 onConfirm={() => deleteProductOrder(record.key)}
								 okText="Sim"
								 cancelText="Não"
							 >
								<DeleteOutlined className="icon-table" />
							</Popconfirm>
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

		if(newData.length === 0){ backToStart(); }
	}

	const getFlavorsByCategory = async (idCategory) => {
		try {
			await API.get("flavor/byCategory/" + idCategory + "/" + idEstablishment).then((response) => {
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
				message.error("Erro de comunicação com o servidor.");
			});
		} catch (error) {
			message.error("Erro de comunicação com o servidor! Tente novamente.");
		}
	}

	const getAdditionalsByCategory = async (idCategory) => {
		try {
			await API.get("additional/" + idCategory + "/" + idEstablishment).then((response) => {
				let array = [];
				response.data.forEach((additional) => {
					array.push({
						id: additional.id,
						name: additional.name,
						price: additional.price,
						quantity: 0
					})
				})
				setDataAdditionalsByCategory(array);
				if (array && array.length !== 0) {
					setStepCurrent(stepCurrent + 1);
				} else {
					setStepCurrent(4);
				}
				setLoading(false);
			}).catch((error) => {
				message.error("Erro de comunicação com o servidor.");
			});
		} catch (error) {
			message.error("Erro de comunicação com o servidor! Tente novamente.");
		}
	}

	const getProductsByCategoryAndFlavor = async (idCategory, idFlavor) => {
		try {
			await API.get("product/others/" + idCategory + "/" + idFlavor + "/" + idEstablishment).then((response) => {
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
				message.error("Erro de comunicação com o servidor.");
			});
		} catch (error) {
			message.error("Erro de comunicação com o servidor! Tente novamente.");
		}
	}

	const getProductsByMisto = async (idCategory) => {
		try {
			let array = [];
			await API.get("product/others/" + idCategory + "/" + idEstablishment).then((response) => {
				response.data.forEach((product) => {
					if ((product.fk_id_flavor === idsFlavorsProductMisto[0]) || (product.fk_id_flavor === idsFlavorsProductMisto[1])) {
						array.push(product);
					}
				})
				filterProductsMistoPerSize(array);
			}).catch((error) => {
				message.error("Erro de comunicação com o servidor.");
			});
		} catch (error) {
			message.error("Erro de comunicação com o servidor! Tente novamente.");
		}
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
						price: productsFlavorOne[i].price > productsFlavorTwo[j].price ? parseFloat(productsFlavorOne[i].price):parseFloat(productsFlavorTwo[j].price),
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
				if(idFlavorOrder !== null || idsFlavorsProductMisto.length !== 0){
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
				} else {
					message.warning("Escolha ao menos um sabor para poder seguir.");
				}
			} else if (stepCurrent === 2) {
				getAdditionalsByCategory(idCategoryOrder);
				setStepCurrent(stepCurrent + 1);
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
				price: productModal.price,
				is_additional: false,
				is_product_misto: true,
			};
		} else {
			productCart = {
				key: productModal.id,
				key2: null,
				product: productModal.name,
				quantity: quantity,
				price: productModal.price,
				is_additional: false,
				is_product_misto: false,
			};
		}
		setValueTotalOrder(valueTotalOrder + (productModal.price * quantity));
		setDataProductsCart([...dataProductsCart, productCart]);
		setVisibleAddProductCart(false);
		await getAdditionalsByCategory(idCategoryOrder);
	}


	const getCategoriesActives = async () => {
		setLoading(true);
		try {
			API.get("category/actives/" + idEstablishment).then((response) => {
				let array = [];
				response.data.forEach((category) => {
					array.push({
						id: category.id_category,
						name: category.name_category,
						check: false
					})
				})
				setLoading(false);
				setDataCategory(array);
			}).catch((error) => {
				setLoading(false);
				message.error("Erro de comunicação com o servidor.");
			});
		} catch (error) {
			setLoading(false);
			message.error("Erro de comunicação com o servidor.");
		}
	}

	const backToStart = async () => {
		setLoading(true);
		setStepCurrent(0);
		setIdCategoryOrder(null);
		setIdFlavorOrder(null);
		setIdsFlavorsProductMisto([]);
		setLoading(false);
		getCategoriesActives();
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
			price: additional.price,
			quantity: flag ? (additional.quantity + 1) : (additional.quantity - 1)
		}
		let array = [];
		dataAdditionalsByCategory.forEach((item) => {
			if (item.id !== idAdditional) {
				array.push({
					id: item.id,
					name: item.name,
					price: item.price,
					quantity: item.quantity
				});
			} else {
				array.push(newAdditional);
			}
		})
		setDataAdditionalsByCategory(array);
	}

	//Especificamente para pizza (no caso o adicional seria a borda).
	const onChangeAdditional = (id) => {
		const additional = dataAdditionalsByCategory.filter((item) => item.id === id)[0];
		const newAdditional = {
			id: additional.id,
			name: additional.name,
			price: additional.price,
			quantity: additional.quantity !== 1 ? 1 : 0
		}
		let array = [];
		dataAdditionalsByCategory.forEach((item) => {
			if (item.id !== id) {
				array.push({
					id: item.id,
					name: item.name,
					price: item.price,
					quantity: 0
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
					price: item.price,
					is_additional: true,
					is_product_misto: false,
				});

				count = count + (item.quantity * item.price)
			}
		})
		setValueTotalOrder(valueTotalOrder + count);
		setDataProductsCart(dataProductsCart.concat(additionals));
		setStepCurrent(4);
		setLoading(false);
	}

	// PRIMEIRRA FUNÇÃO A SER CHAMADA
	const insertProductCart_PDV = async (values, freight, valueDiscountCoupom, fkIdCoupom) => {
		setVisibleModalFinishOrder(false);
		setLoading(true);
		try {
			let array = [];
			let price_order = 0
			dataProductsCart.forEach((item) => {
				array.push({
					id_cart_fk: null,
					id_product_fk: !item.is_additional ? item.key : null,
					id_product_fk2: item.key2 || null,
					quantity_item: item.quantity,
					price_item_order: (item.quantity * item.price),
					observation: item.is_product_misto ? item.product : null,
					id_additional_fk: item.is_additional ? item.key : null,
					id_company: idEstablishment
				});
				price_order = price_order + (item.quantity * item.price);
			})

			//DESCONTAR O VALOR DO CUPOM
			price_order = price_order - valueDiscountCoupom;

			const responseProductCart = await API.post("cart_product",
				{
					products: array,
					is_pdv: true
				}
			);
			if (responseProductCart.status === 200) {
				const arrayIdsProducts = responseProductCart.data.ids_products_cart;
				await createOrder_PDV(arrayIdsProducts, price_order, freight, values, fkIdCoupom);
			} else {
				message.error(responseProductCart.data.message);
				setLoading(false);
			}
		} catch (error) {
			message.error("Erro de comunicação com o servidor. Tente novamente!");
			setLoading(false);
		}
	}

	// SEGUNDA FUNÇÃO A SER CHAMADA
	const createOrder_PDV = async (ids, price_order, freight, values, fkIdCoupom) => {
		try {
			let fields_address = `${values.street},${values.district},${values.number_house}`;
			const address = `Nome: ${values.name_client};Telefone: ${values.phone_cell};Endereço: ${fields_address}`
			const responseOrder = await API.post("createOrder",
				{
					amount_paid: values.amount_paid ? Number(values.amount_paid.replace(",", ".")):0,
					price_final: price_order,
					freight: freight,
					status_order: 0,
					observation: values.observation || null,
					address_client: String(address),
					id_coupom_fk: fkIdCoupom,
					id_client_fk: null,
					is_pdv: true,
					id_company: idEstablishment,
					idsFormPayment: values.form_payment
				}
			);
			if (responseOrder.status === 200) {
				const idOrder = responseOrder.data.id_order;
				createOrderProductCart_PDV(ids, idOrder);
			} else {
				message.error(responseOrder.data.message);
				setLoading(false);
			}
		} catch (error) {
			setLoading(false);
			message.error("Erro de comunicação com o servidor. Tente novamente!");
		}
	}

	// TERCEIRA FUNÇÃO A SER CHAMADA
	const createOrderProductCart_PDV = async (idsProducts, idOrder) => {
		try {
			const responseProductOrder = await API.post("createProductsOrder",
				{
					id_order: idOrder,
					id_company: idEstablishment,
					ids_products: idsProducts
				}
			);
			if (responseProductOrder.status === 200) {
				setLoading(false);
				message.success(responseProductOrder.data.message);
				setDataProductsCart([]);
				setValueTotalOrder(0);
				setTimeout(() => {
					window.location.href = "/orderTracking";
				}, 1000);
			} else {
				message.error(responseProductOrder.data.message);
				setLoading(false);
			}
		} catch (error) {
			setLoading(false);
			message.error("Erro de comunicação com o servidor. Tente novamente!");
		}
	}

	return (
		<div>
			<Spin size="large" spinning={loading}>
				<Layout className="container-body">
					<MenuSite open={expand} current={'pdv'} openCurrent={''} />
					<Layout>
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
														dataCategory.length !== 0 ?
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
															:
															<EmptyData title='Não possui categorias cadastradas ativas ...' />
													}
												</Row>
											) :
												stepCurrent === 1 ? (
													<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
														{
															dataFlavor.length !== 0 ?
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
																:
																<EmptyData title='Não possui sabores nessa categoria escolhida ...' />
														}
													</Row>
												) :
													stepCurrent === 2 ? (
														<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
															{
																dataProductsByFilter.length !== 0 ?
																	dataProductsByFilter.map((product) => {
																		return (
																			<Col span={8} key={product.id}>
																				<CardProduct
																					name={product.name}
																					price={product.price}
																					size={product.size}
																					onChangeProduct={() => onChangeProductOuthers(product.id)}
																				/>
																			</Col>
																		)
																	})
																	:
																	<EmptyData title='Não possui produtos com essa combinação categoria-sabor(es) escolhida ...' />
															}
														</Row>
													) :
														stepCurrent === 3 ?
															dataAdditionalsByCategory.length !== 0 ? (
																<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
																	{
																		nameCategoryChange !== 'PIZZA' && nameCategoryChange !== 'PIZZAS' ?
																			dataAdditionalsByCategory.map((additional) => {
																				return (
																					<Col span={8} key={additional.id}>
																						<CardAdditional
																							name={additional.name}
																							price={additional.price}
																							quantity={additional.quantity}
																							minusQuantityAdditional={() => updateQuantityAdditional(false, additional.id)}
																							plusQuantityAdditional={() => updateQuantityAdditional(true, additional.id)}
																							isAdditionalDefault={true}
																						/>
																					</Col>
																				)
																			})
																			:
																			dataAdditionalsByCategory.map((additional) => {
																				return (
																					<Col span={8} key={additional.id}>
																						<CardAdditional
																							name={additional.name}
																							price={additional.price}
																							quantity={additional.quantity}
																							isAdditionalDefault={false}
																							onChangeAdditional={() => onChangeAdditional(additional.id)}
																							check={additional.quantity !== 0 ? true : false}
																						/>
																					</Col>
																				)
																			})
																	}
																</Row>
															) : (
																<p>Esta categoria não possui adicionais.</p>
															) : (
																<div>
																	<Table
																		size="middle"
																		columns={columns}
																		dataSource={dataProductsCart}
																	/>
																	<Row justify="center">
																		<Col span={10}>
																			<Title level={3}>Valor total do pedido: R$ {changeCommaForPoint(valueTotalOrder)}</Title>
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
															backToStart();
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
												{
													stepCurrent !== 2 && (
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
															Seguir
														</Button>
													)
												}
												{
													stepCurrent !== 0 && stepCurrent !== 3 && (
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
								setVisibleAddProductCart(!visibleAddProductCard);
							}}
						/>
						<ModalFinishOrder
							visibleModalFinishOrder={visibleModalFinishOrder}
							valueOrder={valueTotalOrder}
							insertDataOrder={
								(values, freight, valueDiscountCoupom, fkIdCoupom) => insertProductCart_PDV(values, freight, valueDiscountCoupom, fkIdCoupom)
							}
							onCancelSubmitOrder={() => setVisibleModalFinishOrder(!visibleModalFinishOrder)}
						/>
					</Layout>
				</Layout>
			</Spin>
		</div>
	);
}
export default Pdv;
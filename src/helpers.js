
export function maskMoney(value){
	let money = "";
	if(value){
		money = money.replace(/\D/g, "");
		money = money.replace(/(\d)(\d{2})$/, "$1,$2");
		money = money.replace(/(?=(\d{3})+(\D))\B/g, ".");
	}
	return money;
}

export function maskNumer(value){
	let number = "";

	return number;
}
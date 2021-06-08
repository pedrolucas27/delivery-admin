
export function maskMoney(value){
	var v = String(value).replace(/\D/g,'');
	v = (v/100).toFixed(2) + '';
	v = v.replace(".", ",");
	v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
	v = v.replace(/(\d)(\d{3}),/g, "$1.$2,");
	return v;
}

export function changeCommaForPoint(value){
	var v = value.toFixed(2);
	v = String(v).replace(".", ",");
	return v;
}

export function maskNumer(value){
	var v = String(value).replace(/\D/g,'');
	return v;
}
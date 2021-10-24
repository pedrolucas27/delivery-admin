import API from "./api.js";

export function maskMoney(value) {
	var v = value;
	if (value) {
		v = String(value).replace(/\D/g, '');
		v = (v / 100).toFixed(2) + '';
		v = v.replace(".", ",");
		v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
		v = v.replace(/(\d)(\d{3}),/g, "$1.$2,");
	}
	return v;
}

export function maskPhoneCell(value) {
	var v = value;
	if (v) {
		v = v.replace(/\D/g, "");
		v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
		v = v.replace(/(\d)(\d{4})$/, "$1-$2");
	}
	return v;
}

export function changeCommaForPoint(value) {
	var v = value;
	if (value) {
		v = value.toFixed(2);
		v = String(v).replace(".", ",");
	}
	return v;
}

export function generateLabelsMonth(lastDay) {
	let labels = [];
	for (let i = 1; i <= lastDay; i++) {
		labels.push(`${i}`);
	}
	return labels;
}

export function maskNumer(value) {
	var v = String(value).replace(/\D/g, '');
	return v;
}

export function maskCep(value) {
	var v = value;
	if (v) {
		v = v.replace(/\D/g, "");
		v = v.replace(/(\d)(\d{3})$/, "$1-$2");
	}
	return v;
}

export function setTokenIdAdmin(token, idEstablishment, idAdmin) {
	localStorage.setItem('@masterpizza-admin-app/token', token);
	localStorage.setItem('@masterpizza-admin-app/idEstablishment', idEstablishment);
	localStorage.setItem('@masterpizza-admin-app/idAdmin', idAdmin);
}

export function getStorageERP() {
	return {
		idEstablishment: localStorage.getItem('@masterpizza-admin-app/idEstablishment'),
		token: localStorage.getItem('@masterpizza-admin-app/token'),
		idAdmin: localStorage.getItem('@masterpizza-admin-app/idAdmin')
	}
}

export async function isLoggedAdmin(path) {
	const TOKEN = localStorage.getItem('@masterpizza-admin-app/token');
	const ID_ADMIN = localStorage.getItem('@masterpizza-admin-app/idAdmin');
	try{
		const response = await API.post("adminLogged", {
			id: ID_ADMIN
		}, {
			headers: { Authorization: 'Bearer '.concat(TOKEN) }
		});
		if(path){
			response.status === 200 ? window.location.href = "/dashboard" : window.location.href = "/"
		}
	}catch(error){
		console.log("Usuário não autenticado.");
	}
}
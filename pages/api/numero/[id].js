async function pesquisabylinha(request, response){
	if(isNumeroLinhaValido(request.query.id)){
		const linhaApi = await fetch(`https://www.sistemas.dftrans.df.gov.br/linha/numero/${request.query.id}`)
		const linhaApiJson = await linhaApi.json()
		
		var sentidos = linhaApiJson[0].sentido
		if (sentidos == "IDA" || sentidos == "VOLTA")
			sentidos = "Ida e volta"
		else if(sentidos != "" || sentidos != null && sentidos == "CIRCULAR")
			sentidos = "Circular"
		else
			sentidos = "Desconhecido"

		response.json({
			condition:"true",
			linha: linhaApiJson[0].numero,
			tarifa: linhaApiJson[0].faixaTarifaria.tarifa,
			sentido: sentidos,
			rota: linhaApiJson[0].descricao,
			numSentados: linhaApiJson[0].tiposOnibus[0].numSentados
		})
	}else{
		response.json({
			condition:"false"
		})
	}
}

function isNumeroLinhaValido(numero) {
	if (numero) {
		return (/(\d\d\d\.\d|\d\.\d\d\d)/.test(numero) || (numero.indexOf('.') == -1 && parseInt(numero) && numero.length == 4));
	}
	
	return false;
}

export default pesquisabylinha;
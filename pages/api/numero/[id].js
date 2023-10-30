async function pesquisabylinha(request, response){
	if(isNumeroLinhaValido(request.query.id)){
		const linhaApi = await fetch(`https://www.sistemas.dftrans.df.gov.br/linha/numero/${request.query.id}`)
		const linhaApiJson = await linhaApi.json()
		
		let sentidos = {}
		for(var i = 0; i < Object.keys(linhaApiJson).length; i++){
			sentidos[`sentido${i}`] = linhaApiJson[0].sendido
		}

		response.json({
			condition:"true",
			linha: linhaApiJson[0].numero,
			tarifa: linhaApiJson[0].faixaTarifaria.tarifa,
			sentidos,
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
async function pesquisabylinha(request, response){
    const linhaApi = await fetch(`https://www.sistemas.dftrans.df.gov.br/linha/numero/${request.query.id}`, { mode: "no-cors"})
    const linhaApiJson = await linhaApi.json()
    
    let sentidos = []
    for(var i = 0; i < Object.keys(linhaApiJson).length; i++){
        sentidos.push(linhaApiJson[i].sentido)
    }

    response.json({
        linha: linhaApiJson[0].numero,
        tarifa: linhaApiJson[0].faixaTarifaria.tarifa,
        sentidos: sentidos,
        rota: linhaApiJson[0].descricao,
        numSentados: linhaApiJson[0].tiposOnibus[0].numSentados
    })
}

export default pesquisabylinha;
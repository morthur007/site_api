async function pesquisabylinha(request, response){
    const linhaApi = await fetch(`https://www.sistemas.dftrans.df.gov.br/linha/numero/${request.query.id}`)
    const linhaApiJson = await linhaApi.json()
    console.log('teste')
    console.log(linhaApiJson)
    
    

    response.json({
        linha: linhaApiJson[0].numero,
        tarifa: linhaApiJson[0].faixaTarifaria.tarifa,
        rota: linhaApiJson[0].descricao,
    })
}

export default pesquisabylinha;
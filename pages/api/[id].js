async function pesquisabylinha(request, response){
    const linhaApi = await fetch(`https://www.sistemas.dftrans.df.gov.br/linha/numero/${request.query.id}`)
    

    response.json({
        linha: "oi"
    })
}

export default pesquisabylinha;
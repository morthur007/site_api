async function pesquisabylinha(request, response){
    try{
        const linhaApi = await fetch(`https://www.sistemas.dftrans.df.gov.br/linha/numero/${request.query.id}`)
    }catch{
        console.log(error)
    }

    response.json({
        linha: "oi"
    })
}

export default pesquisabylinha;
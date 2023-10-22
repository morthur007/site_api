function pesquisabylinha(request, response){
    response.json({
        entrada: request.query.id
    })
}

export default pesquisabylinha;
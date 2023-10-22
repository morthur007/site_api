function pesquisabylinha(request, response){
    response.json({
        date: request.query.id
    })
}

export default pesquisabylinha;
function pesquisabylinha(request, response){
    console.log(response.query.id)
    response.json({
        date: request.query.id
    })
}

export default pesquisabylinha;
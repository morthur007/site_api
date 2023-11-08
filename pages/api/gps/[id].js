var apiUrl = 'https://www.sistemas.dftrans.df.gov.br/gps/linha/'

async function main(req, res){
    let numero = req.query.id;

    const resultNoJson = await fetch(`${apiUrl+numero}/geo/recent`);
    const result = await resultNoJson.json();
    let linhas = result.features;

    let coordenadas = {onibus:[]};
    var j=0;
    for(var i = 0; i < Object.keys(linhas).length; i++){
        const formt = {latitude: linhas[0].geometry.coordinates[1],longitude: linhas[0].geometry.coordinates[0]}
        coordenadas.onibus[i] = formt;
    }
    var linha = linhas[0].properties.linha

    const retorno = {
        linha: linha,
        operadora: linhas[0].properties.operadora,
        onibus: coordenadas.onibus
    }

    

    res.json(retorno)
    

}

export default main;


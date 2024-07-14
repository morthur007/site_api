var apiUrl = 'https://www.sistemas.dftrans.df.gov.br/gps/linha/'

async function main(req, res){
    let numero = req.query.id;

    const resultNoJson = await fetch(`${apiUrl+numero}/geo/recent`);
    const result = await resultNoJson.json();
    let linhas = result.features;

    if(Object.keys(linhas).length != 0){

        let coordenadas = [];
        var j=0;
        for(var i = 0; i < Object.keys(linhas).length; i++){
            const formt = {id: linhas[i].properties.numero, latitude: linhas[i].geometry.coordinates[1],longitude: linhas[i].geometry.coordinates[0]}
            coordenadas.push(formt);
        }

        res.json({
            result: "true",
            linha: linhas[0].properties.linha,
            horario: dataFormatada,
            coordenadas: coordenadas

        })
    }else{
        res.json({
            result: "false"
        })
    }
    

}

export default main;


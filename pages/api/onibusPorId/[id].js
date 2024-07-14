const axios = require('axios');
var apiUrl = "https://geoserver.semob.df.gov.br/geoserver/semob/wfs?service=WFS&request=GetFeature&typeName=semob:Ultima%20Posicao%20Transmitida&outputFormat=json"

async function main(req, res){
  try{
    
    let numero = req.query.id;

    const resultNoJson = await fetch(apiUrl);
    const result = await resultNoJson.json();
    const onibusNoPlural = result.features

    onibusNoPlural.forEach((onibusAtual) => {
      const properties = onibusAtual.properties
      const id = properties.imei;
      if(id === numero){
        res.json({
          result: "true",
          linha: linhas[0].properties.linha,
          id: properties.numerolinha,
          latitude: properties.latitude,
          longitude: properties.longitude

        })
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Erro Interno do Servidor');
  }    
}

export default main;
const axios = require('axios');
var apiUrl = "https://geoserver.semob.df.gov.br/geoserver/semob/wfs?service=WFS&request=GetFeature&typeName=semob:Ultima%20Posicao%20Transmitida&outputFormat=json"

async function main(req, res){
  try{
    
    const numero = req.query.id;

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const resultNoJson = await fetch(apiUrl);

    const result = await resultNoJson.json();
    const onibusNoPlural = result.features

    onibusNoPlural.forEach((onibusAtual) => {
      const properties = onibusAtual.properties
      const id = properties.imei;
      if(id === numero){
        res.json({
          linha: properties.numerolinha,
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
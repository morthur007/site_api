const axios = require('axios');

const apiUrl = "https://geoserver.semob.df.gov.br/geoserver/semob/wfs?service=WFS&request=GetFeature&typeName=semob:Ultima%20Posicao%20Transmitida&outputFormat=json";

async function obterDados(req, res) {
    try {
        const numero = req.query.id;
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

        const resultNoJson = await fetch(apiUrl);
        const result = await resultNoJson.json();
        const onibusNoPlural = result.features;

        const onibusEncontrado = onibusNoPlural.find((onibusAtual) => {
            const properties = onibusAtual.properties;
            return properties.imei == parseInt(numero);
        });

        if (onibusEncontrado) {
            const { numerolinha, imei, latitude, longitude } = onibusEncontrado.properties;
            res.json({
                linha: numerolinha,
                id: imei,
                latitude,
                longitude
            });
        } else {
            res.status(404).send('Ônibus não encontrado');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro Interno do Servidor');
    }
}

export default obterDados;

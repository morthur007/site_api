const axios = require('axios');
const fs = require('fs');

var apiUrl = 'https://www.sistemas.dftrans.df.gov.br/linha/'
const posicaoParadas = fs.readFileSync('./pages/api/[origem]/paradas_info.json', 'utf8');
const objetoJSON = JSON.parse(posicaoParadas);

async function main(req, res){
    let { origem, destino } = req.query;
    let origemEnd = origem.replace(/\+/g, ' ')
    let destinoEnd = destino.replace(/\+/g, ' ')


    const resultCru = await buscarLinhas(origemEnd, destinoEnd);
    
    const onibus = {}
    for(var i = 0; i < resultCru.length; i++){
        onibus[i] = {
            linha: resultCru[i].numero,
            tarifa: resultCru[i].faixaTarifaria.tarifa
        }
    }

    res.status(200).json({ 
        origem: origemEnd,
        destino: destinoEnd,
        onibus
    });
}

function calcularDistancia(coord1, coord2) {
    const deltaX = coord1[0] - coord2[0];
    const deltaY = coord1[1] - coord2[1];
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

function encontrarCoordenadaMaisProxima(coordenadaUsuario, coordenadas) {
    let coordenadaMaisProxima = coordenadas[0];
    let menorDistancia = calcularDistancia(coordenadaUsuario, coordenadaMaisProxima.coordenadas);

    for (let i = 1; i < coordenadas.length; i++) {
        const distanciaAtual = calcularDistancia(coordenadaUsuario, coordenadas[i].coordenadas);
        if (distanciaAtual < menorDistancia) {
            menorDistancia = distanciaAtual;
            coordenadaMaisProxima = coordenadas[i];
        }
    }

    return coordenadaMaisProxima['codigo'];
}

async function enderecoParaCoordenadas(endereco) {
    const resposta = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
            q: endereco,
            format: 'json',
        },
    });

    const localizacao = resposta.data[0];
    return [parseFloat(localizacao.lat), parseFloat(localizacao.lon)];
}

async function buscarLinhas(origem, destino){
    let origemCod = await enderecoParaCoordenadas(origem)
    let destinoCod = await enderecoParaCoordenadas(destino)

    const origemParad = await encontrarCoordenadaMaisProxima(origemCod, objetoJSON)
    const destinoParad = await encontrarCoordenadaMaisProxima(destinoCod, objetoJSON)
    const resultNoJson = await fetch(apiUrl + 'paradacod/' + origemParad + '/paradacod/' + destinoParad)
    const result = await resultNoJson.json()
    return result
    
}

export default main;
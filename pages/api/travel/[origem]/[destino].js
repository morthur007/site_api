const axios = require('axios');
const fs = require('fs');
const path = require('path');

var apiUrl = 'https://www.sistemas.dftrans.df.gov.br/';

async function main(req, res) {
  try {
    let { origem, destino } = req.query;
    let origemEnd = origem.replace(/\+/g, ' ');
    let destinoEnd = destino.replace(/\+/g, ' ');

    let linhas = await linhasfun(origemEnd, destinoEnd);
    let fimOrigem = linhas[0];
    let fimDestino = linhas[1];
    linhas = linhas[2];

    const coordenadasPromises = linhas.map(async (linha) => {
        let numero = linha.linha
        let sentido = linha.sentido
        const coordenadas = await gps(numero);
        //teste
        return {
        linha: numero,
        sentido: sentido,
        coordenadas: coordenadas
      };
    });
    const coordenadasResult = await Promise.all(coordenadasPromises);

    const coordenadasFiltradas = coordenadasResult.filter(item => item.coordenadas !== null);

    res.json([fimOrigem, fimDestino, coordenadasFiltradas]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro Interno do Servidor');
  }
}

async function linhasfun(origemEnd, destinoEnd){
    // Carrega o arquivo JSON
    const caminhoArquivoJSON = path.join(__dirname, '..', '..', 'Json', 'paradas', 'paradas.json');
    const objetoJSON = JSON.parse(fs.readFileSync(caminhoArquivoJSON, 'utf8'));

    let resultCru = await buscarLinhas(origemEnd, destinoEnd, objetoJSON);
    const origem = resultCru[0];
    const destino = resultCru[1];
    resultCru = resultCru[2];
    
    const onibus = []
    for(var i = 0; i < resultCru.length; i++){
        let numero = resultCru[i].numero;
        let sentido = resultCru[i].sentido;
        onibus.push({linha: numero, sentido: sentido});
    }

    return [origem, destino, onibus];
}

async function buscarLinhas(origem, destino, objetoJSON){
    let origemCod = await enderecoParaCoordenadas(origem)
    let destinoCod = await enderecoParaCoordenadas(destino)

    let origemParad = encontrarCoordenadaMaisProxima(origemCod, objetoJSON)
    let destinoParad = encontrarCoordenadaMaisProxima(destinoCod, objetoJSON)
    const resultNoJson = await axios.get(apiUrl + 'linha/' + 'paradacod/' + origemParad[0] + '/paradacod/' + destinoParad[0]);
    const result = resultNoJson.data;
    return [origemParad[1], destinoParad[1], result];
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

    return [coordenadaMaisProxima['codigo'], coordenadaMaisProxima['coordenadas']];
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

async function gps(numero) {
    const resultNoJson = await axios.get(`${apiUrl}gps/linha/${numero}/geo/recent`);
    const result = resultNoJson.data;
    let linhas = result.features;

    if (Object.keys(linhas).length !== 0) {
        let onibus = [];

        for (let i = 0; i < Object.keys(linhas).length; i++) {
            const todosOsOnibus = await axios.get(apiUrl + "/service/gps/operacoes");
            const todosOsOnibusJson = todosOsOnibus.data;
            let veiculos = [];

            for (let j = 0; j < todosOsOnibusJson.length; j++) {
                if (todosOsOnibusJson[j].operadora.nome == linhas[i].properties.operadora) {
                    veiculos = todosOsOnibusJson[j].veiculos;
                    break;
                }
            }

            let sentido;
            for (let k = 0; k < veiculos.length; k++) {
                if (veiculos[k].numero == linhas[i].properties.numero) {
                    sentido = veiculos[k].sentido;
                    break;
                }
            }

            const formt = {
                id: linhas[i].properties.numero,
                sentido: sentido,
                latitude: linhas[i].geometry.coordinates[1],
                longitude: linhas[i].geometry.coordinates[0]
            };

            onibus.push(formt);
        }

        return onibus;
    } else {
        return null;
    }
}

export default main;

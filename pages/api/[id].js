import fetch from 'node-fetch';

async function pesquisabylinha(request, response) {
    try {
        console.log('teste1');
        const linhaApi = await fetch(`https://www.sistemas.dftrans.df.gov.br/linha/numero/${request.query.id}`);

        if (!linhaApi.ok) {
            throw new Error(`Failed to fetch data. Status: ${linhaApi.status}`);
        }

        const linhaApiJson = await linhaApi.json();
        console.log('teste2');
        console.log(linhaApiJson);

        response.json({
            linha: linhaApiJson[0].numero,
            tarifa: linhaApiJson[0].faixaTarifaria.tarifa,
            rota: linhaApiJson[0].descricao,
        });
    } catch (error) {
        console.error('Error:', error.message);
        response.status(500).json({ error: 'Internal Server Error' });
    }
}

export default pesquisabylinha;

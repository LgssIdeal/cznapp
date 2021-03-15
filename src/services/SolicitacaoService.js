import axios from 'axios';

const instance = axios.create( {
  baseURL : process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type' : 'application/json'
  }
});

export default {
  getSolicitacoes: (contratoId, unidadeId, clinicaId, refeicao, dataReferencia, page, size) => 
    instance({
      'method' : 'GET',
      'url' : '/solicitacoes', 
      'params' : {
        'contratoId': contratoId,
        'unidadeId': unidadeId,
        'clinicaId': clinicaId,
        'refeicao': refeicao,
        'dataReferencia': dataReferencia,
        'pageNumber' : page,
        'pageSize' : size
      },
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  criaSolicitacao: (data) =>
    instance({
      'method': 'POST',
      'url': '/solicitacoes',
      'data': data,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  getItens: (solicitacaoId) =>
    instance({
      'method': 'GET',
      'url': '/solicitacaoitens/solicitacao/' + solicitacaoId,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  getItensResumo: (solicitacaoId) =>
    instance({
      'method': 'GET',
      'url': '/solicitacaoitens/solicitacao/' + solicitacaoId + '/resumo',
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    })
}
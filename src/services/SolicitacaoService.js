import axios from 'axios';

const instance = axios.create( {
  baseURL : process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type' : 'application/json'
  }
});

export default {
  getSolicitacoes: (contratoId, unidadeId, clinicaId, dataReferencia, page, size) => 
    instance({
      'method' : 'GET',
      'url' : '/solicitacoes', 
      'params' : {
        'contratoId': contratoId,
        'unidadeId': unidadeId,
        'clinicaId': clinicaId,
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
  getItensPdf: (solicitacaoId) =>
    instance({
      'method': 'GET',
      'url': '/solicitacaoitens/solicitacao/' + solicitacaoId + "/pdf",
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
    }),
  getItensResumoPdf: (solicitacaoId) =>
    instance( {
      'method': 'GET',
      'url': '/solicitacaoitens/solicitacao/' + solicitacaoId + '/resumo/pdf',
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  getRefeicoesDisponiveis: (dataReferencia) =>
    instance({
      'method': 'GET',
      'url': '/solicitacoes/refeicoesdisponiveis/' + dataReferencia,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  getSolicitacaoItem: (solicitacaoItemId) =>
    instance({
      'method': 'GET',
      'url': '/solicitacaoitens/' + solicitacaoItemId,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  getSolicitacao: (solicitacaoId) => 
    instance({
      'method': 'GET',
      'url': '/solicitacoes/' + solicitacaoId,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  gravaItem: (data) =>
    instance({
      'method': 'POST',
      'url': '/solicitacaoitens',
      'data': data,
      'headers' : {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    })
}
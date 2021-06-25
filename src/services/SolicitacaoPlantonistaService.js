import axios from 'axios';

const instance = axios.create( {
  baseURL : process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type' : 'application/json'
  }
});

export default {
  getSolicitacoes: (contratoId, unidadeId, dataReferencia, page, size) => 
    instance({
      'method' : 'GET',
      'url' : '/solicitacoesplantonista', 
      'params' : {
        'contratoId' : contratoId,
        'unidadeId' : unidadeId,
        'dataReferencia' : dataReferencia,
        'page' : page,
        'size' : size
      },
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      },
    }),
  getSolicitacoesList: () => 
    instance({
      'method' : 'GET',
      'url' : '/solicitacoesplantonista',
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      },
    }),
  getSolicitacao: (solicitacaoId) =>
    instance({
      'method' : 'GET',
      'url' : '/solicitacoesplantonista/' + solicitacaoId,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  deleteSolicitacao: (solicitacaoId) =>
    instance({
      'method' : 'DELETE',
      'url' : '/solicitacoesplantonista/' + solicitacaoId,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  criaSolicitacao: (data) =>
    instance({
      'method' : 'POST',
      'url' : '/solicitacoesplantonista',
      'data' : data,
      'headers' : {
        'Content-Type' : 'application/json',
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  getPdf: (solicitacaoId) =>
    instance( {
      'method': 'GET',
      'url': '/solicitacoesplantonista/' + solicitacaoId + '/pdf',
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  getSolicitacaoItens: (solicitacaoId) =>
    instance( {
      'method': 'GET',
      'url': '/solicitacoesplantonista/itens/' + solicitacaoId,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
}
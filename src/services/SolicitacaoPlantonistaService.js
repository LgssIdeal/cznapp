import axios from 'axios';

const instance = axios.create( {
  baseURL : process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type' : 'application/json'
  }
});

export default {
  getSolicitacoes: (page, size) => 
    instance({
      'method' : 'GET',
      'url' : '/solicitacoesplantonista', 
      'params' : {
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
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    })
}
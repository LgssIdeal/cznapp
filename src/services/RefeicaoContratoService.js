import axios from 'axios';

const instance = axios.create( {
  baseURL : process.env.REACT_APP_API_URL,
});

export default {
  getRefeicoesContrato: (contratoId) => 
    instance({
      'method' : 'GET',
      'url' : '/refeicoescontrato/contrato/' + contratoId, 
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      },
    }),
  getRefeicaoContratoPorRefeicao: (contratoId, refeicao) =>
    instance({
      'method' : 'GET',
      'url' : '/refeicoescontrato/' + contratoId + "/" + refeicao,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  getRefeicaoContratoPorId: (refeicaoContratoId) =>
    instance({
      'method' : 'GET',
      'url' : '/refeicoescontrato/' + refeicaoContratoId,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  deleteRefeicaoContrato: (refeicaoContratoId) =>
    instance({
      'method' : 'DELETE',
      'url' : '/refeicoescontrato/' + refeicaoContratoId,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  gravaRefeicaoContrato: (data) =>
    instance({
      'method' : 'POST',
      'url' : '/refeicoescontrato',
      'data' : data,
      'headers' : {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    })
}
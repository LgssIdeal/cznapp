import axios from 'axios';

const instance = axios.create( {
  baseURL : process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type' : 'application/json'
  }
});

export default {
  getPeriodos: () =>
    instance({
      'method': 'GET',
      'url' : '/periodos',
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  geraRelatorioFaturamento: (periodo, contratoId) =>
    instance({
      'method': 'GET',
      'url': '/faturamento/' + contratoId + "/ "+ periodo + "/relatorio",
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    })
}
import axios from 'axios';

const instance = axios.create( {
  baseURL : process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type' : 'application/json'
  }
});

export default {
  getCautelas: (page, size) => 
    instance({
      'method' : 'GET',
      'url' : '/cautelas', 
      'params' : {
        'page' : page,
        'size' : size
      },
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      },
    }),
  getCautela: (cautelaId) =>
    instance({
      'method': 'GET',
      'url': '/cautelas/' + cautelaId,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  getItens: (cautelaId) =>
    instance({
      'method': 'GET',
      'url': '/cautelas/' + cautelaId + "/itens",
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  criaCautela: (data) =>
    instance({
      'method': 'POST',
      'url': '/cautelas',
      'data': data,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  setEntregue: (cautelaId, usuarioId) =>
    instance({
      'method': 'PUT',
      'url': '/cautelas/' + cautelaId + '/' + usuarioId + '/entregue',
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
    setCancelada: (cautelaId, usuarioId) =>
      instance({
        'method': 'PUT',
        'url': '/cautelas/' + cautelaId + '/' + usuarioId + '/cancela',
        'headers' : {
          'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
        }
      })  
}
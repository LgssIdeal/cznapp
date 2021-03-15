import axios from 'axios';

const instance = axios.create( {
  baseURL : process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type' : 'application/json'
  }
});

export default {
  getUnidades: (page, size, idCliente) => 
    instance({
      'method' : 'GET',
      'url' : '/unidades/cliente/' + idCliente, 
      'params' : {
        'page' : page,
        'size' : size
      },
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
    getUnidadesList: (clienteId) => 
    instance({
      'method' : 'GET',
      'url' : '/unidades/cliente/' + clienteId + "/lista", 
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  getUnidade: (unidadeId) =>
    instance({
      'method' : 'GET',
      'url' : '/unidades/' + unidadeId,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  deleteUnidade: (unidadeId) =>
    instance({
      'method' : 'DELETE',
      'url' : '/unidades/' + unidadeId,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  criaUnidade: (data, clienteId) =>
    instance({
      'method' : 'POST',
      'url' : '/unidades/cliente/' + clienteId,
      'data' : data,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    })
}
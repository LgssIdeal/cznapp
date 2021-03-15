import axios from 'axios';

const instance = axios.create( {
  baseURL : process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type' : 'application/json'
  }
});

export default {
  getClientes: (page, size) => 
    instance({
      'method' : 'GET',
      'url' : '/clientes', 
      'params' : {
        'page' : page,
        'size' : size
      },
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      },
    }),
    getClientesList: () => 
    instance({
      'method' : 'GET',
      'url' : '/clientes',
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      },
    }),
  getCliente: (clienteId) =>
    instance({
      'method' : 'GET',
      'url' : '/clientes/' + clienteId,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  deleteCliente: (idCliente) =>
    instance({
      'method' : 'DELETE',
      'url' : '/clientes/' + idCliente,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  criaCliente: (data) =>
    instance({
      'method' : 'POST',
      'url' : '/clientes',
      'data' : data,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  alteraCliente: (data) =>
    instance({
      'method' : 'PUT',
      'url' : '/clientes',
      'data' : data,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    })
}
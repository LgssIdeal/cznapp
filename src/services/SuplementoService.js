import axios from 'axios';

const instance = axios.create( {
  baseURL : process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type' : 'application/json'
  }
});

export default {
  getSuplementos: (page, size) => 
    instance({
      'method' : 'GET',
      'url' : '/suplementos', 
      'params' : {
        'page' : page,
        'size' : size
      },
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      },
    }),
  getSuplementosList: () => 
    instance({
      'method' : 'GET',
      'url' : '/suplementos',
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      },
    }),
  getSuplemento: (suplementoId) =>
    instance({
      'method' : 'GET',
      'url' : '/suplementos/' + suplementoId,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  deleteSuplemento: (suplementoId) =>
    instance({
      'method' : 'DELETE',
      'url' : '/suplementos/' + suplementoId,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  criaSuplemento: (data) =>
    instance({
      'method' : 'POST',
      'url' : '/suplementos',
      'data' : data,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    })
}
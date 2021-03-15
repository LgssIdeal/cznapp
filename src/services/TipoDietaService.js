import axios from 'axios';

const instance = axios.create( {
  baseURL : process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type' : 'application/json'
  }
});

export default {
  getTiposDieta: (page, size) => 
    instance({
      'method' : 'GET',
      'url' : '/tiposdieta', 
      'params' : {
        'page' : page,
        'size' : size
      },
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  getTipoDieta: (tipoDietaId) =>
    instance({
      'method' : 'GET',
      'url' : '/tiposdieta/' + tipoDietaId,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  deleteTipoDieta: (tipoDietaId) =>
    instance({
      'method' : 'DELETE',
      'url' : '/tiposdieta/' + tipoDietaId,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  criaTipoDieta: (data) =>
    instance({
      'method' : 'POST',
      'url' : '/tiposdieta',
      'data' : data,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  alteraTipoDieta: (data) =>
    instance({
      'method' : 'PUT',
      'url' : '/tiposdieta',
      'data' : data,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
    getTiposDietaList: () => 
    instance({
      'method' : 'GET',
      'url' : '/tiposdieta', 
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    })
}
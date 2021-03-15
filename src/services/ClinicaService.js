import axios from 'axios';

const instance = axios.create( {
  baseURL : process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type' : 'application/json'
  }
});

export default {
  getClinicas: (page, size, unidadeId) => 
    instance({
      'method' : 'GET',
      'url' : '/clinicas/unidade/' + unidadeId, 
      'params' : {
        'page' : page,
        'size' : size
      },
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
    getClinicasList: (unidadeId) => 
    instance({
      'method' : 'GET',
      'url' : '/clinicas/unidade/' + unidadeId + "/lista", 
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  getClinica: (clinicaId) =>
    instance({
      'method' : 'GET',
      'url' : '/clinicas/' + clinicaId,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  deleteClinica: (clinicaId) =>
    instance({
      'method' : 'DELETE',
      'url' : '/clinicas/' + clinicaId,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  criaClinica: (data, unidadeId) =>
    instance({
      'method' : 'POST',
      'url' : '/clinicas/unidade/' + unidadeId,
      'data' : data,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    })
}
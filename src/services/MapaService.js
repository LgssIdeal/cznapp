import axios from 'axios';

const instance = axios.create( {
  baseURL : process.env.REACT_APP_API_URL,
});

export default {
  getMapas: (page, size, clinicaId) => 
    instance({
      'method' : 'GET',
      'url' : '/mapas/clinica/' + clinicaId, 
      'params' : {
        'page' : page,
        'size' : size
      },
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      },
    }),
  getMapa: (mapaId) =>
    instance({
      'method' : 'GET',
      'url' : '/mapas/' + mapaId,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  deleteMapa: (mapaId) =>
    instance({
      'method' : 'DELETE',
      'url' : '/mapas/' + mapaId,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  criaMapa: (data) =>
    instance({
      'method' : 'POST',
      'url' : '/mapas',
      'data' : data,
      'headers' : {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : ''),
        
      }
    }),
  alteraContrato: (data) =>
    instance({
      'method' : 'PUT',
      'url' : '/mapas',
      'data' : data,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    })
}
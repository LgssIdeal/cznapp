import axios from 'axios';

const instance = axios.create( {
  baseURL : process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type' : 'application/json'
  }
});

export default {
  getTiposDietaComplementar: (page, size, tipoDietaId) => 
    instance({
      'method' : 'GET',
      'url' : '/tiposdietacomplementar/tipodieta/' + tipoDietaId, 
      'params' : {
        'page' : page,
        'size' : size
      },
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  getTiposDietaComplementarList: (tipoDietaId) => 
    instance({
      'method' : 'GET',
      'url' : '/tiposdietacomplementar/tipodieta/' + tipoDietaId + "/lista",
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  getTipoDietaComplementar: (tipoDietaComplementarId) =>
    instance({
      'method' : 'GET',
      'url' : '/tiposdietacomplementar/' + tipoDietaComplementarId,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  deleteTipoDietaComplementar: (tipoDietaComplementarId) =>
    instance({
      'method' : 'DELETE',
      'url' : '/tiposdietacomplementar/' + tipoDietaComplementarId,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  criaTipoDietaComplementar: (data, tipoDietaComplementarId) =>
    instance({
      'method' : 'POST',
      'url' : '/tiposdietacomplementar/tipodieta/' + tipoDietaComplementarId,
      'data' : data,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    })
}
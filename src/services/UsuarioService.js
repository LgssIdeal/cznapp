import axios from 'axios';

const instance = axios.create( {
  baseURL : process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type' : 'application/json'
  }
});

export default {
  getUsuarios: (page, size) => 
    instance({
      'method' : 'GET',
      'url' : '/usuarios', 
      'params' : {
        'page' : page,
        'size' : size
      },
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
  }),
  deleteUsuario: (idUsuario) =>
    instance({
      'method' : 'DELETE',
      'url' : '/usuarios/' + idUsuario,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    })
}
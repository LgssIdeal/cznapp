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
    }),
  alteraSenha: (data, usuarioId) =>
    instance({
      'method': 'POST',
      'url': '/usuarios/altsenha/' + usuarioId,
      'data': data,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : ''),
        'Content-Type' : 'application/x-www-form-urlencoded'
      }
    }),
  resetaSenha: (usuarioId) =>
    instance({
      'method': 'POST',
      'url': '/usuarios/reset/' + usuarioId,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : ''),
      }
    })
}
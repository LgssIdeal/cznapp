import axios from 'axios';

const instance = axios.create( {
  baseURL : process.env.REACT_APP_API_URL,
});

export default {
  getContratos: (page, size) => 
    instance({
      'method' : 'GET',
      'url' : '/contratos', 
      'params' : {
        'page' : page,
        'size' : size
      },
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      },
    }),
  getContratosList: () =>
    instance({
      'method' : 'GET',
      'url' : '/contratos',
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      },
    }),
  getContrato: (contratoId) =>
    instance({
      'method' : 'GET',
      'url' : '/contratos/' + contratoId,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  deleteContrato: (contratoId) =>
    instance({
      'method' : 'DELETE',
      'url' : '/contratos/' + contratoId,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  criaContrato: (data) =>
    instance({
      'method' : 'POST',
      'url' : '/contratos',
      'data' : data,
      'headers' : {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : ''),
        
      }
    }),
  alteraContrato: (data) =>
    instance({
      'method' : 'PUT',
      'url' : '/contratos',
      'data' : data,
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  adicionaUnidade: (unidadeId, contratoId) =>
    instance({
      'method': 'POST',
      'url': '/contratos/unidades',
      'params': {
        'unidadeId': unidadeId,
        'contratoId': contratoId
      },
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  removeUnidade: (unidadeId, contratoId) =>
    instance({
      'method': 'DELETE',
      'url': '/contratos/unidades',
      'params': {
        'unidadeId': unidadeId,
        'contratoId': contratoId
      },
      'headers' : {
        'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
      }
    }),
  getUnidades: (contratoId) =>
      instance({
        'method': 'GET',
        'url': '/contratos/' + contratoId + '/unidades',
        'headers' : {
          'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
        }
      }),
  getRefeicoesAcompanhante: (contratoId) =>
      instance({
        'method': 'GET',
        'url': '/refeicoescontratoacompanhante/' + contratoId,
        'headers' : {
          'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
        }
      }),
  addRefeicaoContratoAcompanhante: (contratoId, refeicao) =>
      instance({
        'method': 'POST',
        'url': '/refeicoescontratoacompanhante/' + contratoId + '/' + refeicao,
        'headers' : {
          'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
        }
      }),
  excluiRefeicaoAcompanhante: (refeicaoId) =>
      instance({
        'method': 'DELETE',
        'url': '/refeicoescontratoacompanhante/'+refeicaoId,
        'headers' : {
          'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
        }
      }),
  getRefeicoesPlantonista: (contratoId) =>
      instance({
        'method': 'GET',
        'url': '/refeicoescontratoplantonista/' + contratoId,
        'headers' : {
          'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
        }
      }),
  addRefeicaoContratoPlantonista: (contratoId, refeicao) =>
      instance({
        'method': 'POST',
        'url': '/refeicoescontratoplantonista/' + contratoId + '/' + refeicao,
        'headers' : {
          'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
        }
      }),
  excluiRefeicaoPlantonista: (refeicaoId) =>
      instance({
        'method': 'DELETE',
        'url': '/refeicoescontratoplantonista/'+refeicaoId,
        'headers' : {
          'Authorization' : 'Bearer ' + (localStorage.getItem("@app-user") !== null ? JSON.parse(localStorage.getItem("@app-user")).jwtToken : '')
        }
      })
}
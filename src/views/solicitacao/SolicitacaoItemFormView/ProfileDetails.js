import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles,
  LinearProgress,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  FormLabel
} from '@material-ui/core';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {Alert} from '@material-ui/lab';
import MapaService from '../../../services/MapaService';
import SolicitacaoService from '../../../services/SolicitacaoService';
import TipoDietaService from '../../../services/TipoDietaService';
import TipoDietaComplementarService from '../../../services/TipoDietaComplementarService';
import moment from 'moment';
import data from '../../product/ProductListView/data';

const listIdentificacao = [
  {
    id: 'RG',
    label: 'RG'
  },
  {
    id: 'CPF',
    label: 'CPF'
  },
  {
    id: 'CARTAO_SUS',
    label: 'Nro. cartão SUS'
  }
];


const useStyles = makeStyles(() => ({
  root: {}
}));

const ProfileDetails = ({ className, contratoId, unidadeId, clinicaId, dataReferencia, solicitacaoId, solicitacaoItemId, ...rest }) => {

  const navigate = useNavigate();
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("")
  const [tiposDieta, setTiposDieta] = useState([]);
  const [tiposDietaComp, setTiposDietaComp] = useState([]);
  const [solicitacao, setSolicitacao] = useState();
  const [invalidToken, setInvalidToken] = useState(true);
  const [mapaSel, setMapaSel] = useState({
    id: 0,
    clinica: clinicaId,
    leito: '',
    paciente: '',
    dataNascimento: '',
    tipoIdenticacao: '',
    identificacao: '',
    tipoDieta: 0,
    tiposDietaComplementar: [],
    dieta: '',
    observacoes: ''
  });

  const [solicitacaoItemSel, setSolicitacaoItemSel] = useState({
    id: 0,
    dataReferencia: '',
    dataCriacao: '',
    refeicao: '',
    valor: 0.0,
    paciente: '',
    tipoIdentificacao: '',
    identificacao: '',
    leito: '',
    tipoDieta: 0,
    tiposDietaComplementar: [],
    observacoes: '',
    mapaId: 0
  });

  const userId = JSON.parse(localStorage.getItem("@app-user")).id;
  //const [values, setValues] = useState();
  
  const [values, setValues] = useState({
    id: 0,
    dataReferencia: '',
    dataCriacao: '',
    refeicao: '',
    valor: 0.0,
    paciente: '',
    tipoIdentificacao: '',
    identificacao: '',
    leito: '',
    tipoDieta: 0,
    tiposDietaComplementar: [],
    observacoes: '',
    mapaId: 0
  });

  /* Utilizado para os checkbox dinâmicos para seleção das dietas complementares
    {
      id: id do tipo de dieta complementar
      descricao: descrição do tipo de dieta complementar
      sigla: sigla do tipo de dieta complementar
      selecionado: atributo que indica se o valor está selecionado ou não (true ou false)
    }
    Será atualizado no effect disparado quando carregados os tipos de dieta complementares da dieta selecionada
   */
  const [tpsComp, setTpsComp] = useState([]);

  /**********************************************/
  /*           Effects and functions            */
  /**********************************************/

  useEffect(() => {
    setLoading(true);
    SolicitacaoService.getSolicitacaoItem(solicitacaoItemId)
      .then((result) => {
        setSolicitacaoItemSel(result.data);
      })
      .catch((error) => {
        if(error.response) {
          setError(error.reponse.data.detail);
        } else {
          var e = JSON.stringify(error);
          if(e.includes("401")) {
            setInvalidToken(true);
          } else {
            setError(e);
          }
        }
      })
      .finally(() => setLoading(false));
  },[solicitacaoItemId])

  useEffect(() => {
    setLoading(true);
    SolicitacaoService.getSolicitacao(solicitacaoId)
      .then((result) => {
        setSolicitacao(result.data);
      })
      .catch((error) => {
        if(error.response) {
          setError(error.reponse.data.detail);
        } else {
          var e = JSON.stringify(error);
          if(e.includes("401")) {
            setInvalidToken(true);
          } else {
            setError(e);
          }
        }
      })
      .finally(() => setLoading(false));
  },[solicitacaoId])

  useEffect(() => {
    setLoading(true);

    var dataNasc = moment(solicitacaoItemSel.dataNascimento).format("YYYY-MM-DD");
    
    setValues({
      id: solicitacaoItemSel.id,
      dataNascimento: dataNasc,
      dataReferencia: solicitacaoItemSel.dataReferencia,
      dataCriacao: solicitacaoItemSel.dataCriacao,
      refeicao: solicitacaoItemSel.refeicao,
      valor: solicitacaoItemSel.valor,
      paciente: solicitacaoItemSel.paciente,
      tipoIdentificacao: solicitacaoItemSel.tipoIdentificacao,
      identificacao: solicitacaoItemSel.identificacao,
      leito: solicitacaoItemSel.leito,
      tipoDieta: solicitacaoItemSel.tipoDieta.id,
      tiposDietaComplementar: solicitacaoItemSel.tiposDietaComplementar.length > 0 ? solicitacaoItemSel.tipoDietaComplementar : [],
      observacoes: solicitacaoItemSel.observacoes,
      mapaId: solicitacaoItemSel.mapaId
    });

    TipoDietaService.getTiposDietaList()
      .then((result) => {
        setLoading(false);
        setTiposDieta(result.data);
      })
      .catch((error) => {
        if(error.response.data) {
          setError(error.response.data.detail);
        } else {
          if(JSON.stringify(error).includes("401")) {
            navigate("/", {});
          } else {
            setError(JSON.stringify(error));
          }
        }
      });
    
  }, [solicitacaoItemSel]);

  useEffect(() => {
    if(values.tipoDieta) {
      setLoading(true);
      TipoDietaComplementarService.getTiposDietaComplementarList(values.tipoDieta)
        .then((result) => {
          setLoading(false);
          setTiposDietaComp(result.data);
        })
        .catch((error) => {
          setLoading(false);
          
          if(error.response) {
            if(error.response.data.status !== 404 && error.response.data.status !== 400) {
              setError(error.response.data.detail);
            }
          } else {
            var e = JSON.stringify(error);
            if(e.includes("401")) {
              navigate("/", {});
            } else {
              if(e.includes("404")) {
                setTiposDietaComp([]);
              } else {
                setError(JSON.stringify(error));
              }
              
            }
          }
        });
    } else {
      setTiposDietaComp([]);
    }
    setTpsComp([]);
    
  }, [values.tipoDieta]);

  /* Effect para carregamento dos tipos de dieta complementares e indicação de quais estão selecionados */
  useEffect(() => {
    if(tiposDietaComp) {
      if(mapaSel.tiposDietaComplementar) {
        for(var i = 0; i < tiposDietaComp.length; i++) {
          var achou = false;
          

          if(mapaSel.tiposDietaComplementar.find(element => element.id === tiposDietaComp[i].id)) {
            achou = true;
          }
          
          const value = {
            id: tiposDietaComp[i].id,
            descricao: tiposDietaComp[i].descricao,
            sigla: tiposDietaComp[i].sigla,
            selecionado : achou
          }

          setTpsComp(old => [...old, value]);
        }
      }
    }
  }, [tiposDietaComp]);

  const handleTipoDietaChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
      tipoDietaComplementar: 0
    });
  };

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleCheckTpDietaComplementar = (event) => {
    
    let tipos = [...tpsComp];
    for(var i = 0; i < tipos.length; i++) {
      if(tipos[i].id === parseInt(event.target.id)) {
        tipos[i].selecionado = event.target.checked;
      }
    }
    setTpsComp(tipos);
  }


  const handleGoBack = (() => {
    navigate('/app/solicitacoes/' + contratoId + '/' + unidadeId + '/' + clinicaId + '/' + dataReferencia + '/' + solicitacaoId, {replace : true});
  });

  const handleSubmit = ( () => {
    
    
    setLoading(true);

    let tpCompSel = [];
    let aux = [...tpsComp];

    for(var i = 0; i < aux.length; i++) {
      if(aux[i].selecionado) {
        tpCompSel.push(aux[i].id);
      }
    }

    const params = new URLSearchParams();
    
    params.append('id', values.id);
		params.append('solicitacaoId', solicitacaoId);
		params.append('referencia', dataReferencia);
		params.append('leito', values.leito);
		params.append('paciente', values.paciente);
		params.append('dataNascimento', values.dataNascimento);
		params.append('tipoIdentificacao', values.tipoIdentificacao);
		params.append('identificacao', values.identificacao);
		params.append('refeicao', solicitacao.refeicao);
		params.append('tipoDieta', values.tipoDieta);
		params.append('tiposDietaComplementar', tpCompSel);
		params.append('observacoes', values.observacoes);
		params.append('mapaId', solicitacaoItemSel.mapaId === null ? 0 : solicitacaoItemSel.mapaId);
		params.append('clinicaId', clinicaId);
		params.append('usuarioId', userId);
    

    
    SolicitacaoService.gravaItem(params)
      .then(() => {
        alert("Solicitação gravada com sucesso");
        navigate('/app/solicitacoes/' + contratoId + '/' + unidadeId + '/' + clinicaId + '/' + dataReferencia + '/' + solicitacaoId, {replace : true});
      })
      .catch((error) => {

        if(error.response.data) {
          setError(error.response.data.detail);
        } else {

          var e = JSON.stringify(error);
          if(e.includes("401")) {
            navigate("/", {});
          } else {            
            setError(e);            
          }
        }
      })
      .finally(() => setLoading(false));
    
  });

  return (
    <form
      autoComplete="off"
      noValidate
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Card>
        <CardHeader
          subheader="Informe os dados e clique no botão salvar."
          title="Alteração do mapa de pacientes"
        />
        {error && 
          <Alert severity="error">{error}</Alert>}
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
            
          >
            <Grid
              item
              md={3}
              xs={3}
            >
              <TextField
                fullWidth
                helperText="Informe o leito"
                label="Leito"
                name="leito"
                onChange={handleChange}
                required
                value={values.leito}
                variant="outlined"
              >
              </TextField>
            </Grid>
            <Grid
              item
              md={9}
              xs={9}
            >
              <TextField type="hidden" name="id" value={values.id}></TextField>
              <TextField type="hidden" name="clinica" value={values.clinica}></TextField>
              <TextField
                fullWidth
                helperText="Informe o nome do paciente"
                label="Paciente"
                name="paciente"
                onChange={handleChange}
                required
                value={values.paciente}
                variant="outlined"
              >
              </TextField>
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              
              <TextField
                fullWidth
                
                name="dataNascimento"
                helperText="Informe a data de nascimento"
                onChange={handleChange}
                required
                value={values.dataNascimento}
                variant="outlined"
                type="date"
              >
              </TextField>  
            </Grid>
            <Grid
              item
              md={6}
              xs={6}
            >
              <TextField
                fullWidth
                label="Informe o tipo de identificação"
                name="tipoIdentificacao"
                onChange={handleChange}
                required
                select
                SelectProps={{ native: true }}
                value={values.tipoIdentificacao}
                variant="outlined"
              >
                <option value={0}></option>
                {listIdentificacao.map((option) => (
                  <option
                    key={option.id}
                    value={option.id}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid
              item
              md={6}
              xs={6}
            >
              <TextField
                fullWidth
                label="Identificação"
                name="identificacao"
                required
                helperText="Informe a identificação"
                onChange={handleChange}
                value={values.identificacao}
                variant="outlined"
              ></TextField>
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                fullWidth
                label="Tipo de dieta"
                name="tipoDieta"
                required
                helperText="Informe o tipo de dieta"
                onChange={handleTipoDietaChange}
                value={values.tipoDieta}
                variant="outlined"
                select
                SelectProps={{ native: true }}
              >
                <option value={0}></option>
                {
                  tiposDieta.map((option) =>(
                    <option key={option.id} value={option.id}>{option.sigla}</option>
                  ))
                }
              </TextField>
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              
            <FormControl component="fieldset" variant="standard">
              <FormLabel component="legend" >Complementação de dieta</FormLabel>
              <FormGroup row>
              {
                tpsComp.map((option) =>(
                  <FormControlLabel
                    control={<Checkbox
                                color="primary"
                                key={option.id}
                                id={option.id}
                                name={"selecionado"}
                                checked={option.selecionado} 
                                onChange={handleCheckTpDietaComplementar}/>}
                    label={option.sigla} />
                ))
              }

              </FormGroup>
            </FormControl>
            
            </Grid>
            
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                fullWidth
                label="Observações"
                name="observacoes"
                helperText="Observações"
                onChange={handleChange}
                value={values.observacoes}
                variant="outlined"
              ></TextField>
            </Grid>
            
          </Grid>
        </CardContent>
        <Divider />
      <Grid container spacing={3}>
        <Grid
              item
              md={6}
              xs={6}
            >
            <Button
              fullWidth
              color="primary"
              variant="contained"
              onClick={handleSubmit}
            >
              Gravar
            </Button>
        </Grid>
        <Grid item md={6} xs={6}>
            <Button
              fullWidth
              onClick={handleGoBack}
              variant="contained"
            >
              Cancelar
            </Button>
        </Grid>
      </Grid>
        {loading && 
          <LinearProgress></LinearProgress>}
      </Card>
    </form>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string
};

export default ProfileDetails;

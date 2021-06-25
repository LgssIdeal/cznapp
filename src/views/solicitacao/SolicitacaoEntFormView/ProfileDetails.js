import React, { useEffect, useState } from 'react';
import {useCookies} from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles,
  LinearProgress
} from '@material-ui/core';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {Alert} from '@material-ui/lab';
import ClinicaService from '../../../services/ClinicaService';
import ContratoService from '../../../services/ContratoService';
import refeicoes from '../../../utils/refeicoes';


const useStyles = makeStyles(() => ({
  root: {}
}));

const ProfileDetails = ({ className, ...rest }) => {

  const navigate = useNavigate();
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("")
  const [unidades, setUnidades] = useState([]);
  const [clinicas, setClinicas] = useState([]);
  const [contratos, setContratos] = useState([]);
  const [cookies, setCookie] = useCookies([
    'solicContratoSel', 
    'solicUnidadeSel', 
    'solicClinicaSel',
    'solicRefeicaoSel',
    'solicDataReferencia'
  ])

 
  const [values, setValues] = useState({
    contrato : cookies.solicContratoSel,
    unidade : cookies.solicUnidadeSel,
    clinica : cookies.solicClinicaSel,
    refeicao: cookies.solicRefeicaoSel,
    dataReferencia: cookies.solicDataReferencia
  });

  useEffect(() => {
    setLoading(true);
    ContratoService.getContratosList()
      .then((result) => {
        setLoading(false);
        setContratos(result.data);
      })
      .catch((error) => {
        if(error.response) {
          setLoading(false);
          setError(error.response.data.detail);
        } else {
          var e = JSON.stringify(error);
          if(e.includes("401")) {
            navigate("/", {replace: true});
          } else {
            setError(e);
          }
        }
      });
    
  },[]);

  useEffect(() => {
    if(values.contrato > 0) {
      setLoading(true)
      ContratoService.getUnidades(values.contrato)
        .then((result) =>{
          setLoading(false)
          setUnidades(result.data);
        })
        .catch((error) => {
          setLoading(false);
          if(error.response.data) {
            setError(error.response.data.detail);
          } else {
            setError(JSON.stringify(error));
          }
        });
    }
  },[values.contrato]);

  useEffect(() => {
    if(values.unidade > 0) {
      setLoading(true);
      ClinicaService.getClinicasList(values.unidade)
        .then((result) => {
          setLoading(false);
          setClinicas(result.data);
        })
        .catch((error) => {
          setLoading(false);
          if(error.response.data) {
            setError(error.response.data.detail);
          } else {
            setError(error);
          }
        });
    }
  },[values.unidade]);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };
  
  const handleSubmit = ( () => {
    let expires = (60*60);
    setCookie('solicContratoSel',   values.contrato, {path: '/', maxAge: expires});
    setCookie('solicUnidadeSel',    values.unidade,  {path: '/', maxAge: expires});
    setCookie('solicClinicaSel',    values.clinica,  {path: '/', maxAge: expires});
    setCookie('solicDataReferencia',values.dataReferencia, {path: '/', maxAge: expires});
    navigate('/app/solicitacoes/' + values.contrato + '/' + values.unidade + '/' + values.clinica + '/' + values.dataReferencia, {replace: true});
  });

  const handleSubmitPlantonistas = (() => {
    let expires = (60*60);
    setCookie('solicContratoSel',   values.contrato, {path: '/', maxAge: expires});
    setCookie('solicUnidadeSel',    values.unidade,  {path: '/', maxAge: expires});
    setCookie('solicClinicaSel',    values.clinica,  {path: '/', maxAge: expires});
    setCookie('solicDataReferencia',values.dataReferencia, {path: '/', maxAge: expires});
    navigate('/app/solicitacoesplantonista/' + values.contrato + "/" + values.unidade + "/" + values.dataReferencia, {replace: true});
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
          subheader="Informe os dados e clique em Ok para visualizar."
          title="Solicitações"
        />
        {error && 
          <Alert severity="error">{error}</Alert>}
        <Divider />
        <CardContent>
          <Grid container spacing={2} direction="column">
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                label="Contrato"
                name="contrato"
                required
                
                onChange={handleChange}
                value={values.contrato}
                variant="outlined"
                select
                SelectProps={{ native: true }}
              >
                <option value={0}></option>
                {
                  contratos.map((option) =>(
                    <option key={option.id} value={option.id}>{option.numero}  </option>
                  ))
                }
              </TextField>
            </Grid>
          
            <Grid item md={12} xs={12} >
              <TextField
                fullWidth
                label="Unidade"
                name="unidade"
                required
                
                onChange={handleChange}
                value={values.unidade}
                variant="outlined"
                select
                SelectProps={{ native: true }}
              >
                <option value={0}></option>
                {
                  unidades.map((option) =>(
                    <option key={option.id} value={option.id}>{option.descricao}  </option>
                  ))
                }
              </TextField>
            </Grid>
          
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                label="Clínica"
                name="clinica"
                required
                
                onChange={handleChange}
                value={values.clinica}
                variant="outlined"
                select
                SelectProps={{ native: true }}
              >
                <option value={0}></option>
                {
                  clinicas.map((option) =>(
                    <option key={option.id} value={option.id}>{option.descricao}  </option>
                  ))
                }
              </TextField>
            </Grid>

            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                name="dataReferencia"
                helperText="Data de referência"
                required
                type="date"
                onChange={handleChange}
                value={values.dataReferencia}
                variant="outlined"
              >
              </TextField>
            </Grid>
          </Grid>
          <Grid container spacing={2} direction="row">
            <Grid item md={6} xs={6}>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}>
                Ok
              </Button>
            </Grid>
            <Grid item md={6} xs={6}>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                onClick={handleSubmitPlantonistas}
                disabled={loading}>
                Plantonistas
              </Button>
            </Grid>
          </Grid>
          {loading && 
            <LinearProgress></LinearProgress>}
        </CardContent>
      </Card>
      
    </form>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string
};

export default ProfileDetails;

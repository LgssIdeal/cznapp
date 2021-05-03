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
import ContratoService from '../../../services/ContratoService';
import FaturamentoService from '../../../services/FaturamentoService';
import refeicoes from '../../../utils/refeicoes';


const useStyles = makeStyles(() => ({
  root: {}
}));

const ProfileDetails = ({ className, ...rest }) => {

  const navigate = useNavigate();
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("")
  const [periodos, setPeriodos] = useState([]);
  const [contratos, setContratos] = useState([]);

  const [cookies, setCookie] = useCookies([
    'solicContratoSel', 
    'solicUnidadeSel', 
    'solicClinicaSel',
    'solicRefeicaoSel',
    'solicDataReferencia'
  ])
  
 
  const [values, setValues] = useState({
    contrato : '',
    periodo : '',
    dataReferencia: ''
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
    
    setLoading(true);
    FaturamentoService.getPeriodos()
      .then((result) => {
        setLoading(false);
        setPeriodos(result.data);
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

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };
  
  const handleSubmit = ( () => {
    setLoading(true)
    FaturamentoService.geraRelatorioFaturamento(values.periodo, values.contrato)
      .then((result) => {
        const linkSource = result.data;
        const downloadLink = document.createElement("a");
        const fileName = "relFaturamento_" + values.periodo + "_" + values.contrato +".pdf";
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
      })
      .catch((error) => {
        setError(JSON.stringify(error));
      })
      .finally(() => setLoading(false));
  });

  const handleSubmitPlantonistas = (() => {
    navigate('/app/solicitacoesplantonista', {replcace: true});
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
          subheader="Informe o contrato e o periodo."
          title="Faturamento"
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

            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                label="Período"
                name="periodo"
                required
                onChange={handleChange}
                value={values.periodo}
                variant="outlined"
                select
                SelectProps={{ native: true }}
              >
                <option value={0}></option>
                {
                  periodos.map((option) =>(
                    <option key={option.id} value={option.id}>{option.descricao}  </option>
                  ))
                }
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
                Gerar relatório
              </Button>
            </Grid>
            <Grid item md={6} xs={6}>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                onClick={handleSubmitPlantonistas}
                disabled={loading}>
                Emitir NFe
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

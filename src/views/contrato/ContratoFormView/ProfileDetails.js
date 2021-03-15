import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Switch,
  Typography
} from '@material-ui/core';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {Alert} from '@material-ui/lab';
import EmpresaService from '../../../services/EmpresaService';
import ClienteService from '../../../services/ClienteService';
import ContratoService from '../../../services/ContratoService';
import moment from 'moment';

const listTipoFaturamento = [
  {
    id: 'GERAL',
    label: 'Geral'
  },
  {
    id: 'POR_REFEICAO',
    label: 'Por refeição'
  }
];


const useStyles = makeStyles(() => ({
  root: {}
}));

const ProfileDetails = ({ className, contratoId, ...rest }) => {

  const navigate = useNavigate();
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("")
  const [empresas, setEmpresas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [contratoSel, setContratoSel] = useState({
    id : 0,
    empresa : {id : 0},
    cliente : {id : 0},
    numero : '',
    vigenciaInicial: '',
    vigenciaFinal : '',
    tipoFaturamento : '',
    ativo : false
  });
  //const [values, setValues] = useState();
  
  const [values, setValues] = useState({
    id : 0,
    empresa : '',
    cliente : '',
    numero : '',
    vigenciaInicial: '',
    vigenciaFinal : '',
    tipoFaturamento : '',
    ativo : false
  });
  

  useEffect(() => {
    ContratoService.getContrato(contratoId)
      .then((result) => {
        console.log(result.data);
        setContratoSel(result.data);
      })
      .catch((error) => {
        if(error.response.data) {
          console.log("Status", error.response.data.status);
          if(error.response.data.status !== 404) {
            setError(error.response.data.detail);
          }
        } else {
          setError(error.message);
        }
          
      });
  },[contratoId])

  useEffect(() => {
    console.log("Passo 2");
    setLoading(true);

    var vigIni = moment(contratoSel.vigenciaInicial).format("YYYY-MM-DD");
    var vigFim = moment(contratoSel.vigenciaFinal).format("YYYY-MM-DD");

    console.log("vigIni", vigIni);
    console.log("vigFim", vigFim);
    
    setValues({
      id : contratoSel.id,
      empresa : contratoSel.empresa.id,
      cliente : contratoSel.cliente.id,
      numero : contratoSel.numero,
      vigenciaInicial: vigIni,//contratoSel.vigenciaInicial,
      vigenciaFinal : vigFim,//contratoSel.vigenciaFinal,
      tipoFaturamento : contratoSel.tipoFaturamento,
      ativo : contratoSel.ativo
    });
    console.log(contratoSel);
    ClienteService.getClientesList()
      .then((result) => {
        setLoading(false)
        setClientes(result.data);
      })
      .catch((error) => {
        setLoading(false);
        if(error.response.data) {
          setError(error.response.data.detail);
        } else {
          setError(JSON.stringify(error));
        }
      });

      setLoading(true);
      EmpresaService.getEmpresasList()
        .then((result) => {
          setLoading(false);
          setEmpresas(result.data);
        }) 
        .catch((error) => {
          setLoading(false);
          if(error.response.data) {
            setError(error.response.data.detail);
          } else {
            setError(JSON.stringify(error));
          }
        })
    
  }, [contratoSel]);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleCheck = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.checked
    });
  };

  const handleGoBack = (() => {
    navigate('/app/contratos', {replace : true});
  });

  const handleSubmit = ( () => {
    setLoading(true);

    if(values.empresa === null) {
      setLoading(false);
      setError("Informe a empresa")
    } else {
      if(values.cliente === null) {
        setLoading(false);
        setError("Informe o cliente")
      } else {
        if(values.numero === null || values.numero === "") {
          setLoading(false)
          setError("Informe o número do contrato");
        } else {
          if(values.vigenciaInicial === "") {
            setLoading(false)
            setError("Informe o inicio da vigência");
          } else {
            if(values.vigenciaFinal === "") {
              setLoading(false)
              setError("Informe o fim da vigência");
            } else {
              if(values.tipoFaturamento === "") {
                setLoading(false)
                setError("Informe o de faturamento");
              } else {

                
               const params = new URLSearchParams();
               params.append('contratoId', values.id);
               params.append('empresaId', values.empresa);
               params.append('clienteId', values.cliente);
               params.append('numero', values.numero);
               params.append('vigenciaInicial', values.vigenciaInicial);
               params.append('vigenciaFinal', values.vigenciaFinal);
               params.append('tipoFaturamento', values.tipoFaturamento);
               params.append('ativo', values.ativo);
                  
              ContratoService.criaContrato(params)
                .then((result) => {
                  alert("Contrato gravado com sucesso.");
                  setLoading(false);
                  navigate("/app/contratos", {replace : true});
                })
                .catch((error) => {
                  setLoading(false);
                  setError(error.response.data.detail);
                });
                
              }
            }
          }
        }
      }
    }
        
  } );

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
          title="Cadastro do contrato"
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
              md={6}
              xs={12}
            >
              <TextField type="hidden" name="id" value={values.id}></TextField>
              <TextField
                fullWidth
                helperText="Informe a empresa"
                label="Empresa"
                name="empresa"
                onChange={handleChange}
                required
                value={values.empresa}
                variant="outlined"
                select
                SelectProps={{ native: true }}
              >
                <option value={''}></option>
                {
                  empresas.map((option) =>(
                    <option key={option.id} value={option.id}>{option.razaoSocial}</option>
                  ))
                }
              </TextField>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Cliente"
                name="cliente"
                required
                helperText="Informe o cliente"
                onChange={handleChange}
                value={values.cliente}
                variant="outlined"
                select
                SelectProps={{ native: true }}
              >
                <option value={''}></option>
                {
                  clientes.map((option) =>(
                    <option key={option.id} value={option.id}>{option.razaoSocial}  </option>
                  ))
                }
              </TextField>
            </Grid>
            
            <Grid
              item
              md={6}
              xs={12}
            >
              
              <TextField
                fullWidth
                label="Número"
                name="numero"
                helperText="Informe o número do contrato"
                onChange={handleChange}
                required
                value={values.numero}
                variant="outlined"
              >
              </TextField>  
            </Grid>

            <Grid
              item
              md={6}
              xs={12}
            >
              
              <TextField
                fullWidth
                
                name="vigenciaInicial"
                helperText="Informe o início de vigência"
                onChange={handleChange}
                required
                value={values.vigenciaInicial}
                variant="outlined"
                type="date"
              >
              </TextField>  
            </Grid>

            <Grid
              item
              md={6}
              xs={12}
            >
              
              <TextField
                fullWidth
                
                name="vigenciaFinal"
                helperText="Informe o fim de vigência"
                onChange={handleChange}
                required
                value={values.vigenciaFinal}
                variant="outlined"
                type="date"
              >
              </TextField>  
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Informe o tipo do faturamento"
                name="tipoFaturamento"
                onChange={handleChange}
                required
                select
                SelectProps={{ native: true }}
                value={values.tipoFaturamento}
                variant="outlined"
              >
                <option value={''}></option>
                {listTipoFaturamento.map((option) => (
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
              xs={12}
            >
              <Typography
                >
                <Switch
                checked={values.ativo}
                onChange={handleCheck}
                name="ativo"
                ></Switch>Ativo
              </Typography>
              
              
            </Grid>

          </Grid>
        </CardContent>
        <Divider />
        <Grid
              item
              md={6}
              xs={12}
            >
            <Box
            display="flex"
            justifyContent="flex-end"
            p={2}
          >
            <Button
              color="primary"
              variant="contained"
              onClick={handleSubmit}
            >
              Gravar
            </Button>
            <Button
              onClick={handleGoBack}
              variant="contained"
            >
              Cancelar
            </Button>
          </Box>
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

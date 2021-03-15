import React, { useEffect, useState } from 'react';
import {useCookies} from 'react-cookie';
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
import ClienteService from '../../../services/ClienteService';
import UnidadeService from '../../../services/UnidadeService';
import ClinicaService from '../../../services/ClinicaService';
import moment from 'moment';


const useStyles = makeStyles(() => ({
  root: {}
}));

const ProfileDetails = ({ className, ...rest }) => {

  const navigate = useNavigate();
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("")
  const [clientes, setClientes] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [clinicas, setClinicas] = useState([]);
  const [cookies, setCookie] = useCookies(['mapaClienteSel', 'mapaUnidadeSel', 'mapaClinicaSel']);


  const [clienteSel, setClienteSel] = useState(-1);
  const [unidadeSel, setUnidadeSel] = useState(-1);
  const [clinicaSel, setClinicaSel] = useState(-1);
  
  const [values, setValues] = useState({
    cliente : cookies.mapaClienteSel,
    unidade : cookies.mapaUnidadeSel,
    clinica : cookies.mapaClienteSel
  });

  useEffect(() => {

    
    if(cookies.mapaClienteSel) {
      setValues({
        ...values,
        cliente: cookies.mapaClienteSel
      })
    }

    if(cookies.mapaUnidadeSel) {
      setValues({
        ...values,
        unidade: cookies.mapaUnidadeSel
      }) 
    }

    if(cookies.mapaClinicaSel) {
      setValues({
        ...values,
        clinica: cookies.mapaClinicaSel
      })
    }

    ClienteService.getClientesList()
      .then((result) =>{
        setLoading(false);
        setClientes(result.data);
      })
      .catch((error) => {
        setLoading(false);
        if(error.response.data) {
          setError(error.response.data.detail)
        } else {
          setError(JSON.stringify(error));
        }
      });
  },[]);

  useEffect(() => {
    if(values.cliente > 0) {
      setLoading(true)
      UnidadeService.getUnidadesList(values.cliente)
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
  },[values.cliente]);

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
    console.log("Submitting ....");
    let expires = (60*60);
    setCookie('mapaClienteSel', values.cliente, {path: '/', maxAge: expires});
    setCookie('mapaUnidadeSel', values.unidade, {path: '/', maxAge: expires});
    setCookie('mapaClinicaSel', values.clinica, {path: '/', maxAge: expires});
    navigate("/app/mapas/" + values.clinica, {replace: true});
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
          title="Mapa de pacientes"
        />
        {error && 
          <Alert severity="error">{error}</Alert>}
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
            direction="column"
          >
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                fullWidth
                label="Cliente"
                name="cliente"
                required
                
                onChange={handleChange}
                value={values.cliente}
                variant="outlined"
                select
                SelectProps={{ native: true }}
              >
                <option value={0}></option>
                {
                  clientes.map((option) =>(
                    <option key={option.id} value={option.id}>{option.razaoSocial}  </option>
                  ))
                }
              </TextField>
            </Grid>

            <Grid
              item
              md={12}
              xs={12}
            >
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
            
            <Grid
              item
              md={12}
              xs={12}
            >
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
            <Grid
              item
              md={12}
              xs={12}
            >
           
            <Button
              color="primary"
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              fullWidth
            >
              Ok
            </Button>
          
        </Grid>
          </Grid>
        </CardContent>        
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

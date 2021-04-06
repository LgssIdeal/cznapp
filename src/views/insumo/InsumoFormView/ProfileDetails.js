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
  FormGroup,
  FormControlLabel,
  Switch
} from '@material-ui/core';

import {Alert} from '@material-ui/lab';
import InsumoService from '../../../services/InsumoService';

const useStyles = makeStyles(() => ({
  root: {}
}));

const ProfileDetails = ({ className, insumoId, ...rest }) => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const [error, setError] = useState("")
  const [values, setValues] = useState({
    id: 0,
    descricao: '',
    unidade: '',
    valor: 0.0
  });


  useEffect(() => {
    if(insumoId !== "0") {
      setLoading(true);
      InsumoService.getInsumo(insumoId)
        .then((result) => {
          setValues(result.data);
        })
        .catch((error) => {
          setError(JSON.stringify(error))
        })
        .finally(() => setLoading(false));
    }
  }, [insumoId])

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
    navigate('/app/insumos', {replace : true});
  });

  const handleSubmit = ( () => {
    setLoading(true);
    const data = {
      id : values.id,
      descricao : values.descricao,
      unidade: values.unidade,
      valor: values.valor
    }

    const json = JSON.stringify(data);
        
    InsumoService.criaInsumo(json)
      .then((result) => {
        alert("Insumo gravado com sucesso.");
        setLoading(false);
        var url = "/app/insumos";
        navigate(url, {replace : true});
      })
      .catch((error) => {
        setLoading(false);
        setError(error.response.data.detail);
      });
          
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
          title={"Cadastro de insumos"}
        />
        {error && 
                  <Alert severity="error">{error}</Alert>}
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField type="hidden" name="id" value={values.id}></TextField>
              <TextField
                fullWidth
                helperText="Informe a descrição"
                label="Descrição"
                name="descricao"
                onChange={handleChange}
                required
                value={values.descricao}
                variant="outlined"
                
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Unidade"
                name="unidade"
                helperText="Informe a unidade do insumo (PC, UN, CX)"
                onChange={handleChange}
                required
                value={values.unidade}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Valor"
                name="valor"
                helperText="Informe o valor do insumo"
                onChange={handleChange}
                required
                value={values.valor}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box p={2}>
          <Grid container spacing={3}>
            <Grid item md={3} xs={6}>
              
              <Button
                fullWidth
                color="primary"
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
              >
                Gravar
              </Button>
            </Grid>
            <Grid item md={3} xs={6}>
              <Button
                fullWidth
                onClick={handleGoBack}
                variant="contained"
                disabled={loading}
              >
                Cancelar
              </Button>
            
            </Grid>
          </Grid>
        </Box>
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

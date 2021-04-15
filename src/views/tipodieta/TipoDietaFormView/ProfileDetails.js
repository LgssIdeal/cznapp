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
  FormControlLabel,
  Switch
} from '@material-ui/core';

import {Alert} from '@material-ui/lab';
import TipoDietaService from '../../../services/TipoDietaService';

const useStyles = makeStyles(() => ({
  root: {}
}));

const ProfileDetails = ({ className, tipoDieta, ...rest }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const [error, setError] = useState("")
  const [values, setValues] = useState({
    id: '',
    descricao: '',
    sigla: '',
    fatura: false
  });
  const [invalidToken, setInvalidToken] = useState(false);

  useEffect(() => {
    TipoDietaService.getTipoDieta(tipoDieta)
      .then((result) => {
        setValues({
          id: result.data.id,
          descricao: result.data.descricao,
          sigla: result.data.sigla,
          fatura: result.data.fatura
        });
      })
      .catch((error) => {
        if(error.response.data) {
          setError(error.response.data.detail);
        } else {
          var e = JSON.stringify(error);
          if(e.includes("404")) {
            setValues({
              id: '',
              descricao: '',
              sigla: '',
              fatura: false
            });
          } else {
            if(e.includes("401")) {
              setInvalidToken(true);
            } else {
              setError(e);
            }
          }
        }
      })
      .finally(() => {
        setLoading(false)
      });
      
  }, []);

  useEffect(() => {
    if(invalidToken) {
      navigate("/", {replace: true});
    }
  }, [invalidToken])

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleGoBack = (() => {
    navigate('/app/tiposdieta', {replace : true});
  });

  const handleCheck = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.checked
    });
  };

  const handleSubmit = ( () => {
    setLoading(true);
    const data = {
      id : values.id,
      descricao : values.descricao,
      sigla : values.sigla,
      fatura: values.fatura
    }

    const json = JSON.stringify(data);
        
    TipoDietaService.criaTipoDieta(json)
      .then((result) => {
        alert("Tipo de dieta gravada com sucesso.");
        setLoading(false);
        navigate("/app/tiposdieta/", {replace : true});
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
          title={"Cadastro do tipo da dieta"}
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
                helperText="Informe o tipo de dieta"
                label="Descrição"
                name="descricao"
                onChange={handleChange}
                required
                value={values.descricao}
                variant="outlined"
                
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Sigla"
                name="sigla"
                helperText="Informe a sigla do tipo da dieta"
                onChange={handleChange}
                required
                value={values.sigla}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <FormControlLabel 
                control={<Switch 
                          checked={values.fatura} 
                          onChange={handleCheck} 
                          name="fatura"
                          color="primary"/>}
                label={"Considera no faturamento"}/>
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
              disabled={loading}
            >
              Gravar
            </Button>
            <Button
              onClick={handleGoBack}
              variant="contained"
              disabled={loading}
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

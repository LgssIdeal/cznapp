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
  LinearProgress
} from '@material-ui/core';

import {Alert} from '@material-ui/lab';
import ClinicaService from '../../../services/ClinicaService';

const useStyles = makeStyles(() => ({
  root: {}
}));

const ProfileDetails = ({ className, unidadeSel, clienteSel, clinicaSel, ...rest }) => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const [error, setError] = useState("")
  const [values, setValues] = useState({
    id: clinicaSel.id,
    descricao: clinicaSel.descricao,
    sigla: clinicaSel.sigla
  });

  useEffect(() => {
    setValues({
      id: clinicaSel.id,
      descricao: clinicaSel.descricao,
      sigla: clinicaSel.sigla
    });    
  }, [clinicaSel]);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleGoBack = (() => {
    navigate('/app/clinicas/' + clienteSel.id + '/' + unidadeSel.id, {replace : true});
  });

  const handleSubmit = ( () => {
    setLoading(true);
    const data = {
      id : values.id,
      descricao : values.descricao,
      sigla : values.sigla
    }

    const json = JSON.stringify(data);
        
    ClinicaService.criaClinica(json, unidadeSel.id)
      .then((result) => {
        alert("Clínica gravada com sucesso.");
        setLoading(false);
        var url = "/app/clinicas/" + clienteSel.id + "/" + unidadeSel.id;
        console.log("Cria/Altera clinica url: ", url);
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
          title={"Cadastro da clínica - Unidade: " + unidadeSel.descricao}
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
                helperText="Informe a unidade"
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
                helperText="Informe a sigla da unidade"
                onChange={handleChange}
                required
                value={values.sigla}
                variant="outlined"
              />
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

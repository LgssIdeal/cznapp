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
import axios from 'axios';


const states = [
  {
    value: '',
    label: ''
  },
  {
    value: 'ADMINISTRADOR',
    label: 'Administrador'
  },
  {
    value: 'CORPO_TECNICO',
    label: 'Corpo técnico'
  },
  {
    value: 'SND',
    label: 'SND'
  }
];

const useStyles = makeStyles(() => ({
  root: {}
}));

const ProfileDetails = ({ className, userSel, ...rest }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const classes = useStyles();
  const [error, setError] = useState("")
  const [values, setValues] = useState({
    id: userSel.id,
    nome: userSel.nome,
    perfil: userSel.perfil,
    login: userSel.login,
    orgaoClasse: userSel.orgaoClasse,
    email : userSel.email
  });

  useEffect(() => {
    setValues({
      id: userSel.id,
      nome: userSel.nome,
      perfil: userSel.perfil,
      login: userSel.login,
      orgaoClasse: userSel.orgaoClasse,
      email :  userSel.email
    });    
  }, [userSel]);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleGoBack = (() => {
    navigate('/app/usuarios', {replace : true});
  });

  const handleSubmit = ( () => {

    if(values.nome === '') {
      setError("Informe o nome do usuário")
    } else {
      if(values.login === '') {
        setError("Informe o identificador de login")
      } else {
        if(values.perfil === '') {
          setError("Informe o perfil do usuário")
        } else {
          if(values.email === '') {
            setError("Informe o e-mail do usuário")
          } else {
            setLoading(true);
            const auth = {
              headers : {
                  "Authorization" : 'Bearer ' + JSON.parse(localStorage.getItem("@app-user")).jwtToken,
                  "Content-Type" : "application/json;charset=utf-8"
              }
            }

            const data = {
              id : values.id,
              nome : values.nome,
              login : values.login,
              perfil : values.perfil,
              orgaoClasse : values.orgaoClasse,
              email : values.email
            }

            const json = JSON.stringify(data);
        
            axios.post(process.env.REACT_APP_API_URL + '/usuarios', json, auth)
                .then((result) => {
                    setLoading(false);
                    alert("Usuário gravado com sucesso");
                    navigate("/app/usuarios", {replace : true});
                })
                .catch((error) => {
                    setLoading(false);
                    setError(error.response.data.detail);
                });
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
          title="Cadastro do usuário"
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
                helperText="Informe o nome do usuário"
                label="Nome"
                name="nome"
                onChange={handleChange}
                required
                value={values.nome}
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
                label="Login"
                name="login"
                helperText="Informe login do usuário"
                onChange={handleChange}
                required
                value={values.login}
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
                label="E-mail"
                name="email"
                helperText="Informe o e-mail do usuário"
                onChange={handleChange}
                required
                value={values.email}
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
                label="Informe o perfil"
                name="perfil"
                onChange={handleChange}
                required
                select
                SelectProps={{ native: true }}
                value={values.perfil}
                variant="outlined"
              >
                {states.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
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
              <TextField
                fullWidth
                label="Orgão de classe"
                name="orgaoClasse"
                helperText="Informe o conselho de classe e nro. de registro"
                onChange={handleChange}
                value={values.orgaoClasse}
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
              <LinearProgress />}
      </Card>
    </form>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string
};

export default ProfileDetails;

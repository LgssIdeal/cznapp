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
import SolicitacaoPlantonistaService from '../../../services/SolicitacaoPlantonistaService';
import refeicoes from '../../../utils/refeicoes';

const useStyles = makeStyles(() => ({
  root: {}
}));

const ProfileDetails = ({ className, solicitacaoId, ...rest }) => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const [error, setError] = useState("")
  const [values, setValues] = useState({
    id: 0,
    dataSolicitacao: null,
    dataAlteracao: null,
    usuarioSolicitacao: null,
    usuarioAlteracao: null,
    refeicao: '',
    quantidade: ''
  });


  useEffect(() => {
    if(solicitacaoId !== "0") {
      setLoading(true);
      SolicitacaoPlantonistaService.getSolicitacao(solicitacaoId)
        .then((result) => {
          setValues(result.data);
        })
        .catch((error) => {
          setError(JSON.stringify(error))
        })
        .finally(() => setLoading(false));
    }
  }, [solicitacaoId])

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
    navigate('/app/solicitacoesplantonista', {replace : true});
  });

  const handleSubmit = ( () => {
    setLoading(true);
    
    const params = new URLSearchParams();
    params.append('solicitacaoId', values.id);
    params.append('usuarioId', JSON.parse(localStorage.getItem("@app-user")).id);
    params.append('refeicao', values.refeicao);
    params.append('quantidade', parseInt(values.quantidade));

        
    SolicitacaoPlantonistaService.criaSolicitacao(params)
      .then((result) => {
        alert("Solcitação gravada com sucesso.");
        setLoading(false);
        var url = "/app/solicitacoesplantonista";
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
          title={"Solicitação de refeição para plantonista"}
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
                  onChange={handleChange}
                  required
                  variant="outlined"
                  select
                  SelectProps={{ native: true }}
                  name="refeicao"
                  label="Refeição"
                  disabled={loading}
                  value={values.refeicao}>
                  {
                    refeicoes.map((option) =>(
                      <option key={option.id} value={option.id}>{option.value}</option>
                    ))
                  }
                
                </TextField>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Quantidade"
                name="quantidade"
                helperText="Informe a quantidade de refeições"
                onChange={handleChange}
                required
                value={values.quantidade}
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

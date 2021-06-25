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
import TipoDietaService from '../../../services/TipoDietaService';
import SuplementoService from '../../../services/SuplementoService';
import InsumoService from '../../../services/InsumoService';

const useStyles = makeStyles(() => ({
  root: {}
}));

const ProfileDetails = ({ className, suplementoId, ...rest }) => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const [error, setError] = useState("")
  const [tiposDieta, setTiposDieta] = useState([]);
  const [values, setValues] = useState({
    id: 0,
    descricao: '',
    tipoDieta: 0,
    refeicaoEquivalente: 0
  });

  const refeicoes = [
    {
      id: 1,
      descricao: 'Desjejum',
      chave: 'DESJEJUM'
    },
    {
      id: 2,
      descricao: 'Lanche 1',
      chave: 'LANCHE_1'
    },
    {
      id: 3,
      descricao: 'Almoço',
      chave: 'ALMOCO'
    },
    {
      id: 4,
      descricao: 'Lanche 2',
      chave: 'LANCHE_2'
    },
    {
      id: 5,
      descricao: 'Jantar',
      chave: 'JANTAR'
    },
    {
      id: 6,
      descricao: 'Ceia',
      chave: 'CEIA'
    }
  ]


  useEffect(() => {
    if(suplementoId !== "0") {
      setLoading(true);
      SuplementoService.getSuplemento(suplementoId)
        .then((result) => {
          let refEquiv = refeicoes.find(e => e.chave === result.data.refeicaoEquivalente);
          console.log("refEquiv", refEquiv);
          const aux = {
              id: result.data.id,
              descricao: result.data.descricao,
              tipoDieta: result.data.tipoDieta.id,
              refeicaoEquivalente: refEquiv ? refEquiv.id : 0
          }
          setValues(aux);
        })
        .catch((error) => {
          setError(JSON.stringify(error))
        })
        .finally(() => setLoading(false));
    }
  }, [suplementoId])

  useEffect( () => {
    setLoading(true);
    TipoDietaService.getTiposDietaList()
        .then((result) => {
            setTiposDieta(result.data);
        })
        .catch((error) => {
            setError(JSON.stringify(error))
        })
        .finally(() => setLoading(false));    

  }, [])

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };


  const handleGoBack = (() => {
    navigate('/app/suplementos', {replace : true});
  });

  const handleSubmit = ( () => {
    console.log("TipDieta", values.tipoDieta);
    console.log("array", tiposDieta);
    const aux = tiposDieta.find(e => e.id === parseInt(values.tipoDieta));
    console.log("aux", aux);
    setLoading(true);
    console.log(values.refeicaoEquivalente);
    let refEquiv = refeicoes.find(e => e.id === parseInt(values.refeicaoEquivalente));
    const data = {
      id : values.id,
      descricao : values.descricao,
      tipoDieta: aux,
      refeicaoEquivalente: refEquiv.chave
    }

    const json = JSON.stringify(data);

    //console.log("JSON", json);
    
    
    SuplementoService.criaSuplemento(json)
      .then((result) => {
        alert("Suplemento gravado com sucesso.");
        setLoading(false);
        var url = "/app/suplementos";
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
          title={"Cadastro de suplementos"}
        />
        {error && 
                  <Alert severity="error">{error}</Alert>}
        <Divider />
        <CardContent>
          <Grid container spacing={3} direction="row">
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
                    label="Tipo de dieta"
                    name="tipoDieta"
                    required
                    helperText="Informe o tipo de dieta"
                    onChange={handleChange}
                    value={values.tipoDieta}
                    variant="outlined"
                    select
                    SelectProps={{ native: true }}>
                    <option value={0}></option>
                    {
                        tiposDieta.map((option) =>(
                        <option key={option.id} value={option.id}>{option.sigla}</option>
                        ))
                    }
                </TextField>
            </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                    fullWidth
                    label="Refeição equivalente"
                    name="refeicaoEquivalente"
                    required
                    helperText="Informe a refeição equivalente"
                    onChange={handleChange}
                    value={values.refeicaoEquivalente}
                    variant="outlined"
                    select
                    SelectProps={{ native: true }}>
                    <option value={0}></option>
                    {
                        refeicoes.map((option) =>(
                        <option key={option.id} value={option.id}>{option.descricao}</option>
                        ))
                    }
                </TextField>
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

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
  CircularProgress
} from '@material-ui/core';
import { confirmAlert } from 'react-confirm-alert';
import {Alert} from '@material-ui/lab';
import axios from 'axios';
import {MaskedInput} from 'react-text-mask';
import EmpresaService from '../../../services/EmpresaService';
import EnderecoService from '../../../services/EnderecoService';
/*
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
*/

const useStyles = makeStyles(() => ({
  root: {}
}));

const ProfileDetails = ({ className, empresaSel, ...rest }) => {

  const navigate = useNavigate();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")
  const [enderecoPorCep, setEnderecoPorCep] = useState({
    cep: '',
    logradouro: '',
    complemento: '',
    bairro: '',
    localidade: '',
    uf: '',
    unidade: null,
    ibge: '',
    gia: '',
    erro: null,
    id: 0
  });
  const [values, setValues] = useState({
    id : empresaSel.id,
    documento : empresaSel.documento,
    razaoSocial : empresaSel.razaoSocial,
    fantasia : empresaSel.fantasia,
    ie : empresaSel.ie,
    logradouro : empresaSel.logradouro,
    numero : empresaSel.numero,
    complemento : empresaSel.complemento,
    bairro : empresaSel.bairro,
    cidade : empresaSel.cidade,
    codIbge : empresaSel.codIbge,
    uf : empresaSel.uf,
    cep : empresaSel.cep,
    fone1 : empresaSel.fone1,
    fone2 : empresaSel.fone2
  });

  useEffect(() => {
    setValues({
      id : values.id,
      documento : values.documento,
      razaoSocial : values.razaoSocial,
      fantasia : values.fantasia,
      ie : values.ie,
      numero : values.numero,
      complemento : values.complemento,
      cep : values.cep,
      fone1 : values.fone1,
      fone2 : values.fone2,
      logradouro : enderecoPorCep.logradouro,
      uf : enderecoPorCep.uf,
      cidade : enderecoPorCep.localidade,
      bairro : enderecoPorCep.bairro,
      codIbge : enderecoPorCep.ibge
    })
    
  },[enderecoPorCep])

  useEffect(() => {
    setValues({
      id : empresaSel.id,
      documento : empresaSel.documento,
      razaoSocial : empresaSel.razaoSocial,
      fantasia : empresaSel.fantasia,
      ie : empresaSel.ie,
      logradouro : empresaSel.logradouro,
      numero : empresaSel.numero,
      complemento : empresaSel.complemento,
      bairro : empresaSel.bairro,
      cidade : empresaSel.cidade,
      codIbge : empresaSel.codIbge,
      uf : empresaSel.uf,
      cep : empresaSel.cep,
      fone1 : empresaSel.fone1,
      fone2 : empresaSel.fone2
    });    
  }, [empresaSel]);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleCepBlur = () => {
    setLoading(true);
    EnderecoService.getEnderecoPelocep(values.cep)
      .then((result) => {
        const data= {
          cep: result.data.cep,
          logradouro: result.data.logradouro,
          complemento: result.data.complemento,
          bairro: result.data.bairro,
          localidade: result.data.localidade,
          uf: result.data.uf,
          unidade: result.data.unidade,
          ibge: result.data.ibge,
          gia: result.data.gia,
          erro: result.data.erro,
          id: result.data.id
        };
        setEnderecoPorCep(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(error.response.data.detail);
      });
  }

  const handleGoBack = (() => {
    navigate('/app/empresas', {replace : true});
  });

  const handleSubmit = ( () => {
    setLoading(true);
    const data = {
      id : values.id,
      documento : values.documento,
      razaoSocial : values.razaoSocial,
      fantasia : values.fantasia,
      ie : values.ie,
      logradouro : values.logradouro,
      numero : values.numero,
      complemento : values.complemento,
      bairro : values.bairro,
      cidade : values.cidade,
      codIbge : values.codIbge,
      uf : values.uf,
      cep : values.cep,
      fone1 : values.fone1,
      fone2 : values.fone2
    }

    const json = JSON.stringify(data);

    EmpresaService.criaEmpresa(json)
      .then((result) => {
        alert("Empresa gravada com sucesso.");
        setLoading(false);
        navigate("/app/empresas", {replace : true});
      })
      .catch((error) => {
        setLoading(false);
        setError(error.response.data.detail);
      });
        
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
          title="Cadastro da empresa"
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
                helperText="Informe a razão social da empresa"
                label="Razão social"
                name="razaoSocial"
                onChange={handleChange}
                required
                value={values.razaoSocial}
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
                label="Fantasia"
                name="fantasia"
                helperText="Informe o nome fantasia"
                onChange={handleChange}
                value={values.fantasia}
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
                label="CNPJ"
                name="documento"
                helperText="Informe o CNPJ da empresa"
                onChange={handleChange}
                required
                value={values.documento}
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
                label="IE"
                name="ie"
                helperText="Informe a inscrição estadual"
                onChange={handleChange}
                value={values.ie}
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
                label="CEP"
                name="cep"
                required
                helperText="Informe o CEP"
                onChange={handleChange}
                onBlur={handleCepBlur}
                value={values.cep}
                variant="outlined"
              >
              </TextField>
              {loading && 
                <CircularProgress size={20}></CircularProgress>}  
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              
              <TextField
                fullWidth
                label="Endereço"
                name="endereco"
                required
                helperText="Informe o endereço"
                onChange={handleChange}
                value={values.logradouro}
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
                label="Número"
                name="numero"
                required
                helperText="Informe o númerp"
                onChange={handleChange}
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
                label="Complemento"
                name="complemento"
                helperText="Informe o complemento"
                onChange={handleChange}
                value={values.complemento}
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
                label="Bairro"
                name="bairro"
                required
                helperText="Informe o bairro"
                onChange={handleChange}
                value={values.bairro}
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
                label="Cidade"
                name="cidade"
                required
                helperText="Informe a cidade"
                onChange={handleChange}
                value={values.cidade}
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
                label="Estado"
                name="estado"
                required
                helperText="Informe o estado"
                onChange={handleChange}
                value={values.uf}
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
                label="Código IBGE"
                name="ibge"
                required
                helperText="Informe código IBGE"
                onChange={handleChange}
                value={values.codIbge}
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
                label="Fone 1"
                name="fone1"
                helperText="Informe telefone 1"
                onChange={handleChange}
                value={values.fone1}
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
                label="Fone 2"
                name="fone2"
                helperText="Informe o telefone 2"
                onChange={handleChange}
                value={values.fone2}
                variant="outlined"
              >
              </TextField>  
            </Grid>
            { /*
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
            */}
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

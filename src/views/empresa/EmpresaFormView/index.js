import {React, useState, useEffect } from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from '../../../components/Page';
import ProfileDetails from './ProfileDetails';
import { useParams } from 'react-router-dom';
import EmpresaService from '../../../services/EmpresaService'
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const EmpresaFormView = () => {
  const classes = useStyles();
  const [errorMsg, setErrorMsg] = useState("");
  const nEmpresa = {
    id : '',
    documento : '',
    razaoSocial : '',
    fantasia : '',
    ie : '',
    logradouro : '',
    numero : '',
    complemento : '',
    bairro : '',
    cidade : '',
    codIbge : '',
    uf : '',
    cep : '',
    fone1 : '',
    fone2 : ''
  }

  const[empresaSel, setEmpresaSel] = useState(nEmpresa);
  
  let {empresaId}  = useParams();

  useEffect(() => {
    EmpresaService.getEmpresa(empresaId)
      .then((result) => {
        setEmpresaSel(result.data)
      })
      .catch((error) => {
        setErrorMsg(error.data);
        
      });    
  }, [empresaId]);

  return (
    <Page
      className={classes.root}
      title="Cadastro do usuário"
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={8}
            md={6}
            xs={12}
          >
            <ProfileDetails empresaSel={empresaSel}/>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default EmpresaFormView;

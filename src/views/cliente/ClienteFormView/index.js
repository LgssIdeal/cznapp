import {React, useState, useEffect } from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from '../../../components/Page';
import ProfileDetails from './ProfileDetails';
import { useParams } from 'react-router-dom';
import ClienteService from '../../../services/ClienteService'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const ClienteFormView = () => {
  const classes = useStyles();
  const [errorMsg, setErrorMsg] = useState("");
  const nCliente = {
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

  const[clienteSel, setClienteSel] = useState(nCliente);
  
  let {clienteId}  = useParams();

  useEffect(() => {
    ClienteService.getCliente(clienteId)
      .then((result) => {
        setClienteSel(result.data)
      })
      .catch((error) => {
        setErrorMsg(error.data);
        
      });    
  }, [clienteId]);

  return (
    <Page
      className={classes.root}
      title="Cadastro do cliente"
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
            <ProfileDetails clienteSel={clienteSel}/>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default ClienteFormView;

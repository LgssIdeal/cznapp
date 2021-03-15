import {React, useState, useEffect } from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from '../../../components/Page';
import ProfileDetails from './ProfileDetails';
import { useParams } from 'react-router-dom';
import ClienteService from '../../../services/ClienteService';
import UnidadeService from '../../../services/UnidadeService';
import ClinicaService from '../../../services/ClinicaService';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const ClinicaFormView = () => {
  let {clienteId, unidadeId, clinicaId}  = useParams();
  const classes = useStyles();
  const [errorMsg, setErrorMsg] = useState("");

  const nClinica = {
    id : '',
    descricao : '',
    sigla : ''
  }
  
  const nUnidade = {
    id : '',
    descricao : '',
    sigla : ''
  }

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

  const[unidadeSel, setUnidadeSel] = useState(nUnidade);
  const[clienteSel, setClienteSel] = useState(nCliente);
  const[clinicaSel, setClinicaSel] = useState(nClinica);
  
  useEffect(() => {
    
    ClienteService.getCliente(clienteId)
      .then((result) => {
        setClienteSel(result.data)
      })
      .catch((error) => {
        setErrorMsg(error.data)
      });

    UnidadeService.getUnidade(unidadeId)
      .then((result) => {
        setUnidadeSel(result.data);
      })
      .catch((error) => {
        setErrorMsg(error.data)
      });
    
    ClinicaService.getClinica(clinicaId)
      .then((result) => {
        setClinicaSel(result.data);
      })
      .catch((error) => {
        setErrorMsg(error.data);
      });
    
        
  }, [clienteId, unidadeId, clinicaId]);

  return (
    <Page
      className={classes.root}
      title="Cadastro da unidade"
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
            <ProfileDetails unidadeSel={unidadeSel} clienteSel={clienteSel} clinicaSel={clinicaSel}/>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default ClinicaFormView;

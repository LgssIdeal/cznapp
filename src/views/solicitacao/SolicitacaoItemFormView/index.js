import {React, useState, useEffect } from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from '../../../components/Page';
import ProfileDetails from './ProfileDetails';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const SolicitacaoItemFormViewFormView = () => {
  const classes = useStyles();
  const [errorMsg, setErrorMsg] = useState("");

  const[contratoSel, setContratoSel] = useState();
  
  let {contratoId, unidadeId, clinicaId, dataReferencia, solicitacaoId, solicitacaoItemId}  = useParams();

  return (
    <Page
      className={classes.root}
      title="Alteração mapa do paciente"
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={8}
            md={8}
            xs={12}
          >
            <ProfileDetails
              contratoId={contratoId}
              unidadeId={unidadeId}
              clinicaId={clinicaId}
              dataReferencia={dataReferencia}
              solicitacaoId={solicitacaoId}
              solicitacaoItemId={solicitacaoItemId}/>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default SolicitacaoItemFormViewFormView;

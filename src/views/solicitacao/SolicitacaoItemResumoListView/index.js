import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from '../../../components/Page';
import Results from './Results';
import {useParams} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const SolicitacaoItemResumoListView = () => {
  let {contratoId, unidadeId, clinicaId, refeicao, dataReferencia, solicitacaoId}  = useParams();
  const classes = useStyles();
  const [errorMsg, setErrorMsg] = useState("");
  const [pageable, setPageable] = useState();  

  return (
    <Page
      className={classes.root}
      title="Mapa de refeições solicitadas - Analítico"
    >
      <Container maxWidth={false}>
        <Box mt={3}>
          <Results pageable={pageable} contratoId={contratoId} unidadeId={unidadeId} clinicaId={clinicaId} refeicao={refeicao} dataReferencia={dataReferencia} solicitacaoId={solicitacaoId}/>
        </Box>
      </Container>
    </Page>
  );
};

export default SolicitacaoItemResumoListView;

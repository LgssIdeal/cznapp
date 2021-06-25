import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from '../../../components/Page';
import Results from './Results';
import Toolbar from './Toolbar';
import {useParams} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const SolicitacaoPlantonistaListView = () => {

  let {contratoId, unidadeId, dataReferencia}  = useParams();

  const classes = useStyles();
  const [errorMsg, setErrorMsg] = useState("");
  const [pageable, setPageable] = useState();  

  return (
    <Page
      className={classes.root}
      title="Tipos de Dieta"
    >
      <Container maxWidth={false}>
        <Toolbar contratoId={contratoId} unidadeId={unidadeId} dataReferencia={dataReferencia} />
        <Box mt={3}>
          <Results pageable={pageable} contratoId={contratoId} unidadeId={unidadeId} dataReferencia={dataReferencia}/>
        </Box>
      </Container>
    </Page>
  );
};

export default SolicitacaoPlantonistaListView;

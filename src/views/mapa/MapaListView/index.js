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

const MapaListView = () => {
  let {clinicaId} = useParams();
  const classes = useStyles();
  const [errorMsg, setErrorMsg] = useState("");
  const [pageable, setPageable] = useState();  

  return (
    <Page
      className={classes.root}
      title="Mapa"
    >
      <Container maxWidth={false}>
        <Toolbar clinicaId={clinicaId}/>
        <Box mt={3}>
          <Results pageable={pageable} />
        </Box>
      </Container>
    </Page>
  );
};

export default MapaListView;

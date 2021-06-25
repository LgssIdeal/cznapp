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

const SolicitacaoPlantonistaFormView = () => {
  let {contratoId, unidadeId, dataReferencia, solicitacaoId}  = useParams();
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Solicitações para plantonistas"
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
            <ProfileDetails 
              contratoId={contratoId}
              unidadeId={unidadeId}
              dataReferencia={dataReferencia}
              solicitacaoId={solicitacaoId}/>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default SolicitacaoPlantonistaFormView;

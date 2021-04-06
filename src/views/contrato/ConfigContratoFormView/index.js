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

const ConfigContratoFormView = () => {
  const classes = useStyles();  
  let {contratoId}  = useParams();

  return (
    <Page
      className={classes.root}
      title="Cadastro do contrato"
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={11}
            md={6}
            xs={12}
          >
            <ProfileDetails contratoId={contratoId}/>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default ConfigContratoFormView;

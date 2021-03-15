import {React, useState, useEffect } from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from '../../../components/Page';
import ProfileDetails from './ProfileDetails';
import { useParams } from 'react-router-dom';
import TipoDietaService from '../../../services/TipoDietaService';
import TipoDietaComplementarService from '../../../services/TipoDietaComplementarService';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const TipoDietaComplementarFormView = () => {
  const classes = useStyles();
  const [errorMsg, setErrorMsg] = useState("");
  const nTipoDietaComp = {
    id : '',
    descricao : '',
    sigla : ''
  }

  const nTipoDieta = {
    id : '',
    descricao : '',
    sigla : ''
  }

  const[tipoDietaCompSel, setTipoDietaCompSel] = useState(nTipoDietaComp);
  const[tipoDietaSel, setTipoDietaSel] = useState(nTipoDieta)
  
  let {tipoDietaId, tipoDietaCompId}  = useParams();

  useEffect(() => {
    
    TipoDietaService.getTipoDieta(tipoDietaId)
      .then((result) => {
        setTipoDietaSel(result.data)
      })
      .catch((error) => {
        setErrorMsg(error.data)
      });

    TipoDietaComplementarService.getTipoDietaComplementar(tipoDietaCompId)
      .then((result) => {
        setTipoDietaCompSel(result.data);
      })
      .catch((error) => {
        setErrorMsg(error.data)
      });
    
        
  }, [tipoDietaId, tipoDietaCompId]);

  return (
    <Page
      className={classes.root}
      title="Cadastro do tipo de dieta complementar"
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
            <ProfileDetails tipoDietaCompSel={tipoDietaCompSel} tipoDietaSel={tipoDietaSel}/>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default TipoDietaComplementarFormView;

import {React, useState, useEffect } from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from '../../../components/Page';
import Profile from './Profile';
import ProfileDetails from './ProfileDetails';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const UserFormView = () => {
  const classes = useStyles();
  const [errorMsg, setErrorMsg] = useState("");
  const nUser = {
    id : '',
    nome : '',
    perfil : '',
    login : '',
    email : ''
  }

  const[userSel, setUserSel] = useState(nUser);
  const[paramUserId, setParamUserId] = useState('');
  
  let {userId}  = useParams();

  useEffect(() => {
    const auth = {
      headers : {
          "Authorization" : 'Bearer ' + JSON.parse(localStorage.getItem("@app-user")).jwtToken
      }
    }

    axios.get(process.env.REACT_APP_API_URL + '/usuarios/' + userId, auth)
        .then((result) => {
            setUserSel(result.data)
        })
        .catch((error) => {
            setErrorMsg(error.data);
            
        });
        
  }, [userId]);

  //setParamUserId(userId);

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
            lg={4}
            md={6}
            xs={12}
          >
            <Profile userSel={userSel}/>
          </Grid>
          <Grid
            item
            lg={8}
            md={6}
            xs={12}
          >
            <ProfileDetails userSel={userSel}/>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default UserFormView;

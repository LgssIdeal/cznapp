import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  makeStyles,
  LinearProgress
} from '@material-ui/core';
import Page from '../../components/Page';
import { Alert } from '@material-ui/lab';
import LoginService from '../../services/LoginService'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));



const LoginView = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values, {setSubmitting, resForm}) => {
    setLoading(true);
    const params = new URLSearchParams();
    params.append('username', values.email);
    params.append('password', values.password);
    LoginService.login(params)
      .then((result) => {
        localStorage.removeItem("@app-user");
        localStorage.setItem("@app-user", JSON.stringify(result.data));
        navigate('/app/dashboard', { replace: true });
      })
      .catch((error) => {
        console.log("!!!!ERROR", error);
        setLoading(false);
        if(error.response) {
          setErrorMsg(error.response.data.detail);
        } else {
          setErrorMsg("Houve uma falha de conexão com a API. Procure o administrador.");
        }
        
        //setErrorMsg(error.response);
      } );
  }
  
  /*
  const handleSubmit = React.useCallback(

    (values, {setSubmitting, restForm}) => {
    
      const params = new URLSearchParams();
      params.append('username', values.email);
      params.append('password', values.password);

      const config = {
        headers : {
          'Content-Type' : 'application/x-www-form-urlencoded',
          'access-control-allow-origin' : '*'
        }
      }

      axios.post(process.env.REACT_APP_API_URL + '/login', params, config)
        .then((result) => {
          localStorage.setItem("@app-user", JSON.stringify(result.data));
          navigate('/app/dashboard', { replace: true });
        })
        .catch((error) => {
          setErrorMsg(JSON.stringify(error.response));
          //setErrorMsg(error.response);
        });
    }
  );
  */

  return (
    <Page
      className={classes.root}
      title="CZN Alimentação">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: '',
              password: '',
              err : ''
            }}
            
            validationSchema={Yup.object().shape({
              email: Yup.string().max(255).required('Informe um usuário'),
              password: Yup.string().max(255).required('A senha é requerida')
            })}


            

            onSubmit={(values) => {
              handleSubmit(values, true, true);
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>

                <Box mb={3}>
                  <Typography
                    color="textPrimary"
                    variant="h2"
                  >
                    CZN Alimentação
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Informe seu usuário e senha para acessar a aplicação
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Usuário"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  //type="email"
                  value={values.email}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Senha"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                
                {errorMsg &&
                  <Alert severity="error">{errorMsg}</Alert>}
                
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={loading}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Entrar
                  </Button>
                  {loading &&
                    <LinearProgress color="primary"/>}
                </Box>
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  
                </Typography>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default LoginView;
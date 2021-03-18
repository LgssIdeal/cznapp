import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  makeStyles,
  LinearProgress
} from '@material-ui/core';
import {useNavigate} from 'react-router-dom';
import {Alert} from '@material-ui/lab';
import { invalid } from 'moment';
import { CornerDownLeft } from 'react-feather';
import UsuarioService from '../../../services/UsuarioService';

const useStyles = makeStyles(({
  root: {}
}));

const Password = ({ className, ...rest }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    password: '',
    confirm: ''
  });
  const [usuarioId, setUsuarioId] = useState(0);
  const [invalidToken, setInvalidToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [respMsg, setRespMsg] = useState({
    msg: '',
    severity: ''
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  useEffect(() => {
    if(localStorage.getItem("@app-user") !== null) {
      setUsuarioId(JSON.parse(localStorage.getItem("@app-user")).id);
      setInvalidToken(false)
    } else {
      setInvalidToken(true);
    }
    if(values.confirm === '' && values.password === '') {
      setConfirmed(false);
    } else {
      if(values.confirm !== values.password) {
        setConfirmed(false);
      } else {
        setConfirmed(true);
      }
    }
  }, [values]);

  useEffect(() => {
    if(invalidToken) {
      navigate("/", {replace: true});
    }
  }, [invalidToken]);

  const doSubmit = () => {
    setLoading(true);
    console.log('Senha/Confirmação: ', values.password + '/' + values.confirm);
    const params = new URLSearchParams();
    params.append('senha', values.password);
    params.append('confirmacao', values.confirm);
    UsuarioService.alteraSenha(params, usuarioId)
      .then(() => {
        setRespMsg({
          msg: 'Senha alterada com sucesso. Você poderá utilizá-la no próximo login.',
          severity: 'success'
        });
      })
      .catch((error) => {
        if(error.response) {
          setRespMsg({
            msg: error.response.data.detail,
            severity: 'warning'
          });
        } else {
          var e = JSON.stringify(error);
          if(e.includes('401')) {
            setInvalidToken(true);
          } else {
            setRespMsg({
              msg: e,
              severity: 'error'
            });
          }
        }
      })
      .finally(() => setLoading(false))
  };

  return (
    <form
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Card>
        <CardHeader
          subheader="Alterar senha"
          title="Senha"
        />
        <Divider />
        <CardContent>
          {loading && <LinearProgress></LinearProgress>}
          {respMsg.msg && <Alert severity={respMsg.severity}>{respMsg.msg}</Alert>}
          <TextField
            fullWidth
            label="Senha"
            margin="normal"
            name="password"
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Confirmação"
            margin="normal"
            name="confirm"
            onChange={handleChange}
            type="password"
            value={values.confirm}
            variant="outlined"
          />
        </CardContent>
        <Divider />
        <Box
          display="flex"
          justifyContent="flex-end"
          p={2}
        >
          <Button
            color="primary"
            variant="contained"
            disabled={loading || !confirmed}
            onClick={doSubmit}
          >
            Alterar
          </Button>
        </Box>
      </Card>
    </form>
  );
};

Password.propTypes = {
  className: PropTypes.string
};

export default Password;

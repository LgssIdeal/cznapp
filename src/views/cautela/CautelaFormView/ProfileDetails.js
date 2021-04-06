import { v4 as uuid } from 'uuid';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {Delete} from '@material-ui/icons'
import {Alert} from '@material-ui/lab';
import moment from 'moment';
import InsumoService from '../../../services/InsumoService';
import CautelaService from '../../../services/CautelaService';

const useStyles = makeStyles(() => ({
  root: {}
}));

const ProfileDetails = ({ className, cautelaId, ...rest }) => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const [msg, setMsg] = useState({
    msg: '',
    severity: ''
  });
  const [cautela, setCautela] = useState();
  const [itens, setItens] = useState([]);
  const [values, setValues] = useState({
    id: '',
    quantidade: '',
    dataReferencia: moment(new Date()).format("YYYY-MM-DD")
  });

  const [insumos, setInsumos] = useState([]);

  useEffect(() => {
    setLoading(true);
    InsumoService.getInsumosList()
      .then((result) => {
        setInsumos(result.data);
      })
      .catch((error) => {
        setMsg({
          msg: JSON.stringify(error),
          severity: "error"
        });
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if(cautelaId !== '0') {
      setLoading(true);
      CautelaService.getCautela(cautelaId)
        .then((result) => {
          setCautela(result.data);
        })
        .catch((error) => {
          setMsg({
            msg: JSON.stringify(error),
            severity: "error"
          });
        })
        .finally(() => setLoading(false));
    }
  }, [cautelaId]);

  useEffect(() => {
    if(cautela) {
      setLoading(true);
      CautelaService.getItens(cautelaId)
        .then((result) => {
          setItens(result.data);
        })
        .catch((error) => {
          setMsg({
            msg: JSON.stringify(error),
            severity: "error"
          });
        })
        .finally(() => setLoading(false));
    }
  }, [cautela])

  const handleChange = (event) => {
    console.log("EVENT", event.target.name + " - " + event.target.value);
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };


  const handleGoBack = (() => {
    navigate('/app/cautelas', {replace : true});
  });

  const handleSubmit = ( () => {
    setLoading(true);

    for(var i = 0; i < itens.length; i++) {
      itens[i].id = null;
    }

    const data = {
      cautela: {
        id: null,
        dataReferencia: values.dataReferencia,
        dataCriacao: null,
        usuarioCriacao: JSON.parse(localStorage.getItem("@app-user")),
        dataAlteracao: null,
        usuarioAlteracao: null,
        status: null
      },
      itens: itens
    }

    const json = JSON.stringify(data);
        
    CautelaService.criaCautela(json)
      .then(() => {
        alert("Cautela gravada com sucesso.")
        navigate("/app/cautelas", {replace: true});
      })
      .catch((error) => {
        setMsg({
          msg: JSON.stringify(error),
          severity: "error"
        })
      })
      .finally(() => setLoading(false));
          
  });

  
  const handleAddInsumo = (() => {
    if(values.id === '' || values.quantidade === '' || values.quantidade === '0') {
      setMsg({
        msg: "Informe um insumo e sua quantidade.",
        severity: "warning"
      });
    } else {
      setMsg({
        msg: "",
        severity: ""
      });
      const insumoSel = insumos.find(e => e.id === parseInt(values.id, 10));
      
      setItens(old => [...old, {
        id: uuid(),
        cautela: cautela,
        insumo: insumoSel,
        quantidade: parseInt(values.quantidade),
        valor: insumoSel.valor
      }]);

      setValues({
        id: '',
        quantidade: ''
      });
    }
  });
  

  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

  return (
    <form
      autoComplete="off"
      noValidate
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Card>
        <CardHeader
          subheader="Informe os dados e clique no botão salvar."
          title={"Cadastro de cautela de entrega de insumos"}
        />
        {msg.msg && 
            <Alert severity={msg.severity}>{msg.msg}</Alert>}
        <Divider />
        <CardContent>
          <Grid container spacing={3} >
            <Grid item md={8} xs={12}>
              <TextField
                  fullWidth
                  onChange={handleChange}
                  required
                  variant="outlined"
                  select
                  SelectProps={{ native: true }}
                  name="id"
                  label="Insumo"
                  disabled={(loading || (cautelaId !== '0'))}
                  value={values.id}>
                  <option key={''} value={''}></option>
                  {
                    insumos.map((option) =>(
                      <option key={option.id} value={option.id}>{option.descricao}</option>
                    ))
                  }
                
                </TextField>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                  fullWidth
                  onChange={handleChange}
                  required
                  variant="outlined"
                  name="quantidade"
                  label="Quantidade"
                  disabled={(loading || (cautelaId !== '0'))}
                  value={values.quantidade}>
                
                </TextField>
            </Grid>
          </Grid>
          <Grid container spacing={3} >
            <Grid item md={3} xs={12}>
            <Button
                fullWidth
                color="primary"
                variant="contained"
                onClick={handleAddInsumo}
                disabled={(loading || (cautelaId !== '0'))}
              >
                Adicionar
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={3} >
            <Grid item md={12} xs={12}>
              <Box p={2}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Insumo</StyledTableCell>
                      <StyledTableCell align="center">Quantidade</StyledTableCell>
                      <StyledTableCell align="center">Ações</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      itens.map(i => (
                        <TableRow key={i.id}>
                          <TableCell>
                            {i.insumo.descricao}
                          </TableCell>
                          <TableCell align="center">
                            {i.quantidade}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton color="primary" disabled={(loading || (cautelaId !== '0'))}><Delete /></IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={3} >
            <Grid item md={6} xs={12}>
            <TextField
                fullWidth
                name="dataReferencia"
                helperText="Data de referência"
                required
                type="date"
                onChange={handleChange}
                value={values.dataReferencia}
                variant="outlined"
                disabled={(loading || (cautelaId !== '0'))}
              >
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box p={2}>
          <Grid container spacing={3}>
            <Grid item md={3} xs={6}>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                onClick={handleSubmit}
                disabled={(loading || (cautelaId !== '0'))}
              >
                Gravar
              </Button>
            </Grid>
            <Grid item md={3} xs={6}>
              <Button
                fullWidth
                onClick={handleGoBack}
                variant="contained"
                disabled={loading}
              >
                Cancelar
              </Button>
            
            </Grid>
          </Grid>
        </Box>
        {loading &&
          <LinearProgress></LinearProgress>}
      </Card>
    </form>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string
};

export default ProfileDetails;

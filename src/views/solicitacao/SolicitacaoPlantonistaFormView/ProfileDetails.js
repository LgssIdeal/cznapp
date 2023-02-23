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
import {Delete} from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles';
import {Alert} from '@material-ui/lab';
import SolicitacaoPlantonistaService from '../../../services/SolicitacaoPlantonistaService';
import { zonedTimeToUtc, format } from 'date-fns-tz';
import { truncate } from 'lodash';

const useStyles = makeStyles(() => ({
  root: {}
}));

const ProfileDetails = ({ className, contratoId, unidadeId, dataReferencia, solicitacaoId, ...rest }) => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const [error, setError] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loadItens, setLoadItens] = useState(false);
  const [values, setValues] = useState({
    id: 0,
    dataReferencia: dataReferencia,
    usuarioCriacaoId: JSON.parse(localStorage.getItem("@app-user")).id,
    usuarioAlteracaoId: null,
    contratoId: contratoId,
    unidadeId: unidadeId,
    itens: []
  });

  const [campos, setCampos] = useState({
    refeicao: 0,
    quantidade: ''
  });

  const refeicoes = [
    {
      id: 1,
      key: 'DESJEJUM',
      value: 'Desjejum'
    },
    {
      id: 2,
      key: 'LANCHE_1',
      value: 'Colação'
    },
    {
      id: 3,
      key: 'ALMOCO',
      value: 'Almoço'
    },
    {
      id: 4,
      key: 'LANCHE_2',
      value: 'Lanche tarde'
    },
    {
      id: 5,
      key: 'JANTAR',
      value: 'Jantar'
    },
    {
      id: 6,
      key: 'CEIA',
      value: 'Ceia'
    }
  ]

  
  useEffect(() => {
    if(solicitacaoId !== "0") {
      setLoading(true);
      SolicitacaoPlantonistaService.getSolicitacao(solicitacaoId)
        .then((result) => {
          const data = {
            id: result.data.id,
            dataReferencia: format( zonedTimeToUtc(result.data.dataReferencia,'America/Sao_Paulo'), "yyyy-MM-dd"),
            usuarioCriacaoId: result.data.usuarioSolicitacao.id,
            usuarioAlteracaoId: result.data.usuarioAlteracao ? result.data.usuarioAlteracao.id : null,
            contratoId: result.data.contrato.id,
            unidadeId: result.data.unidade.id,
            itens:[]
          }
          setValues(data);
          setLoadItens(true);
        })
        .catch((error) => {
          setError(JSON.stringify(error))
        })
        .finally(() => setLoading(false));
    }
  }, [solicitacaoId]);

  useEffect(() => {

    if(loadItens) {
      setLoading(true);
      SolicitacaoPlantonistaService.getSolicitacaoItens(solicitacaoId)
        .then((result) => {
          let itens = result.data;
          let refs = [];
          for(var i = 0; i < itens.length; i++) {
            const data = {
              refeicao: itens[i].refeicao,
              quantidade: itens[i].quantidade
            }
            refs.push(data);
          }
          setValues({
            ...values,
            itens: refs
          })
          setLoadItens(false);
        })
        .catch((error) => {
          setError(JSON.stringify(error));
        })
        .finally(() => setLoading(false));
    }

  }, [loadItens]);
  

  const handleChange = (event) => {
    setCampos({
      ...campos,
      [event.target.name]: event.target.value
    });
  };


  const handleGoBack = (() => {
    navigate('/app/solicitacoesplantonista/' + contratoId + '/' + unidadeId + '/' + dataReferencia, {replace : true});
  });

  const addItem = (() => {
    if(parseInt(campos.refeicao) === 0) {
      setErrorMsg("Informe a refeição")
    } else {
      if(campos.quantidade === '') {
        setErrorMsg("Informe a quantidade")
      } else {
        if(parseInt(campos.quantidade) === 0) {
          setErrorMsg("Informe a quantidade")
        } else {
          let r = refeicoes.find(f => f.id === parseInt(campos.refeicao));
          let aux = values.itens.find(e => e.refeicao === r.key);
          if(aux) {
            setErrorMsg("Refeição já informada");
          } else {
            let dat = {
              refeicao: refeicoes.find(e => e.id === parseInt(campos.refeicao)).key,
              quantidade: campos.quantidade
            }
            let refs = values.itens;
            refs.push(dat);
            setValues({
              ...values,
              itens: refs
            });
            setErrorMsg("")
            setCampos({
              refeicao: 0,
              quantidade: ''
            });
          }
          
        }
      }
    }
  });

  const handleSubmit = ( () => {
    setLoading(true);
    

    var json = JSON.stringify(values);

    console.log(json);
        
    SolicitacaoPlantonistaService.criaSolicitacao(json)
      .then((result) => {
        alert("Solcitação gravada com sucesso.");
        setLoading(false);
        var url = "/app/solicitacoesplantonista/" + contratoId + "/" + unidadeId + "/" + dataReferencia;
        navigate(url, {replace : true});
      })
      .catch((error) => {
        setLoading(false);
        setError(error.response.data.detail);
      });
    
          
  });

  const handleDelete = ((id) => {
    let index = values.itens.findIndex(e => e.refeicao === id);
    const temp = [...values.itens];
    temp.splice(index, 1);
    setValues({
        ...values,
        itens: temp
      }
    )
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
          subheader="Informe os dados e clique no botão gravar."
          title={"Solicitação de refeição para plantonista - Data: " + format(
            zonedTimeToUtc(
              dataReferencia, 
          'America/Sao_Paulo'), "dd/MM/yyyy")}
        />
        {error && 
                  <Alert severity="error">{error}</Alert>}
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={4} xs={12}>
              <TextField type="hidden" name="id" value={values.id}></TextField>
              <TextField
                  fullWidth
                  onChange={handleChange}
                  required
                  variant="outlined"
                  select
                  SelectProps={{ native: true }}
                  name="refeicao"
                  label="Refeição"
                  disabled={loading}
                  value={campos.refeicao}>
                  <option key={0} value={0}>{'.:Selecione:.'}</option>
                  {
                    
                    refeicoes.map((option) =>(
                      <option key={option.id} value={option.id}>{option.value}</option>
                    ))
                  }
                
                </TextField>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="Quantidade"
                name="quantidade"
                helperText="Informe a quantidade de refeições"
                onChange={handleChange}
                required
                value={campos.quantidade}
                variant="outlined"
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                onClick={addItem}
                disabled={loading}
              >
                Adicionar
              </Button>
            </Grid>
            <Grid item md={12} xs={12}>
              {errorMsg &&
                  <Alert severity="error">{errorMsg}</Alert>}
            </Grid>
          </Grid>
          <Divider />
          <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">
                      Refeição
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Quantidade
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Ações
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    values.itens.length === 0 ?
                      <TableRow>
                        <TableCell colSpan="3">Sem itens adicionados</TableCell>
                      </TableRow> :
                      values.itens.map(i => (
                        <TableRow>
                          <TableCell align="center">{refeicoes.find(e => e.key === i.refeicao).value}</TableCell>
                          <TableCell align="center">{i.quantidade}</TableCell>
                          <TableCell align="center">
                            <IconButton
                              title="Excluir refeição" color="primary"
                              onClick={(event) => handleDelete(i.refeicao)}>
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                  }
                </TableBody>
              </Table>
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
                disabled={loading}
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

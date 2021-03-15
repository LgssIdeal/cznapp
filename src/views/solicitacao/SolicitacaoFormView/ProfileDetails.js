import { v4 as uuid } from 'uuid';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles,
  LinearProgress,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {ControlPointDuplicateRounded, Delete} from '@material-ui/icons'
import 'react-confirm-alert/src/react-confirm-alert.css';
import {Alert} from '@material-ui/lab';
import ClinicaService from '../../../services/ClinicaService';
import ContratoService from '../../../services/ContratoService';
import UnidadeService from '../../../services/UnidadeService';
import TipoDietaService from '../../../services/TipoDietaService';
import TipoDietaComplementarService from '../../../services/TipoDietaComplementarService';
import { validateYupSchema } from 'formik';
import SolicitacaoService from '../../../services/SolicitacaoService';

const useStyles = makeStyles(() => ({
  root: {}
}));

const ProfileDetails = ({ className, contratoId, unidadeId, clinicaId, refeicao, dataReferencia, ...rest }) => {

  const navigate = useNavigate();
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [contratoSel, setContratoSel] = useState({
    numero: ''
  });
  const [unidadeSel, setUnidadeSel] = useState( {
    descricao: '',
    sigla: ''
  });
  const [clinicaSel, setClinicaSel] = useState({
    descricao: '',
    sigla: ''
  });
  const [error, setError] = useState("");
  const [errorExtra, setErrorExtra] = useState("");
  const [invalidateToken, setInvalidateToken] = useState();

  const [values, setValues] = useState({
    contrato: contratoId,
    unidade: unidadeId,
    clinica: clinicaId,
    refeicao: refeicao,
    dataReferencia: dataReferencia
  });

  const [valuesExtras, setValuesExtra] = useState({
    tipoDieta: '',
    tipoDietaLabel: '',
    tipoDietaComplementar: '',
    tipoDietaComplementarLabel: '',
    qt: ''
  })

  const [tiposDieta, setTiposDieta] = useState([]);
  const [tiposDietaComplementar, setTiposDietaComplementar] = useState([]);
  const [extras, setExtras] = useState([]);

  const map = new Map();
  map.set("DESJEJUM", "Desjejum");
  map.set("LANCHE_1", "Lanche 1");
  map.set("ALMOCO", "Almoço");
  map.set("LANCHE_2", "Lanche 2");
  map.set("JANTAR", "Jantar");
  map.set("CEIA", "Ceia");

  const mapTipoDieta = new Map();
  const mapTipoDietaComplementar = new Map();

  useEffect(() => {
    setLoading(true);
    TipoDietaService.getTiposDietaList()
      .then((result) => {
        setTiposDieta(result.data);
      })
      .catch((error) => {
        if(error.response) {
          setError(error.response.data.detail);
        } else {
          var e = JSON.stringify(error);
          if(e.includes("401")) {
            navigate("/", {replace: true})
          } else {
            setError(e);
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if(valuesExtras.tipoDieta) {
      setLoading(true);
      TipoDietaComplementarService.getTiposDietaComplementarList(valuesExtras.tipoDieta)
        .then((result) => {
          setTiposDietaComplementar(result.data);
        })
        .catch((error) => {
          if(error.response) {
            setError(error.response.data.detail);
          } else {
            var e = JSON.stringify(error);
            if(e.includes("401")) {
              navigate("/", {replace: true})
            } else {
              setError(e);
            }
          }
        })
        .finally(() => setLoading(false));
    }
    
  }, [valuesExtras.tipoDieta]);

  useEffect(() => {
    setLoading(true);
    ContratoService.getContrato(values.contrato)
      .then((result) => {
        setContratoSel(result.data)
      })
      .catch((error) => {
        if(error.response) {
          setError(error.response.data.detail);
        } else {
          var e = JSON.stringify(error);
          if(e.includes("401")) {
            navigate("/", {replace: true})
          } else {
            setError(e);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [values.contrato]);

  useEffect(() => {
    setLoading(true);
    UnidadeService.getUnidade(values.unidade)
      .then((result) => {
        setUnidadeSel(result.data)
      })
      .catch((error) => {
        if(error.response) {
          setError(error.response.data.detail);
        } else {
          var e = JSON.stringify(error);
          if(e.includes("401")) {
            navigate("/", {replace: true})
          } else {
            setError(e);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [values.unidade]);

  useEffect(() => {
    setLoading(true)
    ClinicaService.getClinica(values.clinica)
      .then((result) => {
        setClinicaSel(result.data)
      })
      .catch((error) => {
        console.log("ERROR", error)
        if(error.response) {
          setError(error.response.data.detail);
        } else {
          var e = JSON.stringify(error);
          if(e.includes("401")) {
            navigate("/", {replace: true})
          } else {
            setError(e);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [values.clinica]);

  const handleChange = (event) => {
    console.log("Evet: ", event.target.options[event.target.options.selectedIndex].label);
    setValuesExtra({
      ...valuesExtras,
      [event.target.name]: event.target.value,
      [event.target.name+'Label']: event.target.options[event.target.options.selectedIndex].label
    });
  };

  const handleQtChanged = (event) => {
    setValuesExtra({
      ...valuesExtras,
      [event.target.name]: event.target.value
    });
  }
  
  const handleSubmit = ( () => {
    setLoading(true);
    const data = {
      contratoId: values.contrato,
      unidadeId: values.unidade,
      clinicaId: values.clinica,
      usuarioId: JSON.parse(localStorage.getItem("@app-user")).id,
      dataReferencia: values.dataReferencia,
      refeicao: values.refeicao,
      extras: extras
    }
    var json = JSON.stringify(data);
    SolicitacaoService.criaSolicitacao(json)
      .then((result) => {
        alert("Solicitação criada");
        navigate("/app/solicitacoes/" + contratoId + "/" + unidadeId + "/" + clinicaId + "/" + refeicao + "/" + dataReferencia, {replace: true});    
      })
      .catch((error) => {
        console.log("ERROR", error);
        if(error.response) {
          setError(error.response.data.detail);
        } else {
          var e = JSON.stringify(error);
          if(e.includes("401")) {
            navigate("/", {replace: true})
          } else {
            setError(e);
          }
        }
      })
      .finally(() => setLoading(false));
  });

  const handleCancelar = (() => {
    navigate("/app/solicitacoes/" + contratoId + "/" + unidadeId + "/" + clinicaId + "/" + refeicao + "/" + dataReferencia, {replace: true});
  })

  const handleAddExtra = (() => {
    if((valuesExtras.tipoDieta === '') || (valuesExtras.qt === '' || valuesExtras.qt === '0')) {
      setErrorExtra("Informe tipo da dieta e a quantidade");
    } else {
      var achou = false;
      for(var i = 0; i < extras.length;i++ ) {
        if(extras[i].tipoDieta === valuesExtras.tipoDieta && extras[i].tipoDietaComplementar === valuesExtras.tipoDietaComplementar) {
          achou = true;
        }
      }
      if(achou) {
        setErrorExtra("Tipo de dieta e complemento já informado");
      } else {
        setErrorExtra("");
        setExtras(oldArray => [...oldArray, {
          id: uuid(),
          tipoDieta: valuesExtras.tipoDieta,
          tipoDietaLabel: valuesExtras.tipoDietaLabel,
          tipoDietaComplementar: valuesExtras.tipoDietaComplementar,
          tipoDietaComplementarLabel: valuesExtras.tipoDietaComplementarLabel,
          qt: valuesExtras.qt
        }]);
        setValuesExtra({
          tipoDieta: '',
          tipoDietaLabel: '',
          tipoDietaComplementar: '',
          tipoDietaComplementarLabel: '',
          qt: ''
        })
      }
      
    }
    
  });

  const handleDeleteExtra = (id) => {
    var index;
    console.log(extras.length);
    for(var i = 0; i < extras.length; i++) {
      if(extras[i].id === id)  {
        console.log("achou")
        index = i;
        break;
      }
    }
    const temp = [...extras];
    temp.splice(index, 1);
    setExtras(temp);
    
  }

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
          subheader="Confira os dados e confirme. Caso deseje refeições extras, informe o tipo da dieta e a quantidade"
          title="Nova solicitação"
        />
        {error && 
          <Alert severity="error">{error}</Alert>}
        <Divider />
        <CardContent>
          <Grid container spacing={2} direction="column">
            <Grid item md={12} xs={12}>
              <Typography variant="body1">{'Contrato: ' + contratoSel.numero}</Typography>
            </Grid>
          
            <Grid item md={12} xs={12} >
              <Typography variant="body1">{'Unidade: ' + unidadeSel.descricao + ' (' + unidadeSel.sigla + ')'}</Typography>
            </Grid>
          
            <Grid item md={12} xs={12}>
              <Typography variant="body1">{'Clínica: ' + clinicaSel.descricao + ' (' + clinicaSel.sigla + ')'}</Typography>
            </Grid>

            <Grid item md={12} xs={12}>
              <Typography variant="body1">{'Refeição: ' + map.get(values.refeicao)}</Typography>
            </Grid>

            <Grid item md={12} xs={12}>
              <Typography variant="body1">{'Data de referência: ' + values.dataReferencia}</Typography>
            </Grid>
          </Grid>
          <Divider />
          <Grid container spacing={2} direction="row">
            <Grid item md={12} xs={12}>
              <Typography variant="body1">Informe refeições extras</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} direction="row">
            <Grid item md={12} xs={12}>
              {errorExtra && 
                <Alert severity="error">{errorExtra}</Alert>}
            </Grid>
          </Grid>
          <Grid container spacing={2} direction="row">
            <Grid item md={3} xs={3}>
              <TextField
                fullWidth
                onChange={handleChange}
                required
                variant="outlined"
                select
                SelectProps={{ native: true }}
                name="tipoDieta"
                label="Tipo da dieta"
                disabled={loading}
                value={valuesExtras.tipoDieta}>
                <option key={''} value={''}>{''}</option>
                {
                  tiposDieta.map((option) =>(
                    <option key={option.id} value={option.id} label={option.sigla}>{option.sigla}</option>
                  ))
                 }
              </TextField>
            </Grid>
            <Grid item md={3} xs={3}>
              <TextField
                fullWidth
                onChange={handleChange}
                required
                variant="outlined"
                select
                SelectProps={{ native: true }}
                name="tipoDietaComplementar"
                label="Complemento"
                disabled={loading}
                value={valuesExtras.tipoDietaComplementar}>
                <option key={''} value={''}>{''}</option>
                {
                  tiposDietaComplementar.map((option) =>(
                    <option key={option.id} value={option.id} >{option.sigla}</option>
                  ))
                 }
              </TextField>
            </Grid>
            <Grid item md={3} xs={3}>
            <TextField
                fullWidth
                onChange={handleQtChanged}
                required
                variant="outlined"
                name="qt"
                label="Quantidade"
                disabled={loading}
                value={valuesExtras.qt}></TextField>
            </Grid>
            <Grid item md={3} xs={3}>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                onClick={handleAddExtra}
                disabled={loading}>
                Ok
              </Button>
            
            </Grid>
          </Grid>
          <Grid container spacing={2} direction="row">
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Tipo dieta</StyledTableCell>
                  <StyledTableCell>Quantidade</StyledTableCell>
                  <StyledTableCell>Ações</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {extras.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>{e.tipoDietaLabel + (e.tipoDietaComplementarLabel && '/' + e.tipoDietaComplementarLabel)}</TableCell>
                    <TableCell>{e.qt}</TableCell>
                    <TableCell>
                      <Typography>
                          <IconButton
                            title="Excluir refeição" color="primary"
                            onClick={(event) => handleDeleteExtra(e.id)}>
                            <Delete />
                          </IconButton>
                        </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
          <Grid container spacing={2} direction="row">
            <Grid item md={6} xs={6}>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}>
                Ok
              </Button>
            </Grid>
            <Grid item md={6} xs={6}>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                onClick={handleCancelar}
                disabled={loading}>
                Cancelar
              </Button>
            </Grid>
          </Grid>
          {loading && 
            <LinearProgress></LinearProgress>}
        </CardContent>
      </Card>
      
    </form>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string
};

export default ProfileDetails;

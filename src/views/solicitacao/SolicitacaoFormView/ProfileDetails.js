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
  IconButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormLabel,
  FormControl
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {Delete} from '@material-ui/icons'
import 'react-confirm-alert/src/react-confirm-alert.css';
import {Alert} from '@material-ui/lab';
import { zonedTimeToUtc, format, utcToZonedTime } from 'date-fns-tz';
import ClinicaService from '../../../services/ClinicaService';
import ContratoService from '../../../services/ContratoService';
import UnidadeService from '../../../services/UnidadeService';
import TipoDietaService from '../../../services/TipoDietaService';
import TipoDietaComplementarService from '../../../services/TipoDietaComplementarService';
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
  const [tpsComp, setTpsComp] = useState([]);
  const [refsDisp, setRefsDisp] = useState([]);
  const [refsDispSel, setRefsDispSel] = useState([]);

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
      setTpsComp([]);
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


  useEffect(() => {
    if(tiposDietaComplementar) {
      for(var i = 0; i < tiposDietaComplementar.length; i++) {
        const value = {
          id: tiposDietaComplementar[i].id + '',
          descricao: tiposDietaComplementar[i].descricao,
          sigla: tiposDietaComplementar[i].sigla,
          selecionado: false
        }
        setTpsComp(old => [...old, value]);
      }
    }
  }, [tiposDietaComplementar]);

  useEffect(() => {
    setLoading(true);
    SolicitacaoService.getRefeicoesDisponiveis(dataReferencia)
      .then((result) => {
        setRefsDisp(result.data);
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
  }, [dataReferencia]);

  useEffect(() => {
    setRefsDispSel([]);
    if(refsDisp) {
      for(var i = 0; i < refsDisp.length; i++) {
        const v = {
          refeicao: refsDisp[i].refeicao,
          referencia: refsDisp[i].referencia,
          selecionado: true
        };
        setRefsDispSel(old => [...old, v]);
      }
    }
  }, [refsDisp]);

  const handleChange = (event) => {
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

    const refeicoesSel = refsDispSel.filter(function (element) {
      return element.selecionado;
    });
    

    /*
    var refeicoes = new Array();
    for (var i = 0; i < refeicoesSel.length; i++) {
      refeicoes.push(refeicoesSel[i].refeicao);
    }
    */

    var ext = new Array();
    for(var i = 0; i < extras.length; i++) {
      var comps = new Array();
      if(extras[i].tipoDietaComplementar) {
        for(var j = 0; j < extras[i].tipoDietaComplementar.length; j++) {
          comps.push(extras[i].tipoDietaComplementar[j].id);
        }
      }

      var item = {
        tipoDieta: extras[i].tipoDieta,
        tipoDietaComplementar: comps,
        qt: extras[i].qt
      }

      ext.push(item);
    }

    const data = {
      contratoId: values.contrato,
      unidadeId: values.unidade,
      clinicaId: values.clinica,
      usuarioId: JSON.parse(localStorage.getItem("@app-user")).id,
      dataReferencia: values.dataReferencia,
      refeicoes: refeicoesSel,
      extras: ext
    }

    var json = JSON.stringify(data);

    SolicitacaoService.criaSolicitacao(json)
      .then((result) => {
        alert("Solicitação criada");
        navigate("/app/solicitacoes/" + contratoId + "/" + unidadeId + "/" + clinicaId + "/" + dataReferencia, {replace: true});    
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
      
  });

  const handleCancelar = (() => {
    navigate("/app/solicitacoes/" + contratoId + "/" + unidadeId + "/" + clinicaId + "/" + dataReferencia, {replace: true});
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
          tipoDietaComplementar: tpsComp.filter(function (item)  {
                                    return item.selecionado;}),
          qt: valuesExtras.qt
        }]);
        setValuesExtra({
          tipoDieta: '',
          tipoDietaLabel: '',
          tipoDietaComplementar: '',
          tipoDietaComplementarLabel: '',
          qt: ''
        })
        setTpsComp([]);
      }
      
    }
    
  });

  const handleDeleteExtra = (id) => {
    var index;
    for(var i = 0; i < extras.length; i++) {
      if(extras[i].id === id)  {
        index = i;
        break;
      }
    }
    const temp = [...extras];
    temp.splice(index, 1);
    setExtras(temp);
    
  }

  const handleCheckTpDietaComplementar = (event) => {
    let tipos = [...tpsComp];
    for(var i = 0; i < tipos.length; i++) {
      if(tipos[i].id === event.target.id) {
        tipos[i].selecionado = event.target.checked;
      }
    }
    setTpsComp(tipos);
  }

  const handleCheckRefeicao = (event) => {
    let refs = [...refsDispSel];
    for(var i = 0; i < refs.length; i++) {
      if(refs[i].refeicao === event.target.id) {
        refs[i].selecionado = event.target.checked;
      }
    }
    setRefsDispSel(refs);
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
          <Grid container spacing={2} direction="row">
            <Grid item md={3} xs={3}>
              <Typography variant="body1">{'Contrato: '}</Typography>
            </Grid>
            <Grid item md={9} xs={9}>
              <Typography variant="body1">{contratoSel.numero}</Typography>
            </Grid>

            <Grid item md={3} xs={3} >
              <Typography variant="body1">{'Unidade: '}</Typography>
            </Grid>
            <Grid item md={9} xs={9} >
              <Typography variant="body1">{unidadeSel.descricao + ' (' + unidadeSel.sigla + ')'}</Typography>
            </Grid>

            <Grid item md={3} xs={3}>
              <Typography variant="body1">{'Clínica: '}</Typography>
            </Grid>
            <Grid item md={9} xs={9}>
              <Typography variant="body1">{clinicaSel.descricao + ' (' + clinicaSel.sigla + ')'}</Typography>
            </Grid>
            <Grid item md={3} xs={3}>
              <Typography variant="body1">{'Data de referência:'}</Typography>
            </Grid>
            <Grid item md={9} xs={9}>
              <Typography variant="body1">{format(
                            zonedTimeToUtc(
                            values.dataReferencia, 
                          'America/Sao_Paulo'), "dd/MM/yyyy")}</Typography>
            </Grid>
            <Grid item md={3} xs={3}>
              <Typography>{'Refeições: '}</Typography>
            </Grid>
            <Grid item md={9} xs={9}>
                
                <FormGroup>
                {
                  refsDispSel.map(r => (
                    <FormControlLabel
                      control={<Checkbox
                                color="primary"
                                key={r.refeicao}
                                id={r.refeicao}
                                checked={r.selecionado} 
                                onChange={handleCheckRefeicao}/>}
                    label={map.get(r.refeicao) + ' ['  + format(
                      utcToZonedTime(
                      r.referencia, 
                    'UTC'), "dd/MM/yyyy") + ']'} />
                  ))
                }
                </FormGroup>

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
            <Grid item md={2} xs={2}>
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
            <Grid item md={6} xs={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Tipos de dieta complementar</FormLabel>
                <FormGroup row>
                {
                  tpsComp.map((option) =>(
                    <FormControlLabel
                      control={<Checkbox
                                  color="primary"
                                  key={option.id}
                                  id={option.id}
                                  checked={option.selecionado} 
                                  onChange={handleCheckTpDietaComplementar}/>}
                      label={option.sigla} />
                  ))
                }
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid item md={2} xs={2}>
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
            <Grid item md={2} xs={2}>
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
            <Grid item md={12} xs={12}>
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
                      <TableCell>{e.tipoDietaLabel + ' '}{e.tipoDietaComplementar.map(c => (' ' + c.sigla))}</TableCell>
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
          </Grid>
          <Grid container spacing={2} direction="row">
            <Divider />
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

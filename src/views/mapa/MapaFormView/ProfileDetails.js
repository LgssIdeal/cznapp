import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  FormLabel,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {Alert} from '@material-ui/lab';
import {Delete} from '@material-ui/icons'
import MapaService from '../../../services/MapaService';
import TipoDietaService from '../../../services/TipoDietaService';
import TipoDietaComplementarService from '../../../services/TipoDietaComplementarService';
import ClinicaService from '../../../services/ClinicaService';
import SuplementoService from '../../../services/SuplementoService';
import moment from 'moment';
import { ContactSupportOutlined } from '@material-ui/icons';
import { ref } from 'yup';

const listIdentificacao = [
  {
    id: 'RG',
    label: 'RG'
  },
  {
    id: 'CPF',
    label: 'CPF'
  },
  {
    id: 'CARTAO_SUS',
    label: 'Nro. cartão SUS'
  }
];


const useStyles = makeStyles(() => ({
  root: {}
}));

const ProfileDetails = ({ className, clinicaId, mapaId, ...rest }) => {

  const navigate = useNavigate();
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [errorSup, setErrorSup] = useState("");
  const [tiposDieta, setTiposDieta] = useState([]);
  const [tiposDietaComp, setTiposDietaComp] = useState([]);
  const [tiposDietaAcomp, setTiposDietaAcomp] = useState([]);
  const [tiposDietaCompAcomp, setTiposDietaCompAcomp] = useState([]);
  const [itensSup, setItensSup] = useState([]);
  const [suplementos, setSuplementos] = useState([]);
  const [refeicoes, setRefeicoes] = useState([
    {
      refeicao: 'Desjejum',
      sel: false
    },
    {
      refeicao: 'Lanche 1',
      sel: false
    },
    {
      refeicao: 'Almoço',
      sel: false
    },
    {
      refeicao: 'Lanche 2',
      sel: false
    },
    {
      refeicao: 'Jantar',
      sel: false
    },
    {
      refeicao: 'Ceia',
      sel: false
    }
  ]);
  const [clinicaSel, setClinicaSel] = useState({
    id: '',
    descricao: '',
    sigla: '',
    permiteAcompanhante: false
  });
  const [mapaSel, setMapaSel] = useState({
    id: 0,
    clinica: clinicaId,
    leito: '',
    paciente: '',
    tipoDieta: 0,
    tiposDietaComplementar: [],
    tipoDietaAcomp: 0,
    tiposDietaComplementarAcomp: [],
    dieta: '',
    observacoes: '',
    idade: ''
  });

  const userId = JSON.parse(localStorage.getItem("@app-user")).id;
  //const [values, setValues] = useState();
  
  const [values, setValues] = useState({
    id: 0,
    clinica: clinicaId,
    leito: '',
    paciente: '',
    tipoDieta: 0,
    tiposDietaComplementar: [],
    tipoDietaAcomp: 0,
    tiposDietaComplementarAcomp: [],
    dieta: '',
    observacoes: '',
    idade: ''
  });

  const [valueSup, setValueSup] = useState({
    supId: 0
  });

  const map = new Map();
  map.set("DESJEJUM", "Desjejum");
  map.set("LANCHE_1", "Lanche 1");
  map.set("ALMOCO", "Almoço");
  map.set("LANCHE_2", "Lanche 2");
  map.set("JANTAR", "Jantar");
  map.set("CEIA", "Ceia");

  /* Utilizado para os checkbox dinâmicos para seleção das dietas complementares
    {
      id: id do tipo de dieta complementar
      descricao: descrição do tipo de dieta complementar
      sigla: sigla do tipo de dieta complementar
      selecionado: atributo que indica se o valor está selecionado ou não (true ou false)
    }
    Será atualizado no effect disparado quando carregados os tipos de dieta complementares da dieta selecionada
   */
  const [tpsComp, setTpsComp] = useState([]);
  const [tpsCompAcomp, setTpsCompAcomp]= useState([]);

  /**********************************************/
  /*           Effects and functions            */
  /**********************************************/

  useEffect(() => {

    if(mapaId !== "0") {
      MapaService.getMapa(mapaId)
      .then((result) => {
        // grava o retorno do serviço para setar os campos
        setMapaSel(result.data);

        // lógica para montar a tabela de suplementos
        if(result.data.suplementos) {
          let aux = [];

          for(var i = 0; i < result.data.suplementos.length; i++) {
            let refs= [];
            for(var j = 0; j < result.data.suplementos[i].refeicoes.length; j++) {
              const r = {
                refeicao: map.get(result.data.suplementos[i].refeicoes[j].refeicao),
                sel: true
              }
              refs.push(r);
            }
            const s = {
              suplemento : result.data.suplementos[i].suplemento,
              refeicoes: refs
            }
            aux.push(s);
          }
          setItensSup(aux);
        }
      })
      .catch((error) => {
        setError(JSON.stringify(error));
        setValues({
          id: 0,
          clinica: clinicaId,
          leito: '',
          paciente: '',
          tipoDieta: 0,
          tiposDietaComplementar: [],
          tipoDietaAcomp: 0,
          tiposDietaComplementarAcomp: [],
          dieta: '',
          observacoes: '',
          idade: ''
        });

          
      });
    }
    
    
  },[mapaId])

  useEffect(() => {
    setLoading(true);
    setTpsComp([]);
    
    setValues({
      id: mapaSel.id,
      clinica: clinicaId,
      leito: mapaSel.leito,
      paciente: mapaSel.paciente,
      tipoDieta: mapaSel.tipoDieta.id,
      tiposDietaComplementar: mapaSel.tiposDietaComplementar.length > 0 ? mapaSel.tiposDietaComplementar : [],
      tipoDietaAcomp: mapaSel.tipoDietaAcomp ? mapaSel.tipoDietaAcomp.id : 0,
      tiposDietaComplementarAcomp: mapaSel.tiposDietaComplementarAcomp.length > 0 ? mapaSel.tiposDietaComplementarAcomp : [],
      dieta: mapaSel.dieta,
      observacoes: mapaSel.observacoes,
      idade: mapaSel.idade
    });

    TipoDietaService.getTiposDietaList()
      .then((result) => {
        setLoading(false);
        setTiposDieta(result.data);
        setTiposDietaAcomp(result.data);
      })
      .catch((error) => {
        if(error.response.data) {
          setError(error.response.data.detail);
        } else {
          if(JSON.stringify(error).includes("401")) {
            navigate("/", {});
          } else {
            setError(JSON.stringify(error));
          }
        }
      });
    
  }, [mapaSel]);

  useEffect(() => {
    if(values.tipoDieta) {
      setLoading(true);
      TipoDietaComplementarService.getTiposDietaComplementarList(values.tipoDieta)
        .then((result) => {
          setLoading(false);
          setTiposDietaComp(result.data);
        })
        .catch((error) => {
          setLoading(false);
          
          if(error.response) {
            if(error.response.data.status !== 404 && error.response.data.status !== 400) {
              setError(error.response.data.detail);
            }
          } else {
            var e = JSON.stringify(error);
            if(e.includes("401")) {
              navigate("/", {});
            } else {
              if(e.includes("404")) {
                setTiposDietaComp([]);
              } else {
                setError(JSON.stringify(error));
              }
              
            }
          }
        });
    } else {
      setTiposDietaComp([]);
    }
    setTpsComp([]);
    
  }, [values.tipoDieta]);

  useEffect(() => {
    if(values.tipoDietaAcomp) {
      setLoading(true);
      TipoDietaComplementarService.getTiposDietaComplementarList(values.tipoDietaAcomp)
        .then((result) => {
          setLoading(false);
          setTiposDietaCompAcomp(result.data);
        })
        .catch((error) => {
          setLoading(false);
          
          if(error.response) {
            if(error.response.data.status !== 404 && error.response.data.status !== 400) {
              setError(error.response.data.detail);
            }
          } else {
            var e = JSON.stringify(error);
            if(e.includes("401")) {
              navigate("/", {});
            } else {
              if(e.includes("404")) {
                setTiposDietaCompAcomp([]);
              } else {
                setError(JSON.stringify(error));
              }
              
            }
          }
        });
    } else {
      setTiposDietaCompAcomp([]);
    }
    setTpsCompAcomp([]);
  }, [values.tipoDietaAcomp])

  /* Effect para carregamento dos tipos de dieta complementares e indicação de quais estão selecionados */
  useEffect(() => {
    if(tiposDietaComp) {
      if(mapaSel.tiposDietaComplementar) {
        for(var i = 0; i < tiposDietaComp.length; i++) {
          var achou = false;
          

          if(mapaSel.tiposDietaComplementar.find(element => element.id === tiposDietaComp[i].id)) {
            achou = true;
          }
          
          const value = {
            id: tiposDietaComp[i].id,
            descricao: tiposDietaComp[i].descricao,
            sigla: tiposDietaComp[i].sigla,
            selecionado : achou
          }

          setTpsComp(old => [...old, value]);
        }
      }
    }
  }, [tiposDietaComp]);

  useEffect(() => {
    if(tiposDietaCompAcomp) {
      if(mapaSel.tiposDietaComplementarAcomp) {
        for(var i = 0; i < tiposDietaCompAcomp.length; i++) {
          var achou = false;
          

          if(mapaSel.tiposDietaComplementarAcomp.find(element => element.id === tiposDietaCompAcomp[i].id)) {
            achou = true;
          }
          
          const value = {
            id: tiposDietaCompAcomp[i].id,
            descricao: tiposDietaCompAcomp[i].descricao,
            sigla: tiposDietaCompAcomp[i].sigla,
            selecionado : achou
          }

          setTpsCompAcomp(old => [...old, value]);
        }
      }
    }
  }, [tiposDietaCompAcomp]);
  

  useEffect(() => {
    setLoading(true);
    ClinicaService.getClinica(clinicaId)
      .then((result) => {
        setClinicaSel(result.data);
      })
      .catch((error) => {
        if(error.response.data) {
          setError(error.response.data.detail);
        } else {
          var e = JSON.stringify(error);
          setError(e);
        }
      })
      .finally(() => setLoading(false));
  }, [clinicaId])

  useEffect(() => {
    setLoading(true)
    SuplementoService.getSuplementosList()
      .then((result) => {
        setSuplementos(result.data);
      })
      .catch((error) => {
        setError(JSON.stringify(error))
      })
      .finally(() => setLoading(false));
  }, [])

  const handleTipoDietaChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
      tipoDietaComplementar: 0
    });
  };

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleSupChange = (event) => {
    setValueSup({
      ...valueSup,
      [event.target.name]: event.target.value
    });
  };


  const handleTipoDietaAcompChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleCheckTpDietaComplementar = (event) => {
    
    let tipos = [...tpsComp];
    for(var i = 0; i < tipos.length; i++) {
      if(tipos[i].id === parseInt(event.target.id)) {
        tipos[i].selecionado = event.target.checked;
      }
    }
    setTpsComp(tipos);
  }

  const handleCheckTpDietaComplementarAcomp = (event) => {
    let tipos = [...tpsCompAcomp];
    for(var i = 0; i < tipos.length; i++) {
      if(tipos[i].id === parseInt(event.target.id)) {
        tipos[i].selecionado = event.target.checked;
      }
    }
    setTpsCompAcomp(tipos);
  }

  const handleRefeicaoCheck = (event) => {
    let refs = [...refeicoes];
    for(var i = 0; i < refs.length; i++) {
      if(refs[i].refeicao === event.target.id) {
        refs[i].sel = event.target.checked;
      }
    }
    setRefeicoes(refs);
  }

  const handleAddSuplemento = () => {
    setErrorSup("")
    if(parseInt(valueSup.supId) === 0) {
      setErrorSup("Informe o suplemento")
    } else {
      var sel = false;
      for(var i = 0; i < refeicoes.length; i++) {
        if(refeicoes[i].sel) {
          sel = true;
        }
      }
      if(!sel) {
        setErrorSup("Informe ao menos uma refeição")
      } else {
        const sup = suplementos.find(e => e.id === parseInt(valueSup.supId));
        const refs = refeicoes.filter(function (e) {
          return e.sel;
        });
        const data = {
          suplemento: sup,
          refeicoes: refs
        }
        setItensSup(old => [...old, data]);
        const r = [
          {
            refeicao: 'Desjejum',
            sel: false
          },
          {
            refeicao: 'Lanche 1',
            sel: false
          },
          {
            refeicao: 'Almoço',
            sel: false
          },
          {
            refeicao: 'Lanche 2',
            sel: false
          },
          {
            refeicao: 'Jantar',
            sel: false
          },
          {
            refeicao: 'Ceia',
            sel: false
          }
        ];
        const v = {supId: 0};

        setValueSup(v);
        setRefeicoes(r);

      }
    }
  }

  const handleDelete = ((supId) => {
    
    //console.log("Indice: ", itensSup.findIndex(e => e.suplemento.id === supId));
    let index = itensSup.findIndex(e => e.suplemento.id === supId);
    const temp = [...itensSup];
    temp.splice(index, 1);
    setItensSup(temp);
    
  });


  const handleGoBack = (() => {
    navigate('/app/mapas/' + clinicaId, {replace : true});
  });

  const handleSubmit = ( () => {
    
    
    setLoading(true);

    let tpCompSel = [];
    let tpCompAcompSel = [];
    let aux = [...tpsComp];
    let aux1 = [...tpsCompAcomp];

    for(var i = 0; i < aux.length; i++) {
      if(aux[i].selecionado) {
        tpCompSel.push(aux[i].id);
      }
    }

    for(var i = 0; i < aux1.length; i++) {
      if(aux1[i].selecionado) {
        tpCompAcompSel.push(aux1[i].id);
      }
    }

    let suplementos = [];
    if(itensSup.length > 0) {
      
      for(var s = 0; s < itensSup.length; s++) {
        let ref = [];
        for(var p = 0; p < itensSup[s].refeicoes.length; p++) {
          ref.push(itensSup[s].refeicoes[p].refeicao);
        }
        let data = {
          suplementoId : itensSup[s].suplemento.id,
          refeicoes: ref
        }
        suplementos.push(data);
      }
    }

    const requestData = {
      mapaId: values.id,
      clinicaId: values.clinica,
      leito: values.leito,
      paciente: values.paciente,
      tipoDietaId: values.tipoDieta,
      tiposDietaComplemetarId: tpCompSel,
      tipoDietaAcompId: values.tipoDietaAcomp,
      tiposDietaComplementarAcompId: tpCompAcompSel,
      observacoes: values.observacoes,
      usuarioId: userId,
      idade: values.idade,
      suplementos: suplementos
    };

    const json = JSON.stringify(requestData);



    /*
    const params = new URLSearchParams();
    params.append('mapaId', values.id);
    params.append('clinicaId', values.clinica);
    params.append('leito', values.leito);
    params.append('paciente', values.paciente);
    params.append('tipoDietaId', values.tipoDieta);
    params.append('tiposDietaComplemetarId', tpCompSel);
    params.append('tipoDietaAcompId', values.tipoDietaAcomp);
    params.append('tiposDietaComplementarAcompId', tpCompAcompSel);
    params.append('observacoes', values.observacoes);
    params.append('usuarioId', userId);
    params.append('idade', values.idade);
    params.append('suplementos', suplementos);
    */

    
    MapaService.criaMapa(json)
      .then((result) => {
        alert("Alteração gravada com sucesso");
        setLoading(false);
        navigate("/app/mapas/" + clinicaId, {});
      })
      .catch((error) => {
        setLoading(false);
        if(error.response.data) {
          setError(error.response.data.detail);
        } else {
          if(JSON.stringify(error).includes("401")) {
            navigate("/",{});
          } else {
            setError(JSON.stringify(error));
          }
        }
      });
    
    
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
          title="Alteração do mapa de pacientes"
        />
        {error && 
          <Alert severity="error">{error}</Alert>}
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
            direction="column"
          >
            <Grid
              item
              md={3}
              xs={3}
            >
              <TextField
                fullWidth
                helperText="Informe o leito"
                label="Leito"
                name="leito"
                onChange={handleChange}
                required
                value={values.leito}
                variant="outlined"
              >
              </TextField>
            </Grid>
            <Grid
              item
              md={9}
              xs={9}
            >
              <TextField type="hidden" name="id" value={values.id}></TextField>
              <TextField type="hidden" name="clinica" value={values.clinica}></TextField>
              <TextField
                fullWidth
                helperText="Informe o nome do paciente"
                label="Paciente"
                name="paciente"
                onChange={handleChange}
                required
                value={values.paciente}
                variant="outlined"
              >
              </TextField>
            </Grid>
            <Grid
              item
              md={3}
              xs={12}
            >
              
              <TextField
                fullWidth
                
                name="idade"
                helperText="Informe a idade do paciente"
                onChange={handleChange}
                required
                value={values.idade}
                variant="outlined"
              >
              </TextField>  
            </Grid>
            
          </Grid>
          <Card>
            <CardHeader title="Dieta" subheader="Informe a dieta do paciente"></CardHeader>
            <Divider />
            <CardContent>
            <Grid container spacing={3}>
                
                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <TextField
                    fullWidth
                    label="Tipo de dieta"
                    name="tipoDieta"
                    required
                    helperText="Informe o tipo de dieta"
                    onChange={handleTipoDietaChange}
                    value={values.tipoDieta}
                    variant="outlined"
                    select
                    SelectProps={{ native: true }}
                  >
                    <option value={0}></option>
                    {
                      tiposDieta.map((option) =>(
                        <option key={option.id} value={option.id}>{option.sigla}</option>
                      ))
                    }
                  </TextField>
                </Grid>
                <Grid
                  item
                  md={12}
                  xs={12}
                >   
                <FormControl component="fieldset" variant="standard">
                  <FormLabel component="legend" >Complementação de dieta</FormLabel>
                  <FormGroup row>
                  {
                    tpsComp.map((option) =>(
                      <FormControlLabel
                        control={<Checkbox
                                    color="primary"
                                    key={option.id}
                                    id={option.id}
                                    name={"selecionado"}
                                    checked={option.selecionado} 
                                    onChange={handleCheckTpDietaComplementar}/>}
                        label={option.sigla} />
                    ))
                  }

                  </FormGroup>
                </FormControl>
                
                </Grid>
                <Grid item md={12} xs={12}>
                  <Card>
                    <CardHeader title="Suplementação" ></CardHeader>
                    <Divider />
                    <CardContent>
                      <Grid container spacing={3} direction="row">
                        <Grid item md={12} xs={12}>
                          {errorSup && 
                          <Alert severity="error">{errorSup}</Alert>}
                        </Grid>
                        <Grid item md={4} xs={4}>
                          <TextField
                            fullWidth
                            label="Suplemento"
                            name="supId"
                            required
                            helperText="Informe o suplemento"
                            onChange={handleSupChange}
                            value={valueSup.supId}
                            variant="outlined"
                            select
                            SelectProps={{ native: true }}
                          >
                            <option value={0}></option>
                            {
                              suplementos.map((option) =>(
                                <option key={option.id} value={option.id}>{option.descricao}</option>
                              ))
                            }
                          </TextField>
                        </Grid>
                        <Grid item md={8} xs={8}>
                          <FormGroup row>
                            {
                              refeicoes.map((option) =>(
                                <FormControlLabel
                                  control={<Checkbox
                                              color="primary"
                                              key={option.refeicao}
                                              id={option.refeicao}
                                              name={"selecionado"}
                                              checked={option.sel} 
                                              onChange={handleRefeicaoCheck}/>}
                                  label={option.refeicao} />
                              ))
                            }
                          </FormGroup>
                        </Grid>
                        <Grid item md={4} xs={12}>
                          <Button
                            fullWidth
                            color="primary"
                            variant="contained"
                            onClick={handleAddSuplemento}>
                            Adicionar
                          </Button>
                        </Grid>
                        <Grid item md={12} xs={12}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <StyledTableCell width="20%">Suplemento</StyledTableCell>
                                <StyledTableCell>Refeições</StyledTableCell>
                                <StyledTableCell width="10%" align="center">Ações</StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {
                                itensSup.length <= 0 ?
                                  <TableRow>
                                    <TableCell colSpan={3}>Não informado</TableCell>
                                  </TableRow> : 
                                    itensSup.map((m) => (
                                      <TableRow id={m.suplemento.id}>
                                        <TableCell>{m.suplemento.descricao}</TableCell>
                                        <TableCell>
                                          <Grid container spacing={1} direction="row">
                                            
                                              {m.refeicoes.map((r) => (
                                                <Grid item md={2} xd={2}>
                                                  {r.refeicao}
                                                </Grid>
                                              ))}
                                            
                                          </Grid>
                                        </TableCell>
                                        <TableCell align="center">
                                          <IconButton
                                            title="Excluir refeição" color="primary"
                                            onClick={(event) => handleDelete(m.suplemento.id)}>
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
                  </Card>
                </Grid>
                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <TextField
                    fullWidth
                    label="Observações"
                    name="observacoes"
                    helperText="Observações"
                    onChange={handleChange}
                    value={values.observacoes}
                    variant="outlined"
                  ></TextField>
                </Grid>
                
              </Grid>
            </CardContent>
          </Card>
          <Divider />
          <Card>
            <CardHeader title="Dieta acompanhante"></CardHeader>
            <CardContent>
              {!clinicaSel.permiteAcompanhante ? 
              <Typography>Clínica não permite acompanhante</Typography> : 
              <Grid container spacing={3}>
                <Grid item md={12} xs={12}>
                  <TextField
                    fullWidth
                    label="Tipo de dieta"
                    name="tipoDietaAcomp"
                    required
                    helperText="Informe o tipo de do acompanhante"
                    onChange={handleTipoDietaAcompChange}
                    value={values.tipoDietaAcomp}
                    variant="outlined"
                    select
                    SelectProps={{ native: true }}
                  >
                    <option value={0}></option>
                    {
                      tiposDietaAcomp.map((option) =>(
                        <option key={option.id} value={option.id}>{option.sigla}</option>
                      ))
                    }
                  </TextField>
                </Grid>
                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  
                    
                <FormControl component="fieldset" variant="standard">
                  <FormLabel component="legend" >Complementação de dieta</FormLabel>
                  <FormGroup row>
                  {
                    tpsCompAcomp.map((option) =>(
                      <FormControlLabel
                        control={<Checkbox
                                    color="primary"
                                    key={option.id}
                                    id={option.id}
                                    name={"selecionado"}
                                    checked={option.selecionado} 
                                    onChange={handleCheckTpDietaComplementarAcomp}/>}
                        label={option.sigla} />
                    ))
                  }

                  </FormGroup>
                </FormControl>
                
                </Grid>
                </Grid>
              }
            </CardContent>
          </Card>
          <Box p={2}>
            <Grid container spacing={3}>
              <Grid item md={3} xs={6}>
                <Button
                  fullWidth
                  color="primary"
                  variant="contained"
                  onClick={handleSubmit}>
                  Gravar
                </Button>
              </Grid>
              <Grid item md={3} xs={6}>
                <Button
                  fullWidth
                  color="secondary"
                  onClick={handleGoBack}
                  variant="contained">
                  Cancelar
                </Button>
              </Grid>
            </Grid>
          </Box>
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

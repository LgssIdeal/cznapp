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
  Typography,
  IconButton,
  AppBar,
  Tab,
  Tabs
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {Delete} from '@material-ui/icons'
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {Alert} from '@material-ui/lab';
import RefeicaoContratoService from '../../../services/RefeicaoContratoService';
import UnidadeService from '../../../services/UnidadeService';
import ContratoService from '../../../services/ContratoService';
import refeicoes from '../../../utils/refeicoes';

const useStyles = makeStyles(() => ({
  root: {}
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {/*<Typography>{children}</Typography> */}
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const ProfileDetails = ({ className, contratoId, ...rest }) => {

  

  const navigate = useNavigate();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  
  const [error, setError] = useState({
    msg: "",
    severity: ""
  });

  const [errorUnidade, setErrorUnidade] = useState({
    msg: "",
    severity: ""
  });

  const [errorRefAcomp, setErrorRefAcomp] = useState({
    msg: "",
    severity: ""
  });

  const [errorRefPlant, setErrorRefPlant] = useState({
    msg: "",
    severity: ""
  });

  const [valores, setValores] = useState({
    contratoId: contratoId,
    refeicao: "",
    valor: ""
  });

  const [unidadeIdSel, setUnidadeIdSel] = useState({
    unidade : ''
  });

  const [refeicaoSel, setRefeicaoSel] = useState({
    refeicaoSel: ''
  })

  const [refeicaoSelPlant, setRefeicaoSelPlant] = useState({
    refeicaoSel: ''
  })

  const [tabValue, setTabValue] = useState(0)

  const [refeicoesContrato, setRefeicoesContrato] = useState([]);
  const [reload, setReload] = useState(0);
  const [reloadUnidades, setReloadUnidades] = useState(0);
  const [reloadRefeicoesAcompanhante, setReloadRefeicoesAcompanhante] = useState(0);
  const [reloadRefeicoesPlant, setReloadRefeicoesPlant] = useState(0);
  const [unidadesContrato, setUnidadesContrato] = useState([]);
  const [refsContratoAcomp, setRefsContratoAcomp] = useState([]);
  const [refsContratoPlant, setRefsContratoPlant] = useState([]);
  const [unidades, setUnidades]= useState([]);
  const [contrato, setContrato] = useState();

  const map = new Map();
  map.set("DESJEJUM", "Desjejum");
  map.set("LANCHE_1", "Colação");
  map.set("ALMOCO", "Almoço");
  map.set("LANCHE_2", "Lanche tarde");
  map.set("JANTAR", "Jantar");
  map.set("CEIA", "Ceia");

  useEffect(() => {
    setError({
      msg: '',
      severity: ''
    })
    setLoading(true);
    RefeicaoContratoService.getRefeicoesContrato(contratoId)
      .then((result) => {
        setLoading(false);
        setRefeicoesContrato(result.data);
      })
      .catch((error) => {
        setLoading(false);
        if(error.response) {
          setError({
            msg: error.response.data.detail,
            severity: "error"
          })
        } else {
          if(JSON.stringify(error).includes("401")) {
            navigate("/", {});
          } else {
            setError({
              msg: JSON.stringify(error),
              severity: "error"
            })
          }
        }
      });
      ContratoService.getContrato(contratoId)
        .then((result) => {
          setLoading(false)
          setContrato(result.data);
        })
        .catch((error) => {
          setLoading(false);
          if(error.response) {
            setError({
              msg: error.response.data.detail,
              severity: "error"
            })
          } else {
            if(JSON.stringify(error).includes("401")) {
              navigate("/", {});
            } else {
              setError({
                msg: JSON.stringify(error),
                severity: "error"
              })
            }
          }
        })
  }, [contratoId, reload]);

  useEffect(() => {
    if(contrato) {
      setLoading(true);
      UnidadeService.getUnidadesList(contrato.cliente.id)
        .then((result) =>{
          setLoading(false)
          setUnidades(result.data)
        })
        .catch((error) => {
          setLoading(false);
            if(error.response) {
              setError({
                msg: error.response.data.detail,
                severity: "error"
              })
            } else {
              if(JSON.stringify(error).includes("401")) {
                navigate("/", {});
              } else {
                setError({
                  msg: JSON.stringify(error),
                  severity: "error"
                })
              }
            }
        });
    }
    
  }, [contrato]);
  
  useEffect(() => {
    if(contrato) {
      setLoading(true);
      ContratoService.getUnidades(contratoId)
        .then((result) =>{
          setUnidadesContrato(result.data);
        })
        .catch((error) => {
          setLoading(false);
          if(error.response) {
            setError({
              msg: error.response.data.detail,
              severity: "error"
            })
          } else {
            if(JSON.stringify(error).includes("401")) {
              navigate("/", {});
            } else {
              setError({
                msg: JSON.stringify(error),
                severity: "error"
              })
            }
          }
        });

    }
  },[contrato]);

  useEffect(() => {
    if(contrato) {
      setLoading(true);
      ContratoService.getRefeicoesAcompanhante(contrato.id)
        .then((result) => {
          setRefsContratoAcomp(result.data);
        })
        .catch((error) => {
          if(error.response.data) {
            setErrorRefAcomp({
              msg: error.response.data.detail,
              severity: "error"
            });
          } else {
            setErrorRefAcomp({
              msg: JSON.stringify(error),
              severity: "error"
            });
          }
        })
        .finally(() => setLoading(false));
    }
    
  }, [contrato, reloadRefeicoesAcompanhante]);

  useEffect(() => {
    if(contrato) {
      setLoading(true);
      ContratoService.getRefeicoesPlantonista(contrato.id)
        .then((result) => {
          setRefsContratoPlant(result.data);
        })
        .catch((error) => {
          if(error.response.data) {
            setErrorRefPlant({
              msg: error.response.data.detail,
              severity: "error"
            });
          } else {
            setErrorRefPlant({
              msg: JSON.stringify(error),
              severity: "error"
            });
          }
        })
        .finally(() => setLoading(false));
    }
    
  }, [contrato, reloadRefeicoesPlant]);

  const handleSubmit = () => {
    setLoading(true);
    if(valores.refeicao === '') {
      setLoading(false)
      setError({
        msg: 'Informe a refeição',
        severity: "warning"
      })
    } else {
      if(valores.valor === '') {
        setLoading(false);
        setError({
          msg: "Informe o valor",
          severity: "warning"
        });
      } else {
        const params = new URLSearchParams();
        params.append('refeicaoContratoId', '');
        params.append('contratoId', valores.contratoId);
        params.append('refeicao', valores.refeicao);
        params.append('valor', valores.valor);
        RefeicaoContratoService.gravaRefeicaoContrato(params)
          .then((result) => {
            setLoading(false);
            setError({
              msg: "Refeição incluída com sucesso",
              severity: "success"
            });
            setValores({
              ...valores,
              refeicao: "",
              valor: ""
            });
            if(reload === 0) {
              setReload(1);
            } else {
              setReload(0);
            }
          })
          .catch((error) => {
            setLoading(false)
            if(error.response) {
              setError({
                msg: error.response.data.detail,
                severity: "error"
              });
            } else {
              var txt = JSON.stringify(error);
              if(txt.includes("401")) {
                navigate("/", {reload: true});
              } else {
                setError({
                  msg: txt,
                  severity: "error"
                });
              }
            }
          });
      }
    }
  }

  const handleGoBack = () => {
    navigate("/app/contratos", {replace: true});
  }

  const handleDeleteRefeicao = (refeicaoContratoId) => {
    setLoading(true);
    RefeicaoContratoService.deleteRefeicaoContrato(refeicaoContratoId)
      .then((result) => {
        setLoading(false);
        setError({
          msg: "Refeição excluída",
          severity: "success"
        });
        if(reload === 0) {
          setReload(1);
        } else {
          setReload(0);
        }
      })
      .catch((error) => {
        setLoading(false)
        if(error.response) {
          setError({
            msg: error.response.data.detail,
            severity: "error"
          });
        } else {
          var txt = JSON.stringify(error);
          if(txt.includes("401")) {
            navigate("/", {reload: true});
          } else {
            setError({
              msg: txt,
              severity: "error"
            });
          }
        }
      });
  }


  const handleAdicionaUnidade = () => {
    setLoading(true);
    ContratoService.adicionaUnidade(unidadeIdSel.unidade, contrato.id)
      .then((result) =>{
        setLoading(false);
        setErrorUnidade({
          msg: "Unidade adicionada com sucesso",
          severity: "success"
        })
        if(reload === 0) {
          setReload(1);
        } else {
          setReload(0);
        }
      })
      .catch((error) => {
        setLoading(false)
        if(error.response) {
          setErrorUnidade({
            msg: error.response.data.detail,
            severity: "error"
          });
        } else {
          var txt = JSON.stringify(error);
          if(txt.includes("401")) {
            navigate("/", {reload: true});
          } else {
            setErrorUnidade({
              msg: txt,
              severity: "error"
            });
          }
        }
      })
  }

  const handleDeleteUnidadeContrato = (unidadeId) => {
    setLoading(true);
    ContratoService.removeUnidade(unidadeId, contrato.id)
      .then((result) => {
        setErrorUnidade({
          msg: "Unidade removida com sucesso",
          severity: "success"
        })
        if(reload === 0) {
          setReload(1)
        } else {
          setReload(0)
        }
      })
      .catch((error) => {
        setLoading(false)
        if(error.response) {
          setErrorUnidade({
            msg: error.response.data.detail,
            severity: "error"
          });
        } else {
          var txt = JSON.stringify(error);
          if(txt.includes("401")) {
            navigate("/", {reload: true});
          } else {
            setErrorUnidade({
              msg: txt,
              severity: "error"
            });
          }
        }
      })
  }

  /*
  * Acompanhante
  */
  const handleAdicionaRefeicaoAcompanhante = () => {
    setLoading(true);
    ContratoService.addRefeicaoContratoAcompanhante(contrato.id, refeicaoSel.refeicao)
      .then(() => {
        if(reloadRefeicoesAcompanhante === 0) {
          setReloadRefeicoesAcompanhante(1);
        } else {
          setReloadRefeicoesAcompanhante(0);
        }
        setRefeicaoSel({
          refeicao: ''
        })
        setErrorRefAcomp( {
          msg: 'Refeição adicionada com sucesso',
          severity: 'success'
        });
      })
      .catch((error) => {
        if(error.response.data) {
          setErrorRefAcomp({
            msg: error.response.data.detail,
            severity: "error"
          });
        } else {
          setErrorRefAcomp({
            msg: JSON.stringify(error),
            severity: "error"
          });
        }
      })
      .finally(() => setLoading(false));
  }

  const handleExcluiRefeicaoAcompanhante = (refeicaoId) => {
    setLoading(true);
    ContratoService.excluiRefeicaoAcompanhante(refeicaoId)
      .then(() => {
        if(reloadRefeicoesAcompanhante === 0) {
          setReloadRefeicoesAcompanhante(1);
        } else {
          setReloadRefeicoesAcompanhante(0);
        }
        setErrorRefAcomp({
          msg: 'Refeição de acompanhante excluída com sucesso.',
          severity: 'success'
        });
      })
      .catch((error) => {
        setErrorRefAcomp({
          msg: 'Ocorreu um erro ao excluir a refeição do acompanhante: ' + JSON.stringify(error),
          severity: 'error'
        });
      })
      .finally(() => setLoading(false));
  }

  /*
  * Plantonista
  */
  const handleAdicionaRefeicaoPlantonista = () => {
    setLoading(true);
    ContratoService.addRefeicaoContratoPlantonista(contrato.id, refeicaoSelPlant.refeicao)
      .then(() => {
        if(reloadRefeicoesPlant === 0) {
          setReloadRefeicoesPlant(1);
        } else {
          setReloadRefeicoesPlant(0);
        }
        setRefeicaoSelPlant({
          refeicao: ''
        })
        setErrorRefPlant( {
          msg: 'Refeição adicionada com sucesso',
          severity: 'success'
        });
      })
      .catch((error) => {
        if(error.response.data) {
          setErrorRefPlant({
            msg: error.response.data.detail,
            severity: "error"
          });
        } else {
          setErrorRefPlant({
            msg: JSON.stringify(error),
            severity: "error"
          });
        }
      })
      .finally(() => setLoading(false));
  }

  const handleExcluiRefeicaoPlantonista = (refeicaoId) => {
    setLoading(true);
    ContratoService.excluiRefeicaoPlantonista(refeicaoId)
      .then(() => {
        if(reloadRefeicoesPlant === 0) {
          setReloadRefeicoesPlant(1);
        } else {
          setReloadRefeicoesPlant(0);
        }
        setErrorRefPlant({
          msg: 'Refeição de excluída com sucesso.',
          severity: 'success'
        });
      })
      .catch((error) => {
        setErrorRefAcomp({
          msg: 'Ocorreu um erro ao excluir a refeição do plantonista: ' + JSON.stringify(error),
          severity: 'error'
        });
      })
      .finally(() => setLoading(false));
  }

  const handleChange = (event) => {
    setValores({
      ...valores,
      [event.target.name]: event.target.value
    });
  };

  const handleUnidadeChanged = (event) => {
    setUnidadeIdSel({
      ...unidadeIdSel,
      [event.target.name]: event.target.value
    })
  }

  const handleRefeicaoChanged = (event) => {
    setRefeicaoSel({
      ...refeicaoSel,
      [event.target.name]: event.target.value
    })
  }

  const handleRefeicaoPlantChanged = (event) => {
    setRefeicaoSelPlant({
      ...refeicaoSelPlant,
      [event.target.name]: event.target.value
    })
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
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
      <AppBar position="static">
        <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="Valores" {...a11yProps(0)}/>
          <Tab label="Unidades associadas" {...a11yProps(1)}/>
          <Tab label="Refeições de acompanhante" {...a11yProps(2)}/>
          <Tab label="Refeições de plantonista" {...a11yProps(3)}/>
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0} key={0}>
        <Card xs={12} md={12}>
          <CardHeader
            subheader="Informe os dados e clique adicionar."
            title="Valores do contrato" />
          <Divider />
          <CardContent>
            {error.msg && 
              <Alert severity={error.severity}>{error.msg}</Alert>}
            {loading && 
            <LinearProgress></LinearProgress>}
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} >
                <TextField
                  fullWidth
                  onChange={handleChange}
                  required
                  variant="outlined"
                  select
                  SelectProps={{ native: true }}
                  name="refeicao"
                  label="Refeição"
                  key={"refeicao"}
                  disabled={loading}
                  value={valores.refeicao}>
                  {
                    refeicoes.map((option) =>(
                      <option key={option.id} value={option.id}>{option.value}</option>
                    ))
                  }
                
                </TextField>
              </Grid>
              <Grid item md={4} xs={12} >

                <TextField
                  fullWidth
                  onChange={handleChange}
                  required
                  variant="outlined"
                  name="valor"
                  label="Valor"
                  key="valor"
                  disabled={loading}
                  value={valores.valor} />                
              </Grid>
              <Grid item md={4} xs={12} >
                <Button
                  fullWidth
                  color="primary"
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}>
                  Adicionar
                </Button>
              </Grid>
            </Grid>
            <Box p={2}>
            <Grid container spacing={1}>    
                <Grid item md={12} xs={12} >

                    <Table>
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>
                            Refeição
                          </StyledTableCell>
                          <StyledTableCell>
                            Valor
                          </StyledTableCell>
                          <StyledTableCell>
                            Ação
                          </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {refeicoesContrato.map((ref) => (
                          <TableRow
                            hover
                            key={ref.id}>
                            <TableCell>
                              {map.get(ref.refeicao)}
                            </TableCell>
                            <TableCell>
                              {'R$ ' + ref.valor.toString().replace(".", ",")}
                            </TableCell>
                            <TableCell>
                              <Typography>
                                <IconButton
                                  title="Excluir refeição" color="primary"
                                  onClick={(event) => handleDeleteRefeicao(ref.id)}>
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
            </Box>
            <Grid container spacing={3}>
              <Grid item md={12} xs={12} >
                <Button
                  fullWidth
                  onClick={handleGoBack}
                  variant="contained"
                  disabled={loading}
                  color="primary">
                  Voltar
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>
      <TabPanel value={tabValue} index={1} key={1}>
        <Card xs={12} md={12}>
          <CardHeader
            subheader="Informe os dados e clique adicionar."
            title="Unidades associadas"
          />
          {errorUnidade.msg && 
            <Alert severity={errorUnidade.severity}>{errorUnidade.msg}</Alert>}
          {loading && 
            <LinearProgress></LinearProgress>}
          <Divider />
          <CardContent>
            <Grid container spacing={1}>
              <Grid item md={6} xs={12} >

                <TextField
                  fullWidth
                  onChange={handleUnidadeChanged}
                  required
                  variant="outlined"
                  select
                  SelectProps={{ native: true }}
                  name="unidade"
                  label="Unidade"
                  disabled={loading}
                  value={unidadeIdSel.unidade}>
                  <option key={''} value={''}></option>
                  {
                    unidades.map((option) =>(
                      <option key={option.id} value={option.id}>{option.descricao}</option>
                    ))
                  }
                
                </TextField>
              </Grid>
              <Grid item md={6} xs={12} >
                <Button
                  fullWidth
                  color="primary"
                  variant="contained"
                  onClick={handleAdicionaUnidade}
                  disabled={loading}>
                  Adicionar
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={1}>    
              <Grid item md={12} xs={12} >
                <PerfectScrollbar>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>
                          Unidade
                        </StyledTableCell>
                        <StyledTableCell>
                          Ação
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {unidadesContrato.map((unidade) => (
                      <TableRow
                        hover
                        key={unidade.id}>
                        <TableCell>
                          {unidade.descricao}
                        </TableCell>
                        <TableCell>
                          <Typography>
                            <IconButton
                              title="Excluir unidade" color="primary"
                              onClick={(event) => handleDeleteUnidadeContrato(unidade.id)}>
                                <Delete />
                            </IconButton>
                          </Typography>
                        </TableCell>
                      </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </PerfectScrollbar>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>
      <TabPanel value={tabValue} index={2} key={2}>
        <Card xs={12} md={12}>
          <CardHeader
            subheader="Informe os dados e clique adicionar."
            title="Refeições de acompanhante"
          />
          {errorRefAcomp.msg && 
            <Alert severity={errorRefAcomp.severity}>{errorRefAcomp.msg}</Alert>}
          {loading && 
            <LinearProgress></LinearProgress>}
          <Divider />
          <CardContent>
            <Grid container spacing={1}>
              <Grid item md={6} xs={12} >

                <TextField
                  fullWidth
                  onChange={handleRefeicaoChanged}
                  required
                  variant="outlined"
                  select
                  SelectProps={{ native: true }}
                  name="refeicao"
                  label="Refeição"
                  disabled={loading}
                  value={refeicaoSel.refeicao}>
                  {
                    refeicoes.map((option) =>(
                      <option key={option.id} value={option.id}>{option.value}</option>
                    ))
                  }
                
                </TextField>
              </Grid>
              <Grid item md={6} xs={12} >
                <Button
                  fullWidth
                  color="primary"
                  variant="contained"
                  onClick={handleAdicionaRefeicaoAcompanhante}
                  disabled={loading}>
                  Adicionar
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={1}>    
              <Grid item md={12} xs={12} >
                <PerfectScrollbar>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>
                          Refeição
                        </StyledTableCell>
                        <StyledTableCell>
                          Ação
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {refsContratoAcomp.map((ref) => (
                      <TableRow
                        hover
                        key={ref.id}>
                        <TableCell>
                          {map.get(ref.refeicao)}
                        </TableCell>
                        <TableCell>
                          <Typography>
                            <IconButton
                              title="Excluir refeição" color="primary"
                              onClick={(event) => handleExcluiRefeicaoAcompanhante(ref.id)}>
                                <Delete />
                            </IconButton>
                          </Typography>
                        </TableCell>
                      </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </PerfectScrollbar>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <Card xs={12} md={12}>
          <CardHeader
            subheader="Informe os dados e clique adicionar."
            title="Refeições de plantonista"
          />
          {errorRefPlant.msg && 
            <Alert severity={errorRefPlant.severity}>{errorRefPlant.msg}</Alert>}
          {loading && 
            <LinearProgress></LinearProgress>}
          <Divider />
          <CardContent>
            <Grid container spacing={1}>
              <Grid item md={6} xs={12} >

                <TextField
                  fullWidth
                  onChange={handleRefeicaoPlantChanged}
                  required
                  variant="outlined"
                  select
                  SelectProps={{ native: true }}
                  name="refeicao"
                  label="Refeição"
                  disabled={loading}
                  value={refeicaoSelPlant.refeicao}>
                  {
                    refeicoes.map((option) =>(
                      <option key={option.id} value={option.id}>{option.value}</option>
                    ))
                  }
                
                </TextField>
              </Grid>
              <Grid item md={6} xs={12} >
                <Button
                  fullWidth
                  color="primary"
                  variant="contained"
                  onClick={handleAdicionaRefeicaoPlantonista}
                  disabled={loading}>
                  Adicionar
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={1}>    
              <Grid item md={12} xs={12} >
                <PerfectScrollbar>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>
                          Refeição
                        </StyledTableCell>
                        <StyledTableCell>
                          Ação
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {refsContratoPlant.map((ref) => (
                      <TableRow
                        hover
                        key={ref.id}>
                        <TableCell>
                          {map.get(ref.refeicao)}
                        </TableCell>
                        <TableCell>
                          <Typography>
                            <IconButton
                              title="Excluir refeição" color="primary"
                              onClick={(event) => handleExcluiRefeicaoPlantonista(ref.id)}>
                                <Delete />
                            </IconButton>
                          </Typography>
                        </TableCell>
                      </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </PerfectScrollbar>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>
    </form>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string
};

export default ProfileDetails;

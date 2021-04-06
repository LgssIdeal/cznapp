import React, { useState, useEffect} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  makeStyles,
  IconButton,
  LinearProgress,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {
  Alarm,
  SearchOutlined,
  ThumbUpAltOutlined,
  CancelOutlined,
  DoneOutlined,
  DoneOutline} from '@material-ui/icons'
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import InsumoService from '../../../services/InsumoService';
import CautelaService from '../../../services/CautelaService';
import {Alert} from '@material-ui/lab';
import { zonedTimeToUtc, format } from 'date-fns-tz';


const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, pageable, ...rest }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [isTokenExpired, setTokenExpired] = useState(false);
  const navigate = useNavigate();
  const [lpageable, setLpageable] = useState({
    content : [],
    totalElements : 0
  });
  const [reload, setReload] = useState(0);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleAlterInsumo = (insumoId) => {
    navigate('/app/cautelas/' + insumoId, {replace : true});
  }

  const handleSetCancelada = (cautelaId) => {

    confirmAlert({
      title: 'Confirmação',
      message: 'Deseja marcar essa cautela como CANCELADA?',
      buttons: [
        {
          label:'Sim',
          onClick: () => {
            setLoading(true);
            CautelaService.setCancelada(cautelaId, JSON.parse(localStorage.getItem("@app-user")).id)
              .then((result) => {
                  
                confirmAlert({
                  title: 'Informação',
                  message: 'Cautela marcada como cancelada',
                  buttons: [
                    {
                      label: 'Ok',
                      onClick: () => {
                        if(reload === 0) {
                          setReload(1);
                        } else {
                          setReload(0);
                        }
                      }
                    }
                  ]
                });
              })
              .catch((error) => {
                if(error.data) {
                  setErrorMsg(error.data);
                } else {
                  setTokenExpired(true)
                }
                
            }).finally(() => setLoading(false));  
          }
        },
        {
          label: 'Não',
          onClick: () => {
            confirmAlert({
              title: 'Informação',
              message: 'Operação cancelada',
              buttons: [
                {
                  label: 'Ok',
                  onClick: () => {}
                }
              ]
            });
          }
        }
      ]
    });
      
  } 

  const handleSetEntregue = (cautelaId) => {

    confirmAlert({
      title: 'Confirmação',
      message: 'Deseja marcar essa cautela como ENTREGUE?',
      buttons: [
        {
          label:'Sim',
          onClick: () => {
            setLoading(true);
            CautelaService.setEntregue(cautelaId, JSON.parse(localStorage.getItem("@app-user")).id)
              .then((result) => {
                  
                confirmAlert({
                  title: 'Informação',
                  message: 'Cautela marcada como entregue',
                  buttons: [
                    {
                      label: 'Ok',
                      onClick: () => {
                        if(reload === 0) {
                          setReload(1);
                        } else {
                          setReload(0);
                        }
                      }
                    }
                  ]
                });
              })
              .catch((error) => {
                if(error.data) {
                  setErrorMsg(error.data);
                } else {
                  setTokenExpired(true)
                }
                
            }).finally(() => setLoading(false));  
          }
        },
        {
          label: 'Não',
          onClick: () => {
            confirmAlert({
              title: 'Informação',
              message: 'Operação cancelada',
              buttons: [
                {
                  label: 'Ok',
                  onClick: () => {}
                }
              ]
            });
          }
        }
      ]
    });
      
  }
  

  useEffect(() => {

    CautelaService.getCautelas(page + 1, limit)
      .then((result) => {
        setLoading(false);
        setLpageable(result.data);
      })
      .catch((error) => {
        setLoading(false);
        if(error.data) {
          console.log(error.request);
          setErrorMsg(error.data);
        } else {
          setTokenExpired(true)
        }
      });

  }, [page, limit, reload]);

  useEffect(() =>{
    if(isTokenExpired) {
      navigate('/', {replace : true});
    }
  },[isTokenExpired]);


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
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <PerfectScrollbar>
        <Box minWidth={1050}>
          {loading && <LinearProgress></LinearProgress>}
          {errorMsg &&
                  <Alert severity="error">{errorMsg}</Alert>}
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>
                  Nro.
                </StyledTableCell>
                <StyledTableCell>
                  Data criação
                </StyledTableCell>
                <StyledTableCell>
                  Usuário criação
                </StyledTableCell>
                <StyledTableCell>
                  Data de referẽncia
                </StyledTableCell>
                <StyledTableCell>
                  Última alteração
                </StyledTableCell>
                <StyledTableCell>
                  Usuário alteração
                </StyledTableCell>
                <StyledTableCell align="center">
                  Status
                </StyledTableCell>
                <StyledTableCell align="center">
                  Ações
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lpageable.content.slice(0, limit).map((cautela) => (
                <TableRow
                  hover
                  key={cautela.id}
                >
                  <TableCell>
                    {cautela.id}
                  </TableCell>
                  <TableCell>
                    {format(
                      zonedTimeToUtc(
                        cautela.dataCriacao, 
                          'America/Sao_Paulo'), "dd/MM/yyyy HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    {cautela.usuarioCriacao.nome}
                  </TableCell>
                  <TableCell>
                    {format(
                      zonedTimeToUtc(
                        cautela.dataReferencia, 
                          'America/Sao_Paulo'), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    {cautela.dataAlteracao && format(
                      zonedTimeToUtc(
                        cautela.dataAlteracao, 
                          'America/Sao_Paulo'), "dd/MM/yyyy HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    {cautela.usuarioAlteracao && cautela.usuarioAlteracao.nome}
                  </TableCell>
                  <TableCell align="center">
                    {cautela.status === 'AGUARDANDO_CONFERENCIA' ? 
                      <Typography title="Aguardando OK de entrega" color="primary"><Alarm fontSize="small"/></Typography> : ''}
                    {cautela.status === 'CANCELADA' ? 
                      <Typography title="Cautela cancelada" color="error"><CancelOutlined fontSize="small"/></Typography> : ''}
                    {cautela.status === 'ENTREGUE' ? 
                      <Typography title="Cautela entregue" color="primary"><DoneOutlined fontSize="small"/></Typography> : ''}
                  </TableCell>
                  <TableCell align="center">
                    <Typography noWrap="true">
                      <IconButton
                        title="Visualizar itens da cautela"
                        onClick={(event) => handleAlterInsumo(cautela.id)}>
                        <SearchOutlined color="primary"/>
                      </IconButton>
                      {
                        cautela.status === 'AGUARDANDO_CONFERENCIA' ?
                          <IconButton
                            title="Informar cautela entregue" color="primary"
                            onClick={(event) => handleSetEntregue(cautela.id)}>
                              <DoneOutlined />
                          </IconButton> : ''
                      }
                      {
                        cautela.status === 'AGUARDANDO_CONFERENCIA' ?
                          <IconButton
                            title="Cancelar essa cautela" color="primary"
                            onClick={(event) => handleSetCancelada(cautela.id)}>
                              <CancelOutlined />
                          </IconButton> : ''
                      }
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={lpageable.totalElements}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 20, 50]}
      />
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  pageable: PropTypes.object
};

export default Results;

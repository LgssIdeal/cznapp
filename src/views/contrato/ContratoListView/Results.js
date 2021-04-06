import React, { useState, useEffect} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  makeStyles,
  IconButton,
  LinearProgress
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {Edit, Delete, CheckCircle, HighlightOff, Settings} from '@material-ui/icons'
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import ContratoService from '../../../services/ContratoService'
import { Alert } from '@material-ui/lab';
import { zonedTimeToUtc, format } from 'date-fns-tz';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, pageable, ...rest }) => {
  const classes = useStyles();
  const [selectedContratoIds, setSelectedContratoIds] = useState([]);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [isTokenExpired, setTokenExpired] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [lpageable, setLpageable] = useState({
    content : [],
    totalElements : 0
  });
  const [reload, setReload] = useState(0);

  const handleSelectAll = (event) => {
    let newSelectedContratoIds;

    if (event.target.checked) {
      newSelectedContratoIds = lpageable.content.map((contrato) => contrato.id);
    } else {
      newSelectedContratoIds = [];
    }

    setSelectedContratoIds(newSelectedContratoIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedContratoIds.indexOf(id);
    let newSelectedContratoIds = [];

    if (selectedIndex === -1) {
      newSelectedContratoIds = newSelectedContratoIds.concat(selectedContratoIds, id);
    } else if (selectedIndex === 0) {
      newSelectedContratoIds = newSelectedContratoIds.concat(selectedContratoIds.slice(1));
    } else if (selectedIndex === selectedContratoIds.length - 1) {
      newSelectedContratoIds = newSelectedContratoIds.concat(selectedContratoIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedContratoIds = newSelectedContratoIds.concat(
        selectedContratoIds.slice(0, selectedIndex),
        selectedContratoIds.slice(selectedIndex + 1)
      );
    }

    setSelectedContratoIds(newSelectedContratoIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleAlterContrato = (contratoId) => {
    navigate('/app/contratos/' + contratoId, {replace : true});
  }

  const handleConfigureContrato = (contratoId) => {
    navigate('/app/contratos/' + contratoId + "/configuracao", {replace : true});
  }

  const handleDeleteContrato = (contratoId) => {

    confirmAlert({
      title: 'Confirmação',
      message: 'Deseja excluir o contrato?',
      buttons: [
        {
          label:'Sim',
          onClick: () => {

            ContratoService.deleteContrato(contratoId)
              .then((result) => {
                  
                confirmAlert({
                  title: 'Informação',
                  message: 'Contrato excluído',
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
                
            });  
          }
        },
        {
          label: 'Não',
          onClick: () => {
            confirmAlert({
              title: 'Informação',
              message: 'Exclusão cancelada',
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

    if(JSON.parse(localStorage.getItem("@app-user")).perfil !== 'ADMINISTRADOR') {
      navigate("/app/401", {}); 
    }
    
    ContratoService.getContratos(page + 1, limit)
      .then((result) => {
        setLoading(false);
        setLpageable(result.data);
      })
      .catch((error) => {
        setLoading(false);
        if(error.data) {
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
                <StyledTableCell padding="checkbox">
                  <Checkbox
                    checked={selectedContratoIds.length === lpageable.content.length}
                    color="primary"
                    indeterminate={
                      selectedContratoIds.length > 0
                      && selectedContratoIds.length < lpageable.content.length
                    }
                    onChange={handleSelectAll}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  Empresa
                </StyledTableCell>
                <StyledTableCell>
                  Cliente
                </StyledTableCell>
                <StyledTableCell>
                  Vigência
                </StyledTableCell>
                <StyledTableCell>
                  Tipo faturamento
                </StyledTableCell>
                <StyledTableCell>
                  Ativo
                </StyledTableCell>
                <StyledTableCell>
                  Ações
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lpageable.content.slice(0, limit).map((contrato) => (
                <TableRow
                  hover
                  key={contrato.id}
                  selected={selectedContratoIds.indexOf(contrato.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedContratoIds.indexOf(contrato.id) !== -1}
                      onChange={(event) => handleSelectOne(event, contrato.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      alignItems="center"
                      display="flex"
                    >
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {contrato.empresa.razaoSocial}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {contrato.cliente.razaoSocial}
                  </TableCell>
                  <TableCell>
                    {format(zonedTimeToUtc(contrato.vigenciaInicial, 'America/Sao_Paulo'), "dd/MM/yyyy") + " a " + format(zonedTimeToUtc(contrato.vigenciaFinal, 'America/Sao_Paulo'), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    {contrato.tipoFaturamento}
                  </TableCell>
                  <TableCell>
                    {contrato.ativo ?
                      <Typography color="primary"><CheckCircle /></Typography> : 
                      <Typography color="error"><HighlightOff /></Typography>}
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <IconButton
                        aria-label="Configurações"
                        onClick={(event) => handleConfigureContrato(contrato.id)}
                        size="small">
                        <Settings color="primary" />
                      </IconButton>
                    
                      <IconButton
                        aria-label="Editar contrato"
                        onClick={(event) => handleAlterContrato(contrato.id)}
                        size="small">
                        <Edit color="primary" />
                      </IconButton>
                    
                      <IconButton
                        aria-label="Excluir contrato" color="secondary"
                        onClick={(event) => handleDeleteContrato(contrato.id)}
                        size="small">
                          <Delete />
                      </IconButton>
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

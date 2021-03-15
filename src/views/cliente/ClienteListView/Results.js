import React, { useState, useEffect} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
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
import {Edit, Delete, Apartment} from '@material-ui/icons'
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import ClienteService from '../../../services/ClienteService'
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, pageable, ...rest }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [selectedClienteIds, setSelectedClienteIds] = useState([]);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [isTokenExpired, setTokenExpired] = useState(false);
  const navigate = useNavigate();
  const [lpageable, setLpageable] = useState({
    content : [],
    totalElements : 0
  });
  const [reload, setReload] = useState(0);

  const handleSelectAll = (event) => {
    let newSelectedClienteIds;

    if (event.target.checked) {
      newSelectedClienteIds = lpageable.content.map((cliente) => cliente.id);
    } else {
      newSelectedClienteIds = [];
    }

    setSelectedClienteIds(newSelectedClienteIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedClienteIds.indexOf(id);
    let newSelectedClienteIds = [];

    if (selectedIndex === -1) {
      newSelectedClienteIds = newSelectedClienteIds.concat(selectedClienteIds, id);
    } else if (selectedIndex === 0) {
      newSelectedClienteIds = newSelectedClienteIds.concat(selectedClienteIds.slice(1));
    } else if (selectedIndex === selectedClienteIds.length - 1) {
      newSelectedClienteIds = newSelectedClienteIds.concat(selectedClienteIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedClienteIds = newSelectedClienteIds.concat(
        selectedClienteIds.slice(0, selectedIndex),
        selectedClienteIds.slice(selectedIndex + 1)
      );
    }

    setSelectedClienteIds(newSelectedClienteIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleAlterCliente = (idCliente) => {
    console.log("Cliente ID: ", idCliente);
    navigate('/app/cliente/' + idCliente, {replace : true});
  }

  const handleDeleteCliente = (idCliente) => {

    confirmAlert({
      title: 'Confirmação',
      message: 'Deseja excluir o cliente?',
      buttons: [
        {
          label:'Sim',
          onClick: () => {

            ClienteService.deleteCliente(idCliente)
              .then((result) => {
                  
                confirmAlert({
                  title: 'Informação',
                  message: 'Cliente excluído',
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
  
  const handleNavigateToUnidade = ( (idCliente) => {
    navigate("/app/unidades/cliente/" + idCliente, {});
  });

  useEffect(() => {

    if(JSON.parse(localStorage.getItem("@app-user")).perfil !== 'ADMINISTRADOR') {
      navigate("/app/401", {}); 
    }

    ClienteService.getClientes(page + 1, limit)
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
                <StyledTableCell padding="checkbox">
                  <Checkbox
                    checked={selectedClienteIds.length === lpageable.content.length}
                    color="primary"
                    indeterminate={
                      selectedClienteIds.length > 0
                      && selectedClienteIds.length < lpageable.content.length
                    }
                    onChange={handleSelectAll}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  Razão Social
                </StyledTableCell>
                <StyledTableCell>
                  Fantasia
                </StyledTableCell>
                <StyledTableCell>
                  CNPJ
                </StyledTableCell>
                <StyledTableCell>
                  IE
                </StyledTableCell>
                <StyledTableCell>
                  Ações
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lpageable.content.slice(0, limit).map((cliente) => (
                <TableRow
                  hover
                  key={cliente.id}
                  selected={selectedClienteIds.indexOf(cliente.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedClienteIds.indexOf(cliente.id) !== -1}
                      onChange={(event) => handleSelectOne(event, cliente.id)}
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
                        {cliente.razaoSocial}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {cliente.fantasia}
                  </TableCell>
                  <TableCell>
                    {cliente.documento}
                  </TableCell>
                  <TableCell>
                    {cliente.ie}
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <IconButton
                        title="Editar cliente"
                        onClick={(event) => handleAlterCliente(cliente.id)}>
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton
                        title="Excluir cliente" color="secondary"
                        onClick={(event) => handleDeleteCliente(cliente.id)}>
                          <Delete />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={(event) => handleNavigateToUnidade(cliente.id)}
                      >
                        <Apartment />
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

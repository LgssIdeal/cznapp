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
import {Edit, Delete, Dehaze} from '@material-ui/icons'
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import InsumoService from '../../../services/InsumoService';
import {Alert} from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, pageable, ...rest }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [selectedInsumoIds, setSelectedInsumoIds] = useState([]);
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
    let newSelectedInsumoIds;

    if (event.target.checked) {
      newSelectedInsumoIds = lpageable.content.map((insumo) => insumo.id);
    } else {
      newSelectedInsumoIds = [];
    }

    setSelectedInsumoIds(newSelectedInsumoIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedInsumoIds.indexOf(id);
    let newSelectedInsumoIds = [];

    if (selectedIndex === -1) {
      newSelectedInsumoIds = newSelectedInsumoIds.concat(selectedInsumoIds, id);
    } else if (selectedIndex === 0) {
      newSelectedInsumoIds = newSelectedInsumoIds.concat(selectedInsumoIds.slice(1));
    } else if (selectedIndex === selectedInsumoIds.length - 1) {
      newSelectedInsumoIds = newSelectedInsumoIds.concat(selectedInsumoIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedInsumoIds = newSelectedInsumoIds.concat(
        selectedInsumoIds.slice(0, selectedIndex),
        selectedInsumoIds.slice(selectedIndex + 1)
      );
    }

    setSelectedInsumoIds(newSelectedInsumoIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleAlterInsumo = (insumoId) => {
    navigate('/app/insumos/' + insumoId, {replace : true});
  }

  const handleDeleteInsumo = (insumoId) => {

    confirmAlert({
      title: 'Confirmação',
      message: 'Deseja excluir o insumo?',
      buttons: [
        {
          label:'Sim',
          onClick: () => {

            InsumoService.deleteInsumo(insumoId)
              .then((result) => {
                  
                confirmAlert({
                  title: 'Informação',
                  message: 'Insumo excluido',
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

    InsumoService.getInsumos(page + 1, limit)
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
                    checked={selectedInsumoIds.length === lpageable.content.length}
                    color="primary"
                    indeterminate={
                      selectedInsumoIds.length > 0
                      && selectedInsumoIds.length < lpageable.content.length
                    }
                    onChange={handleSelectAll}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  Insumo
                </StyledTableCell>
                <StyledTableCell>
                  Unidade
                </StyledTableCell>
                <StyledTableCell>
                  Ações
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lpageable.content.slice(0, limit).map((insumo) => (
                <TableRow
                  hover
                  key={insumo.id}
                  selected={selectedInsumoIds.indexOf(insumo.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedInsumoIds.indexOf(insumo.id) !== -1}
                      onChange={(event) => handleSelectOne(event, insumo.id)}
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
                        {insumo.descricao}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {insumo.unidade}
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <IconButton
                        title="Editar insumo"
                        onClick={(event) => handleAlterInsumo(insumo.id)}>
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton
                        title="Excluir insumo" color="primary"
                        onClick={(event) => handleDeleteInsumo(insumo.id)}>
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

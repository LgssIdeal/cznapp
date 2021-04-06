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
import {Edit, Delete, AccountTree} from '@material-ui/icons'
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import UnidadeService from '../../../services/UnidadeService';
import {useParams} from 'react-router-dom';
import {Alert} from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, pageable, ...rest }) => {
  let {clienteId}  = useParams();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [selectedUnidadeIds, setSelectedUnidadeIds] = useState([]);
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
    let newSelectedUnidadeIds;

    if (event.target.checked) {
      newSelectedUnidadeIds = lpageable.content.map((unidade) => unidade.id);
    } else {
      newSelectedUnidadeIds = [];
    }

    setSelectedUnidadeIds(newSelectedUnidadeIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedUnidadeIds.indexOf(id);
    let newSelectedUnidadeIds = [];

    if (selectedIndex === -1) {
      newSelectedUnidadeIds = newSelectedUnidadeIds.concat(selectedUnidadeIds, id);
    } else if (selectedIndex === 0) {
      newSelectedUnidadeIds = newSelectedUnidadeIds.concat(selectedUnidadeIds.slice(1));
    } else if (selectedIndex === selectedUnidadeIds.length - 1) {
      newSelectedUnidadeIds = newSelectedUnidadeIds.concat(selectedUnidadeIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedUnidadeIds = newSelectedUnidadeIds.concat(
        selectedUnidadeIds.slice(0, selectedIndex),
        selectedUnidadeIds.slice(selectedIndex + 1)
      );
    }

    setSelectedUnidadeIds(newSelectedUnidadeIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleAlterUnidade = (idUnidade) => {
    navigate('/app/unidades/cliente/' + clienteId + '/' + idUnidade, {replace : true});
  }

  const handleNavegarToClinicas = (unidadeId) => {
    navigate('/app/clinicas/' + clienteId + '/' + unidadeId, {replace : true});
  }

  const handleDeleteUnidade = (idUnidade) => {

    confirmAlert({
      title: 'Confirmação',
      message: 'Deseja excluir a unidade?',
      buttons: [
        {
          label:'Sim',
          onClick: () => {

            UnidadeService.deleteUnidade(idUnidade)
              .then((result) => {
                  
                confirmAlert({
                  title: 'Informação',
                  message: 'Unidade excluída',
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

    UnidadeService.getUnidades(page + 1, limit, clienteId)
      .then((result) => {
        setLoading(false);
        setLpageable(result.data);
      })
      .catch((error) => {
        if(error.data) {
          setLoading(false);
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
                    checked={selectedUnidadeIds.length === lpageable.content.length}
                    color="primary"
                    indeterminate={
                      selectedUnidadeIds.length > 0
                      && selectedUnidadeIds.length < lpageable.content.length
                    }
                    onChange={handleSelectAll}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  Unidade
                </StyledTableCell>
                <StyledTableCell>
                  Sigla
                </StyledTableCell>
                <StyledTableCell>
                  Ações
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lpageable.content.slice(0, limit).map((unidade) => (
                <TableRow
                  hover
                  key={unidade.id}
                  selected={selectedUnidadeIds.indexOf(unidade.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedUnidadeIds.indexOf(unidade.id) !== -1}
                      onChange={(event) => handleSelectOne(event, unidade.id)}
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
                        {unidade.descricao}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {unidade.sigla}
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <IconButton
                        title="Editar unidade"
                        onClick={(event) => handleAlterUnidade(unidade.id)}>
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton
                        title="Excluir unidade" color="secondary"
                        onClick={(event) => handleDeleteUnidade(unidade.id)}>
                          <Delete />
                      </IconButton>
                      <IconButton
                        title="Clínicas" color="secondary"
                        onClick={(event) => handleNavegarToClinicas(unidade.id)}>
                          <AccountTree />
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

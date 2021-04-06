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
import { Edit, Delete, Block, Check } from '@material-ui/icons'
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import ClinicaService from '../../../services/ClinicaService';
import {Alert} from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, clienteId, unidadeId, pageable, ...rest }) => {
  
  const classes = useStyles();
  const [loading, setLoading] = useState(true)
  const [selectedClinicaIds, setSelectedClinicaIds] = useState([]);
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
    let newSelectedClinicaIds;

    if (event.target.checked) {
      newSelectedClinicaIds = lpageable.content.map((clinica) => clinica.id);
    } else {
      newSelectedClinicaIds = [];
    }

    setSelectedClinicaIds(newSelectedClinicaIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedClinicaIds.indexOf(id);
    let newSelectedClinicaIds = [];

    if (selectedIndex === -1) {
      newSelectedClinicaIds = newSelectedClinicaIds.concat(selectedClinicaIds, id);
    } else if (selectedIndex === 0) {
      newSelectedClinicaIds = newSelectedClinicaIds.concat(selectedClinicaIds.slice(1));
    } else if (selectedIndex === selectedClinicaIds.length - 1) {
      newSelectedClinicaIds = newSelectedClinicaIds.concat(selectedClinicaIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedClinicaIds = newSelectedClinicaIds.concat(
        selectedClinicaIds.slice(0, selectedIndex),
        selectedClinicaIds.slice(selectedIndex + 1)
      );
    }

    setSelectedClinicaIds(newSelectedClinicaIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleAlterClinica = (clinicaId) => {
    navigate('/app/clinicas/' + clienteId + '/' + unidadeId + '/' + clinicaId, {replace : true});
  }

  const handleDeleteClinica = (clinicaId) => {

    confirmAlert({
      title: 'Confirmação',
      message: 'Deseja excluir a clínica?',
      buttons: [
        {
          label:'Sim',
          onClick: () => {

            ClinicaService.deleteClinica(clinicaId)
              .then((result) => {
                  
                confirmAlert({
                  title: 'Informação',
                  message: 'Clinica excluída',
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

    ClinicaService.getClinicas(page + 1, limit, unidadeId)
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
                    checked={selectedClinicaIds.length === lpageable.content.length}
                    color="primary"
                    indeterminate={
                      selectedClinicaIds.length > 0
                      && selectedClinicaIds.length < lpageable.content.length
                    }
                    onChange={handleSelectAll}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  Clínica
                </StyledTableCell>
                <StyledTableCell align="center">
                  Sigla
                </StyledTableCell>
                <StyledTableCell align="center">
                  Permite acompanhante
                </StyledTableCell>
                <StyledTableCell align="center">
                  Ações
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lpageable.content.slice(0, limit).map((clinica) => (
                <TableRow
                  hover
                  key={clinica.id}
                  selected={selectedClinicaIds.indexOf(clinica.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedClinicaIds.indexOf(clinica.id) !== -1}
                      onChange={(event) => handleSelectOne(event, clinica.id)}
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
                        {clinica.descricao}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {clinica.sigla}
                  </TableCell>
                  <TableCell align="center">
                    {clinica.permiteAcompanhante ? <Check /> : <Block />}
                  </TableCell>
                  <TableCell align="center">
                    <Typography>
                      <IconButton
                        title="Editar clínica"
                        onClick={(event) => handleAlterClinica(clinica.id)}>
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton
                        title="Excluir clínica" color="secondary"
                        onClick={(event) => handleDeleteClinica(clinica.id)}>
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

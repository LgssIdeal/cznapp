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
import {Edit, Delete} from '@material-ui/icons'
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import SuplementoService from '../../../services/SuplementoService';
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
  const [selectedSuplementoIds, setSelectedSuplementoIds] = useState([]);
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
    let newSelectedSuplementoIds;

    if (event.target.checked) {
      newSelectedSuplementoIds = lpageable.content.map((suplemento) => suplemento.id);
    } else {
      newSelectedSuplementoIds = [];
    }

    setSelectedSuplementoIds(newSelectedSuplementoIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedSuplementoIds.indexOf(id);
    let newSelectedSuplementoIds = [];

    if (selectedIndex === -1) {
      newSelectedSuplementoIds = newSelectedSuplementoIds.concat(selectedSuplementoIds, id);
    } else if (selectedIndex === 0) {
      newSelectedSuplementoIds = newSelectedSuplementoIds.concat(selectedSuplementoIds.slice(1));
    } else if (selectedIndex === selectedSuplementoIds.length - 1) {
      newSelectedSuplementoIds = newSelectedSuplementoIds.concat(selectedSuplementoIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedSuplementoIds = newSelectedSuplementoIds.concat(
        selectedSuplementoIds.slice(0, selectedIndex),
        selectedSuplementoIds.slice(selectedIndex + 1)
      );
    }

    setSelectedSuplementoIds(newSelectedSuplementoIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleAlterSuplemento = (suplementoId) => {
    navigate('/app/suplementos/' + suplementoId, {replace : true});
  }

  const handleDeleteSuplemento = (suplementoId) => {

    confirmAlert({
      title: 'Confirmação',
      message: 'Deseja excluir o suplemento?',
      buttons: [
        {
          label:'Sim',
          onClick: () => {

            SuplementoService.deleteSuplemento(suplementoId)
              .then((result) => {
                  
                confirmAlert({
                  title: 'Informação',
                  message: 'Suplemento excluído',
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

    SuplementoService.getSuplementos(page + 1, limit)
      .then((result) => {
        setLoading(false);
        setLpageable(result.data);
      })
      .catch((error) => {
        setLoading(false);
        if(error.response.data) {
          setErrorMsg(error.response.data.detail);
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
                    checked={selectedSuplementoIds.length === lpageable.content.length}
                    color="primary"
                    indeterminate={
                      selectedSuplementoIds.length > 0
                      && selectedSuplementoIds.length < lpageable.content.length
                    }
                    onChange={handleSelectAll}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  Suplemento
                </StyledTableCell>
                <StyledTableCell>
                  Dieta
                </StyledTableCell>
                <StyledTableCell>
                  Ações
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lpageable.content.slice(0, limit).map((suplemento) => (
                <TableRow
                  hover
                  key={suplemento.id}
                  selected={selectedSuplementoIds.indexOf(suplemento.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedSuplementoIds.indexOf(suplemento.id) !== -1}
                      onChange={(event) => handleSelectOne(event, suplemento.id)}
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
                        {suplemento.descricao}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {suplemento.tipoDieta && suplemento.tipoDieta.sigla}
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <IconButton
                        title="Editar suplemento"
                        onClick={(event) => handleAlterSuplemento(suplemento.id)}>
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton
                        title="Excluir suplemento" color="primary"
                        onClick={(event) => handleDeleteSuplemento(suplemento.id)}>
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

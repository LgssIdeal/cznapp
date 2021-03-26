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
import TipoDietaService from '../../../services/TipoDietaService';
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
  const [selectedTipoDietaIds, setSelectedTipoDietaIds] = useState([]);
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
    let newSelectedTipoDietaIds;

    if (event.target.checked) {
      newSelectedTipoDietaIds = lpageable.content.map((tipoDieta) => tipoDieta.id);
    } else {
      newSelectedTipoDietaIds = [];
    }

    setSelectedTipoDietaIds(newSelectedTipoDietaIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedTipoDietaIds.indexOf(id);
    let newSelectedTipoDietaIds = [];

    if (selectedIndex === -1) {
      newSelectedTipoDietaIds = newSelectedTipoDietaIds.concat(selectedTipoDietaIds, id);
    } else if (selectedIndex === 0) {
      newSelectedTipoDietaIds = newSelectedTipoDietaIds.concat(selectedTipoDietaIds.slice(1));
    } else if (selectedIndex === selectedTipoDietaIds.length - 1) {
      newSelectedTipoDietaIds = newSelectedTipoDietaIds.concat(selectedTipoDietaIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedTipoDietaIds = newSelectedTipoDietaIds.concat(
        selectedTipoDietaIds.slice(0, selectedIndex),
        selectedTipoDietaIds.slice(selectedIndex + 1)
      );
    }

    setSelectedTipoDietaIds(newSelectedTipoDietaIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleAlterTipoDieta = (tipoDietaId) => {
    navigate('/app/tiposdieta/' + tipoDietaId, {replace : true});
  }

  const handleGoToComplementos = (tipoDietaId) => {
    navigate('/app/tiposdietacomplementar/tipodieta/' + tipoDietaId);
  }

  const handleDeleteTipoDieta = (tipoDietaId) => {

    confirmAlert({
      title: 'Confirmação',
      message: 'Deseja excluir o tipo de dieta?',
      buttons: [
        {
          label:'Sim',
          onClick: () => {

            TipoDietaService.deleteTipoDieta(tipoDietaId)
              .then((result) => {
                  
                confirmAlert({
                  title: 'Informação',
                  message: 'Tipo de dieta excluido',
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

    TipoDietaService.getTiposDieta(page + 1, limit)
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
                    checked={selectedTipoDietaIds.length === lpageable.content.length}
                    color="primary"
                    indeterminate={
                      selectedTipoDietaIds.length > 0
                      && selectedTipoDietaIds.length < lpageable.content.length
                    }
                    onChange={handleSelectAll}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  Tipo de dieta
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
              {lpageable.content.slice(0, limit).map((tipoDieta) => (
                <TableRow
                  hover
                  key={tipoDieta.id}
                  selected={selectedTipoDietaIds.indexOf(tipoDieta.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedTipoDietaIds.indexOf(tipoDieta.id) !== -1}
                      onChange={(event) => handleSelectOne(event, tipoDieta.id)}
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
                        {tipoDieta.descricao}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {tipoDieta.sigla}
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <IconButton
                        title="Editar tipo de dieta"
                        onClick={(event) => handleAlterTipoDieta(tipoDieta.id)}>
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton
                        title="Excluir tipo de dieta" color="primary"
                        onClick={(event) => handleDeleteTipoDieta(tipoDieta.id)}>
                          <Delete />
                      </IconButton>
                      <IconButton
                        title="Complementos" color="primary"
                        onClick={(event) => handleGoToComplementos(tipoDieta.id)}>
                          <Dehaze />
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

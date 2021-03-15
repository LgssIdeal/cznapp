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
import TipoDietaComplementarService from '../../../services/TipoDietaComplementarService';
import {useParams} from 'react-router-dom';
import {Alert} from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, pageable, ...rest }) => {
  let {tipoDietaId}  = useParams();
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [selectedTipoDietaCompIds, setSelectedTipoDietaCompIds] = useState([]);
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
    let newSelectedTipoDietaCompIds;

    if (event.target.checked) {
      newSelectedTipoDietaCompIds = lpageable.content.map((tipoDietaComp) => tipoDietaComp.id);
    } else {
      newSelectedTipoDietaCompIds = [];
    }

    setSelectedTipoDietaCompIds(newSelectedTipoDietaCompIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedTipoDietaCompIds.indexOf(id);
    let newSelectedTipoDietaCompIds = [];

    if (selectedIndex === -1) {
      newSelectedTipoDietaCompIds = newSelectedTipoDietaCompIds.concat(selectedTipoDietaCompIds, id);
    } else if (selectedIndex === 0) {
      newSelectedTipoDietaCompIds = newSelectedTipoDietaCompIds.concat(selectedTipoDietaCompIds.slice(1));
    } else if (selectedIndex === selectedTipoDietaCompIds.length - 1) {
      newSelectedTipoDietaCompIds = newSelectedTipoDietaCompIds.concat(selectedTipoDietaCompIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedTipoDietaCompIds = newSelectedTipoDietaCompIds.concat(
        selectedTipoDietaCompIds.slice(0, selectedIndex),
        selectedTipoDietaCompIds.slice(selectedIndex + 1)
      );
    }

    setSelectedTipoDietaCompIds(newSelectedTipoDietaCompIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleAlterTipoDietaComp = (tipoDietaCompId) => {
    navigate('/app/tiposdietacomplementar/tipodieta/' + tipoDietaId + '/' + tipoDietaCompId, {replace : true});
  }

  const handleDeleteTipoDietaComp = (tipoDietaCompId) => {

    confirmAlert({
      title: 'Confirmação',
      message: 'Deseja excluir o tipo de dieta complementar?',
      buttons: [
        {
          label:'Sim',
          onClick: () => {

            TipoDietaComplementarService.deleteTipoDietaComplementar(tipoDietaCompId)
              .then((result) => {
                  
                confirmAlert({
                  title: 'Informação',
                  message: 'Tipo de dieta complementar excluída.',
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

    TipoDietaComplementarService.getTiposDietaComplementar(page + 1, limit, tipoDietaId)
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
                    checked={selectedTipoDietaCompIds.length === lpageable.content.length}
                    color="primary"
                    indeterminate={
                      selectedTipoDietaCompIds.length > 0
                      && selectedTipoDietaCompIds.length < lpageable.content.length
                    }
                    onChange={handleSelectAll}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  Dieta complementar
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
              {lpageable.content.slice(0, limit).map((tipoDietaComp) => (
                <TableRow
                  hover
                  key={tipoDietaId.id}
                  selected={selectedTipoDietaCompIds.indexOf(tipoDietaComp.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedTipoDietaCompIds.indexOf(tipoDietaComp.id) !== -1}
                      onChange={(event) => handleSelectOne(event, tipoDietaComp.id)}
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
                        {tipoDietaComp.descricao}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {tipoDietaComp.sigla}
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <IconButton
                        title="Editar dieta complementar"
                        onClick={(event) => handleAlterTipoDietaComp(tipoDietaComp.id)}>
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton
                        title="Excluir dieta complementar" color="secondary"
                        onClick={(event) => handleDeleteTipoDietaComp(tipoDietaComp.id)}>
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

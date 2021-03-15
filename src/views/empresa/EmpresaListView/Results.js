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
import EmpresaService from '../../../services/EmpresaService'
import { Alert } from '@material-ui/lab';


const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, pageable, ...rest }) => {
  const classes = useStyles();
  const [selectedEmpresaIds, setSelectedEmpresaIds] = useState([]);
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
    let newSelectedEmpresaIds;

    if (event.target.checked) {
      newSelectedEmpresaIds = lpageable.content.map((empresa) => empresa.id);
    } else {
      newSelectedEmpresaIds = [];
    }

    setSelectedEmpresaIds(newSelectedEmpresaIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedEmpresaIds.indexOf(id);
    let newSelectedEmpresaIds = [];

    if (selectedIndex === -1) {
      newSelectedEmpresaIds = newSelectedEmpresaIds.concat(selectedEmpresaIds, id);
    } else if (selectedIndex === 0) {
      newSelectedEmpresaIds = newSelectedEmpresaIds.concat(selectedEmpresaIds.slice(1));
    } else if (selectedIndex === selectedEmpresaIds.length - 1) {
      newSelectedEmpresaIds = newSelectedEmpresaIds.concat(selectedEmpresaIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedEmpresaIds = newSelectedEmpresaIds.concat(
        selectedEmpresaIds.slice(0, selectedIndex),
        selectedEmpresaIds.slice(selectedIndex + 1)
      );
    }

    setSelectedEmpresaIds(newSelectedEmpresaIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleAlterEmpresa = (idEmpresa) => {
    console.log("Empresa ID: ", idEmpresa);
    navigate('/app/empresa/' + idEmpresa, {replace : true});
  }

  const handleDeleteEmpresa = (idEmpresa) => {

    confirmAlert({
      title: 'Confirmação',
      message: 'Deseja excluir a empresa?',
      buttons: [
        {
          label:'Sim',
          onClick: () => {

            EmpresaService.deleteEmpresa(idEmpresa)
              .then((result) => {
                  
                confirmAlert({
                  title: 'Informação',
                  message: 'Empresa excluída',
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

    EmpresaService.getEmpresas(page + 1, limit)
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
                    checked={selectedEmpresaIds.length === lpageable.content.length}
                    color="primary"
                    indeterminate={
                      selectedEmpresaIds.length > 0
                      && selectedEmpresaIds.length < lpageable.content.length
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
              {lpageable.content.slice(0, limit).map((empresa) => (
                <TableRow
                  hover
                  key={empresa.id}
                  selected={selectedEmpresaIds.indexOf(empresa.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedEmpresaIds.indexOf(empresa.id) !== -1}
                      onChange={(event) => handleSelectOne(event, empresa.id)}
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
                        {empresa.razaoSocial}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {empresa.fantasia}
                  </TableCell>
                  <TableCell>
                    {empresa.documento}
                  </TableCell>
                  <TableCell>
                    {empresa.ie}
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <IconButton
                        aria-label="Editar empresa"
                        onClick={(event) => handleAlterEmpresa(empresa.id)}>
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton
                        aria-label="Excluir empresa" color="secondary"
                        onClick={(event) => handleDeleteEmpresa(empresa.id)}>
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

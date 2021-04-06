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
import {Edit, Delete} from '@material-ui/icons'
import getInitials from '../../../utils/getInitials';
import { useNavigate } from 'react-router-dom';
import { confirmAlert, alert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import UsuarioService from '../../../services/UsuarioService'
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

  const [selectedUserIds, setSelectedUserIds] = useState([]);
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
    let newSelectedUserIds;

    if (event.target.checked) {
      newSelectedUserIds = lpageable.content.map((user) => user.id);
    } else {
      newSelectedUserIds = [];
    }

    setSelectedUserIds(newSelectedUserIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedUserIds.indexOf(id);
    let newSelectedUserIds = [];

    if (selectedIndex === -1) {
      newSelectedUserIds = newSelectedUserIds.concat(selectedUserIds, id);
    } else if (selectedIndex === 0) {
      newSelectedUserIds = newSelectedUserIds.concat(selectedUserIds.slice(1));
    } else if (selectedIndex === selectedUserIds.length - 1) {
      newSelectedUserIds = newSelectedUserIds.concat(selectedUserIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedUserIds = newSelectedUserIds.concat(
        selectedUserIds.slice(0, selectedIndex),
        selectedUserIds.slice(selectedIndex + 1)
      );
    }

    setSelectedUserIds(newSelectedUserIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleAlterUser = (idUser) => {
    navigate('/app/usuario/' + idUser, {replace : true});
  }

  const handleDeleteUser = (idUser) => {

    confirmAlert({
      title: 'Confirmação',
      message: 'Deseja excluir o usuário?',
      buttons: [
        {
          label:'Sim',
          onClick: () => {

            UsuarioService.deleteUsuario(idUser)
              .then((result) => {
                  
                confirmAlert({
                  title: 'Informação',
                  message: 'Usuário excluído',
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
  
  const map = new Map();
  map.set("ADMINISTRADOR", "Administrador");
  map.set("CORPO_TECNICO", "Corpo técnico");
  map.set("SND", "SND");


  useEffect(() => {

    if(JSON.parse(localStorage.getItem("@app-user")).perfil !== 'ADMINISTRADOR') {
      navigate("/app/401", {}); 
    }

    UsuarioService.getUsuarios(page + 1, limit)
      .then((result) => {
        setLpageable(result.data);
        setLoading(false);
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
                    checked={selectedUserIds.length === lpageable.content.length}
                    color="primary"
                    indeterminate={
                      selectedUserIds.length > 0
                      && selectedUserIds.length < lpageable.content.length
                    }
                    onChange={handleSelectAll}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  Nome
                </StyledTableCell>
                <StyledTableCell>
                  Perfil
                </StyledTableCell>
                <StyledTableCell>
                  Orgão de classe
                </StyledTableCell>
                <StyledTableCell>
                  Login
                </StyledTableCell>
                <StyledTableCell>
                  Ações
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lpageable.content.slice(0, limit).map((user) => (
                <TableRow
                  hover
                  key={user.id}
                  selected={selectedUserIds.indexOf(user.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedUserIds.indexOf(user.id) !== -1}
                      onChange={(event) => handleSelectOne(event, user.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      alignItems="center"
                      display="flex"
                    >
                      <Avatar
                        className={classes.avatar}
                        src={'https://www.gravatar.com/avatar/default?s=200&r=pg&d=mm'}
                      >
                        {getInitials(user.nome)}
                      </Avatar>
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {user.nome}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {map.get(user.perfil)}
                  </TableCell>
                  <TableCell>
                    {user.orgaoClasse}
                  </TableCell>
                  <TableCell>
                    {user.login}
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <IconButton
                        aria-label="Editar usuário"
                        onClick={(event) => handleAlterUser(user.id)}>
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton
                        aria-label="Excluir usuário" color="secondary"
                        onClick={(event) => handleDeleteUser(user.id)}>
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

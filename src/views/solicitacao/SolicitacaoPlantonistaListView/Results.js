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
import {Edit, Delete, PictureAsPdfOutlined} from '@material-ui/icons'
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { zonedTimeToUtc, format } from 'date-fns-tz';
import SolicitacaoPlantonistaService from '../../../services/SolicitacaoPlantonistaService';
import {Alert} from '@material-ui/lab';


const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, contratoId, unidadeId, dataReferencia, pageable, ...rest }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [selectedSolIds, setSelectedSolIds] = useState([]);
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [isTokenExpired, setTokenExpired] = useState(false);
  const navigate = useNavigate();
  const [lpageable, setLpageable] = useState({
    content : [],
    totalElements : 0
  });
  const [reload, setReload] = useState(0);

  const mapRef = new Map();
  mapRef.set("DESJEJUM", "Desjejum");
  mapRef.set("LANCHE_1", "Colação");
  mapRef.set("ALMOCO", "Almoço");
  mapRef.set("LANCHE_2", "Lanche tarde");
  mapRef.set("JANTAR", "Jantar");
  mapRef.set("CEIA", "Ceia");

  const handleSelectAll = (event) => {
    let newSelectedSolIds;

    if (event.target.checked) {
      newSelectedSolIds = lpageable.content.map((sol) => sol.id);
    } else {
      newSelectedSolIds = [];
    }

    setSelectedSolIds(newSelectedSolIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedSolIds.indexOf(id);
    let newSelectedSolIds = [];

    if (selectedIndex === -1) {
      newSelectedSolIds = newSelectedSolIds.concat(selectedSolIds, id);
    } else if (selectedIndex === 0) {
      newSelectedSolIds = newSelectedSolIds.concat(selectedSolIds.slice(1));
    } else if (selectedIndex === selectedSolIds.length - 1) {
      newSelectedSolIds = newSelectedSolIds.concat(selectedSolIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedSolIds = newSelectedSolIds.concat(
        selectedSolIds.slice(0, selectedIndex),
        selectedSolIds.slice(selectedIndex + 1)
      );
    }

    setSelectedSolIds(newSelectedSolIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleAlterSolicitacao = (solicitacaoId) => {
    navigate('/app/solicitacoesplantonista/' + contratoId + '/' + unidadeId + '/' + dataReferencia + '/'+ solicitacaoId, {replace : true});
  }

  const handleDeleteSolicitacao = (solicitacaoId) => {

    confirmAlert({
      title: 'Confirmação',
      message: 'Deseja excluir a solicitacao?',
      buttons: [
        {
          label:'Sim',
          onClick: () => {

            SolicitacaoPlantonistaService.deleteSolicitacao(solicitacaoId)
              .then((result) => {
                  
                confirmAlert({
                  title: 'Informação',
                  message: 'Solicitação excluida.',
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
                console.log(error.response);
                var err = JSON.stringify(error);
                if(!err.includes("401")) {
                  if(error.response.data) {
                    setErrorMsg(error.response.data.detail);
                  } else {
                    setErrorMsg(err);
                  }
                  
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

  const handleExportaPdf = (solicitacaoId) => {
    setLoading(true);
    SolicitacaoPlantonistaService.getPdf(solicitacaoId)
      .then((result) => {
        
        const linkSource = result.data;
        const downloadLink = document.createElement("a");
        const fileName = "plantonista_" + contratoId + "_" + unidadeId + "_" + dataReferencia + ".pdf";
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();

      })
      .catch((error) => {
        setErrorMsg(JSON.stringify(error))
      })
      .finally(() => setLoading(false));
  }
  

  useEffect(() => {

    SolicitacaoPlantonistaService.getSolicitacoes(contratoId, unidadeId, dataReferencia, page + 1, limit)
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

  }, [contratoId, unidadeId, dataReferencia, page, limit, reload]);

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
                    checked={selectedSolIds.length === lpageable.content.length}
                    color="primary"
                    indeterminate={
                      selectedSolIds.length > 0
                      && selectedSolIds.length < lpageable.content.length
                    }
                    onChange={handleSelectAll}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  Data Solicitação
                </StyledTableCell>
                <StyledTableCell>
                  Data referência
                </StyledTableCell>
                <StyledTableCell>
                  Usuário Solicitante
                </StyledTableCell>
                <StyledTableCell align="center">
                  Ações
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lpageable.content.slice(0, limit).map((sol) => (
                <TableRow
                  hover
                  key={sol.id}
                  selected={selectedSolIds.indexOf(sol.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedSolIds.indexOf(sol.id) !== -1}
                      onChange={(event) => handleSelectOne(event, sol.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    {format(
                          zonedTimeToUtc(
                            sol.dataSolicitacao, 
                        'America/Sao_Paulo'), "dd/MM/yyyy HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    {format(
                          zonedTimeToUtc(
                            sol.dataReferencia, 
                        'America/Sao_Paulo'), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    {sol.usuarioSolicitacao && sol.usuarioSolicitacao.nome}
                  </TableCell>
                  <TableCell align="center">
                    <Typography>
                      <IconButton
                        title="Exportar em pdf" color="primary"
                        onClick={(event) => handleExportaPdf(sol.id)}>
                          <PictureAsPdfOutlined />
                      </IconButton>
                      <IconButton
                        title="Editar solicitação"
                        onClick={(event) => handleAlterSolicitacao(sol.id)}>
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton
                        title="Excluir solicitacao" color="primary"
                        onClick={(event) => handleDeleteSolicitacao(sol.id)}>
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

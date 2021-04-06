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
import {List, ListAlt, Details, Search, SearchRounded, SearchOutlined, SearchTwoTone} from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {useParams} from 'react-router-dom';
import {Alert} from '@material-ui/lab';
import { zonedTimeToUtc, format } from 'date-fns-tz';
import SolicitacaoService from '../../../services/SolicitacaoService';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, pageable, contratoId, unidadeId, clinicaId, refeicao, dataReferencia, ...rest }) => {
  
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
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
  const [clinicaSel, setClinicaSel] = useState();

  const map = new Map();
  map.set("DESJEJUM", "Desjejum");
  map.set("LANCHE_1", "Lanche 1");
  map.set("ALMOCO", "Almoço");
  map.set("LANCHE_2", "Lanche 2");
  map.set("JANTAR", "Jantar");
  map.set("CEIA", "Ceia");

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleAlterMapa = (solicitacaoId) => {
    navigate('/app/solicitacoes/' + contratoId + '/' + 
                                    unidadeId + '/' + 
                                    clinicaId + '/' + 
                                    dataReferencia + '/' + solicitacaoId, {replace : true});
  }

  const handleShowResumo = (solicitacaoId, refeicao) => {
    navigate('/app/solicitacoes/' + contratoId + '/' + 
                                    unidadeId + '/' + 
                                    clinicaId + '/' + 
                                    refeicao + '/' +
                                    dataReferencia + '/' + solicitacaoId + "/resumo", {replace : true});
  }

  useEffect(() => {
    setLoading(true);
    SolicitacaoService.getSolicitacoes(contratoId, unidadeId, clinicaId, dataReferencia, (page + 1), limit)
      .then((result) => {
        setLoading(false);
        setLpageable(result.data);
      })
      .catch((error) => {
        setLoading(false);
        if(error.response) {
          setErrorMsg(error.response.data.detail);
        } else {
          var e = JSON.stringify(error);
          if(e.includes("401")) {
            setTokenExpired(1);
          } else {
            setErrorMsg(e);
          }
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
        <Box >
          {loading && <LinearProgress></LinearProgress>}
          {errorMsg &&
                  <Alert severity="error">{errorMsg}</Alert>}
          {clinicaSel &&
            <Typography
              variant="h3">
                Clínica: {clinicaSel.descricao} ({clinicaSel.sigla})
            </Typography>  
          }
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>
                  Data criação
                </StyledTableCell>
                <StyledTableCell>
                  Data referência
                </StyledTableCell>
                <StyledTableCell>
                  Refeição
                </StyledTableCell>
                <StyledTableCell>
                  Criado por
                </StyledTableCell>
                <StyledTableCell>
                  Ações
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lpageable.content.slice(0, limit).map((solicitacao) => (
                <TableRow
                  hover
                  key={solicitacao.id}>
                  <TableCell>
                    <Box
                      alignItems="center"
                      display="flex"
                    >
                      
                        {format(
                          zonedTimeToUtc(
                          solicitacao.dataCriacao, 
                        'America/Sao_Paulo'), "dd/MM/yyyy HH:mm:ss")}
                      
                    </Box>
                  </TableCell>
                  <TableCell>
                  {format(
                      zonedTimeToUtc(
                        solicitacao.dataReferencia, 
                        'America/Sao_Paulo'), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    {map.get(solicitacao.refeicao)}
                  </TableCell>
                  <TableCell>
                    {solicitacao.usuarioCriacao.nome}
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <IconButton
                        title="Visualizar solicitações detalhadas"
                        onClick={(event) => handleAlterMapa(solicitacao.id)}>
                        <Search color="primary" />
                      </IconButton>
                      <IconButton
                        title="Visualizar resumo"
                        onClick={(event) => handleShowResumo(solicitacao.id, solicitacao.refeicao)}>
                        <ListAlt color="primary" />
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

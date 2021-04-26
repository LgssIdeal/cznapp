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
  LinearProgress,
  CardHeader,
  CardContent,
  Grid,
  Button,
  Icon
} from '@material-ui/core';
import {Edit, Delete} from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {useParams} from 'react-router-dom';
import {Alert} from '@material-ui/lab';
import { zonedTimeToUtc, format } from 'date-fns-tz';
import SolicitacaoService from '../../../services/SolicitacaoService';
import ClinicaService from '../../../services/ClinicaService';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, pageable, contratoId, unidadeId, clinicaId, dataReferencia, solicitacaoId, ...rest }) => {
  
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [isTokenExpired, setTokenExpired] = useState(false);
  const navigate = useNavigate();
  const [itens, setItens] = useState([]);
  const [reload, setReload] = useState(0);
  const [clinicaSel, setClinicaSel] = useState();

  const map = new Map();
  map.set("DESJEJUM", "Desjejum");
  map.set("LANCHE_1", "Lanche 1");
  map.set("ALMOCO", "Almoço");
  map.set("LANCHE_2", "Lanche 2");
  map.set("JANTAR", "Jantar");
  map.set("CEIA", "Ceia");

  const mapTipoId = new Map();
  mapTipoId.set("RG", "Rg");
  mapTipoId.set("CPF", "Cpf");
  mapTipoId.set("CARTAO_SUS", "Nro. SUS");
  mapTipoId.set("OUTRO", "Outro");

  
  const handleAlterMapa = (mapaId) => {
    navigate('/app/mapas/' + clinicaId + '/' + mapaId, {replace : true});
  }

  useEffect(() => {
    setLoading(true);
    SolicitacaoService.getItens(solicitacaoId)
      .then((result) => {
        setLoading(false);
        setItens(result.data);
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
      
  }, []);

  useEffect(() => {
    setLoading(true);
      ClinicaService.getClinica(clinicaId)
        .then((result) => {
          setClinicaSel(result.data);
        })
        .catch((error) =>{
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
        })
        .finally(() => setLoading(false));
  }, [itens])

  useEffect(() =>{
    if(isTokenExpired) {
      navigate('/', {replace : true});
    }
  },[isTokenExpired]);

  const handleGoBack = () => {
    navigate('/app/solicitacoes/' + contratoId + '/' + unidadeId + '/' + clinicaId + '/' + dataReferencia, {replace : true});
  }

  const handleUpdateItem = (solicitacaoItemId) => {
    navigate('/app/solicitacoes/' + contratoId + '/' + unidadeId + '/' + clinicaId + '/' + dataReferencia + '/' + solicitacaoId + '/' + solicitacaoItemId, {replace: true});
  }

  const handleGetPdf = () => {
    setLoading(true);
    SolicitacaoService.getItensPdf(solicitacaoId)
      .then((result) => {
        
        const linkSource = result.data;
        const downloadLink = document.createElement("a");
        const fileName = "mapaSolicitacoes_" + dataReferencia + "_" + solicitacaoId +".pdf";
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();

      })
      .catch((error) => {
        setErrorMsg(JSON.stringify(error))
      })
      .finally(() => setLoading(false));
  }

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
      <CardHeader
        title={'Mapa de refeições analítico. Clinica: ' + (clinicaSel && clinicaSel.descricao + " (" + clinicaSel.sigla + ")")}>

      </CardHeader>
      <CardContent>
        <PerfectScrollbar>
          <Box minWidth={1050}>
            {loading && <LinearProgress></LinearProgress>}
            {errorMsg &&
                    <Alert severity="error">{errorMsg}</Alert>}
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
                    Leito
                  </StyledTableCell>
                  <StyledTableCell>
                    Paciente
                  </StyledTableCell>
                  <StyledTableCell>
                    Dieta
                  </StyledTableCell>
                  <StyledTableCell>
                    Observações
                  </StyledTableCell>
                  <StyledTableCell>
                    Ações
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {itens.map((item) => (
                  <TableRow
                    hover
                    key={item.id}>
                    <TableCell>
                      <Box
                        alignItems="center"
                        display="flex"
                      >
                        {format(
                            zonedTimeToUtc(
                            item.dataCriacao, 
                          'America/Sao_Paulo'), "dd/MM/yyyy HH:mm:ss")}
                        
                      </Box>
                    </TableCell>
                    <TableCell>
                    {format(
                        zonedTimeToUtc(
                          item.dataReferencia, 
                          'America/Sao_Paulo'), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>
                      {map.get(item.refeicao)}
                    </TableCell>
                    <TableCell>
                      {item.leito === '9999' ? '' : item.leito}
                    </TableCell>
                    <TableCell>
                      {item.paciente}
                    </TableCell>
                    <TableCell>
                      {item.tipoDieta && item.tipoDieta.sigla}
                      {item.tiposDietaComplementar && item.tiposDietaComplementar.map(tp => (
                        ' ' + tp.sigla
                      ))}
                    </TableCell>
                    <TableCell>
                      {item.observacoes}
                    </TableCell>
                    <TableCell>
                      <Typography>
                        <IconButton onClick={(event) => {handleUpdateItem(item.id)}}><Edit color="primary" /></IconButton>
                        <IconButton><Delete color="secondary"/></IconButton>
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
        <Grid container spacing={3} direction="row">
            <Grid item md={2} xs={4}>
              <Button
                  fullWidth
                  color="primary"
                  variant="contained"
                  onClick={handleGoBack}
                  disabled={loading}>
                  Novo
              </Button>
            </Grid>
            <Grid item md={2} xs={4}>
              <Button
                  fullWidth
                  color="secondary"
                  variant="contained"
                  onClick={handleGoBack}
                  disabled={loading}>
                  Voltar
              </Button>
            </Grid>
            <Grid item md={2} xs={4}>
            <Button
                fullWidth
                color="secondary"
                variant="contained"
                onClick={handleGetPdf}
                disabled={loading}>
                Gerar PDF
            </Button>
          </Grid>
          </Grid>
      </CardContent>
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  pageable: PropTypes.object
};

export default Results;

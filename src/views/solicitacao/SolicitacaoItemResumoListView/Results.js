import { v4 as uuid } from 'uuid';
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
  Grid,
  CardContent,
  Divider,
  Button
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {Alert} from '@material-ui/lab';
import { zonedTimeToUtc, format } from 'date-fns-tz';
import Base64Downloader from 'react-base64-downloader';
import SolicitacaoService from '../../../services/SolicitacaoService';
import ClinicaService from '../../../services/ClinicaService';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, pageable, contratoId, unidadeId, clinicaId, refeicao, dataReferencia, solicitacaoId, ...rest }) => {
  
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
  const [pdf, setPdf] = useState('');

  const map = new Map();
  map.set("DESJEJUM", "Desjejum");
  map.set("LANCHE_1", "Colação");
  map.set("ALMOCO", "Almoço");
  map.set("LANCHE_2", "Lanche tarde");
  map.set("JANTAR", "Jantar");
  map.set("CEIA", "Ceia");

  useEffect(() => {
    setLoading(true);
    SolicitacaoService.getItensResumo(solicitacaoId)
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
  }, [itens]);



  useEffect(() =>{
    if(isTokenExpired) {
      navigate('/', {replace : true});
    }
  },[isTokenExpired]);

  const handleGoBack = () => {
    navigate('/app/solicitacoes/' + contratoId + '/' + unidadeId + '/' + clinicaId + '/' + dataReferencia, {replace : true});
  }

  const handleGetPdf = () => {
    setLoading(true);
    SolicitacaoService.getItensResumoPdf(solicitacaoId)
      .then((result) => {
        
        const linkSource = result.data;
        const downloadLink = document.createElement("a");
        const fileName = "resumo_" + dataReferencia + "_" + refeicao +".pdf";
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
        title={'Resumo de refeições. '}>
      </CardHeader>
      <CardContent>
        <Divider />  
        <Grid container spacing={3}>
          <Grid item md={12} xs={12}>
            <Typography variant="body2">{'Clinica: ' + (clinicaSel && clinicaSel.descricao + " (" + clinicaSel.sigla + ")")}</Typography>
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="body2">{'Refeição: ' + map.get(refeicao)}</Typography>
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="body2">{'Data de referência: ' + format(
                          zonedTimeToUtc(
                          dataReferencia, 
                        'America/Sao_Paulo'), "dd/MM/yyyy")}</Typography>
          </Grid>
        </Grid>
        <Divider />
        <PerfectScrollbar>
          <Box >
            {loading && <LinearProgress></LinearProgress>}
            {errorMsg &&
                    <Alert severity="error">{errorMsg}</Alert>}
            <Table classNam={classes.table}>
              <TableHead>
                <TableRow>
                  <StyledTableCell>
                    Tipo de Dieta
                  </StyledTableCell>
                  <StyledTableCell>
                    Quantidade
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {itens.map((item) => (
                  <TableRow
                    hover
                    key={uuid()}>
                    <TableCell>
                      {item.tipoDieta}
                    </TableCell>
                    <TableCell>
                      {item.total}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
        <Grid container spacing={3}>
          <Grid item md={2} xs={6}>
            <Button
                fullWidth
                color="secondary"
                variant="contained"
                onClick={handleGoBack}
                disabled={loading}>
                Voltar
            </Button>
            
          </Grid>
          <Grid item md={2} xs={6}>
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

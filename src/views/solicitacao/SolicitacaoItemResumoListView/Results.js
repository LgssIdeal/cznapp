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
import {Edit, FormatListNumbered} from '@material-ui/icons'
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

  const map = new Map();
  map.set("DESJEJUM", "Desjejum");
  map.set("LANCHE_1", "Lanche 1");
  map.set("ALMOCO", "Almoço");
  map.set("LANCHE_2", "Lanche 2");
  map.set("JANTAR", "Jantar");
  map.set("CEIA", "Ceia");

  useEffect(() => {
    setLoading(true);
    SolicitacaoService.getItensResumo(solicitacaoId)
      .then((result) => {
        console.log(result.data);
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
    navigate('/app/solicitacoes/' + contratoId + '/' + unidadeId + '/' + clinicaId + '/' + refeicao + '/' + dataReferencia, {replace : true});
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
          <Grid item md={12} xs={12}>
            <Button
                fullWidth
                color="primary"
                variant="contained"
                onClick={handleGoBack}
                disabled={loading}>
                Voltar
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

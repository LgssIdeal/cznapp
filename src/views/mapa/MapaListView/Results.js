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
import MapaService from '../../../services/MapaService';
import ClinicaService from '../../../services/ClinicaService';
import {useParams} from 'react-router-dom';
import {Alert} from '@material-ui/lab';
import { zonedTimeToUtc, format } from 'date-fns-tz';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, pageable, ...rest }) => {
  let {clinicaId}  = useParams();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [selectedMapaIds, setSelectedMapaIds] = useState([]);
  const [limit, setLimit] = useState(50);
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

  const handleSelectAll = (event) => {
    let newSelectedMapaIds;

    if (event.target.checked) {
      newSelectedMapaIds = lpageable.content.map((mapa) => mapa.id);
    } else {
      newSelectedMapaIds = [];
    }

    setSelectedMapaIds(newSelectedMapaIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedMapaIds.indexOf(id);
    let newSelectedMapaIds = [];

    if (selectedIndex === -1) {
      newSelectedMapaIds = newSelectedMapaIds.concat(selectedMapaIds, id);
    } else if (selectedIndex === 0) {
      newSelectedMapaIds = newSelectedMapaIds.concat(selectedMapaIds.slice(1));
    } else if (selectedIndex === selectedMapaIds.length - 1) {
      newSelectedMapaIds = newSelectedMapaIds.concat(selectedMapaIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedMapaIds = newSelectedMapaIds.concat(
        selectedMapaIds.slice(0, selectedIndex),
        selectedMapaIds.slice(selectedIndex + 1)
      );
    }

    setSelectedMapaIds(newSelectedMapaIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleAlterMapa = (mapaId) => {
    navigate('/app/mapas/' + clinicaId + '/' + mapaId, {replace : true});
  }

  useEffect(() => {
    setLoading(true);

    ClinicaService.getClinica(clinicaId)
      .then((result) => {
        setClinicaSel(result.data);
      })
      .catch((error) => {
        if(error.response.data) {
          setErrorMsg(error.response.data.detail)
        } else {
          setErrorMsg(JSON.stringify(error));
        }
      });

    MapaService.getMapas(page + 1, limit, clinicaId)
      .then((result) => {
        setLoading(false);
        setLpageable(result.data);
      })
      .catch((error) => {
        setLoading(false)

        if(error.response.data) {
          setErrorMsg(error.response.data.detail)
        } else {
          if(JSON.stringify(error).includes("401")) {
            setTokenExpired(true)
          } else {
            setErrorMsg(JSON.stringify(error));
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
        <Box minWidth={1050}>
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
                <StyledTableCell padding="checkbox">
                  <Checkbox
                    checked={selectedMapaIds.length === lpageable.content.length}
                    color="primary"
                    indeterminate={
                      selectedMapaIds.length > 0
                      && selectedMapaIds.length < lpageable.content.length
                    }
                    onChange={handleSelectAll}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  Leito
                </StyledTableCell>
                <StyledTableCell>
                  Paciente
                </StyledTableCell>
                <StyledTableCell>
                  Data de Nascimento
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
              {lpageable.content.slice(0, limit).map((mapa) => (
                <TableRow
                  hover
                  key={mapa.id}
                  selected={selectedMapaIds.indexOf(mapa.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedMapaIds.indexOf(mapa.id) !== -1}
                      onChange={(event) => handleSelectOne(event, mapa.id)}
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
                        {mapa.leito}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {mapa.paciente}
                  </TableCell>
                  <TableCell>
                    {format(
                      zonedTimeToUtc(
                        mapa.dataNascimento, 
                        'America/Sao_Paulo'), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    {mapa.dieta}
                  </TableCell>
                  <TableCell>
                    {mapa.observacoes}
                  </TableCell>
                  <TableCell>
                    <Typography>
                      <IconButton
                        title="Editar unidade"
                        onClick={(event) => handleAlterMapa(mapa.id)}>
                        <Edit color="primary" />
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

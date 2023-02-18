import React, { useState, useEffect} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableRow,
  makeStyles,
  LinearProgress,
  CardHeader,
  Divider,
  CardContent
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import 'react-confirm-alert/src/react-confirm-alert.css';
import SobreService from '../../../services/SobreService'
import { Alert } from '@material-ui/lab';
import { zonedTimeToUtc, format } from 'date-fns-tz';


const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, ...rest }) => {
  
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate;
  const [errorMsg, setErrorMsg] = useState('');
  const [isTokenExpired, setTokenExpired] = useState(false);
  const [reload, setReload] = useState(0);
  const [values, setValues] = useState({
    versao : null,
    licenca : null
  });

  useEffect(() => {

    SobreService.getSobre()
      .then((result) => {
        setLoading(false);
        setValues(result.data);
      })
      .catch((error) => {
        setLoading(false);
        if(error.data) {
          setErrorMsg(error.data);
        } else {
          setTokenExpired(true)
        }
      });

  }, [reload]);

  useEffect(() =>{
    if(isTokenExpired) {
      navigate('/', {replace : true});
    }
  },[isTokenExpired]);

  

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      {loading && 
        <LinearProgress></LinearProgress>}
      {errorMsg &&
        <Alert severity="error">{errorMsg}</Alert>}
      <CardHeader
        title={"Sobre o sistema"}
      >
      </CardHeader>
      <Divider />
      <CardContent>

        <Table>
          <TableBody>
            {
              values.versao &&
                <TableRow>
                  <TableCell>{"Versão"}</TableCell>
                  <TableCell>{values.versao}</TableCell>
                </TableRow>
            }
            {
              values.licenca &&
                <TableRow>
                  <TableCell>{"Produto"}</TableCell>
                  <TableCell>{values.licenca.produto.nome}</TableCell>
                </TableRow>
                
            }
            {
              values.licenca &&
              <TableRow>
                <TableCell>{"Licenciado para"}</TableCell>
                <TableCell>{values.licenca.cliente.nomeRazao + " (" + values.licenca.cliente.documento + ")"}</TableCell>
              </TableRow>
            }
            {
              values.licenca &&
              <TableRow>
                <TableCell>{"Expira em"}</TableCell>
                <TableCell>
                    {format(zonedTimeToUtc(values.licenca.dataExpiracao, 'America/Sao_Paulo'), "dd/MM/yyyy HH:mm:ss")}
                </TableCell>
              </TableRow>
            }
            {
            values.licenca && 
            values.licenca.infos.map((info) => (
                <TableRow key={info.id}>
                  <TableCell>{info.descricaoChaveInfo}</TableCell>
                  <TableCell>{info.valor}</TableCell>
                </TableRow>
              )
            )
          }
          </TableBody>
        </Table>
      </CardContent>
      
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  pageable: PropTypes.object
};

export default Results;

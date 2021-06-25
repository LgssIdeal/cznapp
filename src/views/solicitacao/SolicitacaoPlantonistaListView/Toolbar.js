import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  makeStyles,
  Grid
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import {  useNavigate, useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  }
}));

const Toolbar = ({ className, contratoId, unidadeId, dataReferencia, ...rest }) => {
  const classes = useStyles();
  
  const navigate = useNavigate();

  const handleClick = (() => {
    var url = '/app/solicitacoesplantonista/' + contratoId + '/' + unidadeId + '/' + dataReferencia + '/' + 0;
    navigate(url, {});
  });

  const handleGoBack = (() => {
    var url = '/app/solicitacoes';
    navigate(url, {});
  });

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box
        display="flex"
        justifyContent="flex-end"
      >
        <Grid container spacing={3}>
          <Grid item md={3} xs={6}>
            <Button
              color="primary"
              variant="contained"
              onClick={handleClick}
              spacing={3}
              fullWidth>
              Novo
            </Button>
          </Grid>
          <Grid item md={3} xs={6}>
            <Button
              color="secondary"
              variant="contained"
              onClick={handleGoBack}
              spacing={3}
              fullWidth>
              Voltar
            </Button>
          </Grid>
        </Grid>
        
      </Box>

    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;

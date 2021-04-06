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

const Toolbar = ({ className, clienteId, ...rest }) => {
  const classes = useStyles();
  
  const navigate = useNavigate();

  const handleClick = (() => {
    var url = '/app/solicitacoesplantonista/' + 0;
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
        <Grid
            container
            spacing={3}>
          <Grid
            item
            md={6}
            xs={12}>
            <Button
              color="primary"
              variant="contained"
              onClick={handleClick}
              spacing={3}>
              Novo
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

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
    var url = '/app/unidades/cliente/' + clienteId + '/' + 0;
    navigate(url, {});
  });

  const handleClickGoBack = (() => {
    navigate('/app/clientes', {});
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
            {'   '}
            <Button
              color="primary"
              variant="contained"
              onClick={handleClickGoBack}
              spacing={3}>
              Voltar
            </Button>
          </Grid>
        </Grid>
        
      </Box>

      
      
      {
        /*
      <Box mt={3}>
        <Card>
          <CardContent>
            <Box maxWidth={500}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon
                        fontSize="small"
                        color="action"
                      >
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  )
                }}
                placeholder="Localizar usuário"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
              */}
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;

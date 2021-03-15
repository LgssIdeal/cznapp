import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  makeStyles
} from '@material-ui/core';

const user = {
  avatar: '/static/images/avatars/avatar_6.png',
  city: 'Los Angeles',
  country: 'USA',
  jobTitle: 'Senior Developer',
  name: 'Katarina Smith',
  timezone: 'GTM-7'
};

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    height: 100,
    width: 100
  }
}));

const Profile = ({ className, userSel, ...rest }) => {
  const classes = useStyles();

  //console.log("User selecionado: ", userSel);

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
        >
          <Avatar
            className={classes.avatar}
            src={'https://www.gravatar.com/avatar/default?s=200&r=pg&d=mm'}
          />
          <Typography
            color="textPrimary"
            gutterBottom
            variant="h3"
          >
            {userSel.nome}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body1"
          >
            
          </Typography>
          
        </Box>
      </CardContent>
      <Divider />
      
      <CardActions>
        <Button
          color="primary"
          fullWidth
          variant="contained"
          disabled={userSel.id === ''}
        >
          Alterar foto
        </Button>
      </CardActions>
    </Card>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;

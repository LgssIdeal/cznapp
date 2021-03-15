import React, { useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles,
  ListItem
} from '@material-ui/core';
import {
  AlertCircle as AlertCircleIcon,
  BarChart as BarChartIcon,
  Lock as LockIcon,
  Settings as SettingsIcon,
  ShoppingBag as ShoppingBagIcon,
  User as UserIcon,
  UserPlus as UserPlusIcon,
  Users as UsersIcon,
  MapPin as EmpresasIcon,
  LogOut as LogoutIcon,
  Trello as TrelloIcon,
  Info as InfoIcon,
  FileText as FileTextIcon,
  BookOpen as BookOpenIcon,
  Coffee as CoffeeIcon,
} from 'react-feather';
import NavItem from './NavItem';


const items = [
  {
    href: '/app/dashboard',
    icon: BarChartIcon,
    title: 'Dashboard'
  },
  {
    href: '/app/usuarios',
    icon: UsersIcon,
    title: 'Usuários'
  },
  {
    href: '/app/empresas',
    icon: EmpresasIcon,
    title: 'Empresas'
  },
  {
    href: '/app/clientes',
    icon: ShoppingBagIcon,
    title: 'Clientes'
  },
  {
    href: '/app/tiposdieta',
    icon: TrelloIcon,
    title: 'Tipos de dieta'
  },
  {
    href: '/app/contratos',
    icon: FileTextIcon,
    title: 'Contratos'
  },
  {
    href: '/app/mapas',
    icon: BookOpenIcon,
    title: 'Mapas'
  },
  {
    href: '/app/solicitacoes',
    icon: CoffeeIcon,
    title: 'Solicitações'
  },
  {
    href: '/app/sobre',
    icon: InfoIcon,
    title: 'Sobre'
  }
  
  /*,
  {
    href: '/app/logout',
    icon: LogoutIcon,
    title: 'Sair'
  }*/
];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();

  const map = new Map();
  map.set("ADMINISTRADOR", "Administrador");
  map.set("CORPO_TECNICO", "Corpo técnico");
  map.set("SND", "SND");


  const user = {
    avatar: '/static/images/avatars/avatar_6.png',
    jobTitle: map.get(JSON.parse(localStorage.getItem("@app-user")).perfil),
    name: JSON.parse(localStorage.getItem("@app-user")).nome
  };

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  
  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        p={2}
      >
        <Avatar
          className={classes.avatar}
          component={RouterLink}
          src={'https://www.gravatar.com/avatar/default?s=200&r=pg&d=mm'}
          to="/app/account"
        />
        <Typography
          className={classes.name}
          color="textPrimary"
          variant="h5"
        >
          {user.name}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
        >
          {user.jobTitle}
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {items.map((item) => (
            <NavItem
              href={(item.href)}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
      <Box flexGrow={1} />
      
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default NavBar;

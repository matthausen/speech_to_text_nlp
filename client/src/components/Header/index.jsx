import React from 'react';
import { useAuth0 } from '../../contexts/auth0-context';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Avatar from '@material-ui/core/Avatar';


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  userAvatar: {
    marginLeft: 20,
    marginRight: 20
  }
}));

export default function Header() {
  const classes = useStyles();
  const { isLoading, user, loginWithRedirect, logout } = useAuth0();

  return (
    <>
      {!isLoading && !user && (
        <>
          <Button onClick={loginWithRedirect} color="inherit">Login</Button>
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-controls='primary-search-account-menu'
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </>
      )}

      {/* if there is a user. show user name and logout button */}

      {!isLoading && user && (
        <>
          <Typography>{user.name}</Typography>
          <Avatar className={classes.userAvatar} alt={user.name} src={user.picture} />
          <Button
            onClick={() => logout({ returnTo: window.location.origin })}
            color="inherit">Logout</Button>
        </>
      )}
    </>
  );
}


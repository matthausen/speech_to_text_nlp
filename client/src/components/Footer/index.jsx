import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link, Typography } from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';

const useStyles = makeStyles(theme => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
    marginTop: '4rem'
  },
  icon: {
    color: '#3956ff'
  },
}));

const Footer = () => {
  const classes = useStyles();

  function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://material-ui.com/">
          Lingua
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

  return (
    <footer className={classes.footer}>
      <Typography variant="h6" align="center" gutterBottom>
        Get in touch!
      </Typography>
      <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
        Find out more
      </Typography>
      <EmailIcon className={classes.icon} />
      <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
        hello@linguainternational.org
      </Typography>
      <PhoneIcon className={classes.icon} />
      <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
        +44 7490573128
      </Typography>
      <Copyright />
    </footer>
  );
}

export default Footer;
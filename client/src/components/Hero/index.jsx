import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Grid,
  Link,
  Typography
} from '@material-ui/core';

const heroImage = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fak0.picdn.net%2Fshutterstock%2Fvideos%2F30473530%2Fthumb%2F12.jpg&f=1&nofb=1'

const useStyles = makeStyles(theme => ({
  hero: {
    position: 'relative',
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    marginBottom: theme.spacing(8),
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    height: '40vh',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  heroContent: {
    position: 'relative',
    padding: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(6),
      paddingRight: 0,
    },
  },
  link: {
    color: '#3956ff',
    margin: '0 2rem'
  }
}));

const Hero = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.hero} style={{ backgroundImage: `url(${heroImage})` }}>
      {<img style={{ display: 'none' }}
        src={heroImage}
        alt="natural language processing" />}
      <div className={classes.overlay} />
      <Grid container>
        <Grid item md={6}>
          <div className={classes.heroContent}>
            <Typography component="h1" variant="h3" color="inherit" gutterBottom>
              Lingua
              </Typography>
            <Typography variant="h5" color="inherit" paragraph>
              Lingua is an app that generates intelligent, meaningful insight and summary overview from your recorded audio files and converted youtube videos.
              </Typography>
            <Link className={classes.link} variant="subtitle1" href="#">
              GitHub
              </Link>
            <Link className={classes.link} variant="subtitle1" href="#">
              Project
              </Link>
            <Link className={classes.link} variant="subtitle1" href="#">
              Contacts
              </Link>
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
}
export default Hero;
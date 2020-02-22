import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Paper, Typography, CircularProgress } from '@material-ui/core';
import EntitiesList from '../Entities';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    margin: '3rem'
  },
  title: {
    color: 'white'
  },
  progress: {
    margin: theme.spacing(3, 2),
  },
  progressCircle: {
    color: '#3956ff',
    margin: '4rem'
  },
  summaryBox: {
    padding: 20,
    textAlign: 'left',
    backgroundColor: '#F4F5F7',
    margin: 30,
  },
  summary: {
    lineHeight: 1.6,
    fontWeight: 800
  }
}));


const Transcript = (props) => {
  const classes = useStyles();
  const { content, progress } = props;

  return (
    <div>
      {progress ? (
        <div className={classes.progress}>
          <Typography component="p">
            Generating transcript...Please wait...
          </Typography>
          <CircularProgress className={classes.progressCircle} />
        </div>
      ) : null}
      {content ? (
        <Paper className={classes.root}>
          <Box>
            {Object.values(content)[0] ? (
              <EntitiesList entities={Object.values(content)[0]} />
            ) : (
                <Typography component="p">
                  No entities were found in this transcript
                  </Typography>
              )}
            <Typography variant="h5" component="h3">
              Summary
              </Typography>
            <Box className={classes.summaryBox}>
              <Typography component="p" className={classes.summary}>
                {(Object.values(content)[2]) ? (Object.values(content)[2]) : (
                  <Typography component="p">
                    Could not generate a summary for this audio
                  </Typography>
                )}
              </Typography>
            </Box>
            <Typography variant="h5" component="h3">
              Full transcript
              </Typography>
            {(Object.values(content)[1]) ? (
              <div dangerouslySetInnerHTML={{ __html: (Object.values(content)[1]) }} />
            ) : (
                <div dangerouslySetInnerHTML={{ __html: (Object.values(content)[3]) }} />
              )}
          </Box>
        </Paper>
      ) : null}
    </div>
  );
}

export default Transcript;
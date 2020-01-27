import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import {
  Container,
  TextField,
  Typography,
  Button,
  Box,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import DropZone from '../FileUpload';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MicIcon from '@material-ui/icons/Mic';
import VideocamIcon from '@material-ui/icons/Videocam';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Hero from '../Hero';
import AudioRecorder from 'react-audio-recorder';
import Transcript from '../Transcript'
import Footer from '../Footer';
import axios from 'axios';
import URLs from '../../api';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    margin: '3rem'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  expansion: {
    backgroundColor: '#282828',
    padding: '4rem'
  },
  icons: {
    color: '#3956ff'
  },
  form: {
    '& > *': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  input: {
    '& > label': {
      color: 'grey'
    },
  }
}));

const GreenButton = withStyles(theme => ({
  root: {
    color: theme.palette.getContrastText('#00e8c8'),
    backgroundColor: '#00e8c8',
    '&:hover': {
      backgroundColor: '#00e8c8',
    },
  },
}))(Button);

const GreenCheckbox = withStyles({
  root: {
    color: '#00e8c8',
    '&$checked': {
      color: '#00e8c8',
    },
  },
  checked: {},
})(props => <Checkbox color="default" {...props} />);

const Main = () => {
  const classes = useStyles();
  const [transcript, setTranscript] = useState();
  const [model, setModel] = useState('default')
  const [progress, setProgress] = useState(false);
  const [videoUrl, setVideoUrl] = useState();
  const [state, setState] = useState({
    checkedDefault: true,
    checkedBioMed: false,
    checkedLaw: false,
    checkedTech: false,
  });
  const [expanded, setExpanded] = useState(false);

  const handleExpansion = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleChange = name => event => {
    setState({ ...state, [name]: event.target.checked });
    (state.checkedDefault) ? setModel('default') : setModel('biomed');
    console.log('Model: ', model);
  };

  const config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
    }
  }

  function handleUrl(e) {
    e.preventDefault();
    setVideoUrl(e.target.value);
  }

  function is_url(str) {
    const regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(str)) {
      return true;
    }
    else {
      return false;
    }
  }

  function generateTranscript() {
    const data = {
      "model": model
    }
    setProgress(true);
    axios.post(URLs.AUDIOURL, data, config)
      .then(res => {
        setTranscript(res.data);
        setProgress(false);
      })
  }

  function submitUrl() {
    const data = {
      "url": videoUrl,
      "model": model
    }
    if (is_url(videoUrl)) {
      setProgress(true);
      axios.post(URLs.VIDEOURL, data, config)
        .then(res => {
          setTranscript(res.data)
          setProgress(false);
        })
    } else {
      window.alert('Not a valid url');
    }
  }

  return (
    <div>
      <Hero />
      <Container>
        <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleExpansion('panel1')}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <MicIcon className={classes.icons} />
            <Typography className={classes.heading}>Record an audio</Typography>
            <Typography className={classes.secondaryHeading}>Generate transcripts from recorder audio files</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.expansion}>
            <Container>
              <AudioRecorder
                apiEndPoint={URLs.AUDIOURL}
                config={config}
              />
              <Box>
                <FormControlLabel
                  control={
                    <GreenCheckbox
                      checked={state.checkedDefault}
                      onChange={handleChange('checkedDefault')}
                      value="checkedDefault"
                    />
                  }
                  label="Default"
                />
                <FormControlLabel
                  control={
                    <GreenCheckbox
                      checked={state.checkedBioMed}
                      onChange={handleChange('checkedBioMed')}
                      value="checkedBioMed"
                    />
                  }
                  label="Biology & Medicine"
                />
                <FormControlLabel
                  control={
                    <GreenCheckbox
                      checked={state.checkedLaw}
                      onChange={handleChange('checkedLaw')}
                      value="checkedLaw"
                    />
                  }
                  label="Law & legal"
                />
                <FormControlLabel
                  control={
                    <GreenCheckbox
                      checked={state.checkedTech}
                      onChange={handleChange('checkedTech')}
                      value="checkedTech"
                    />
                  }
                  label="Technology"
                />
              </Box>
              <GreenButton
                classeName={classes.button}
                variant="contained"
                onClick={generateTranscript}
              >
                Generate Transcript
              </GreenButton>
            </Container>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel expanded={expanded === 'panel2'} onChange={handleExpansion('panel2')}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            id="panel2bh-header"
          >
            <VideocamIcon className={classes.icons} />
            <Typography className={classes.heading}>Convert a YouTube video</Typography>
            <Typography className={classes.secondaryHeading}>
              Generate transcripts from YouTube videos
          </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.expansion}>
            <Container>
              <form
                className={classes.form}
                noValidate
                autoComplete="off"
              >
                <TextField
                  className={classes.input}
                  id="standard-basic"
                  label="YouTube video url"
                  onChange={handleUrl}
                />
              </form>
              <Box>
                <FormControlLabel
                  control={
                    <GreenCheckbox
                      checked={state.checkedDefault}
                      onChange={handleChange('checkedDefault')}
                      value="checkedDefault"
                    />
                  }
                  label="Default"
                />
                <FormControlLabel
                  control={
                    <GreenCheckbox
                      checked={state.checkedBioMed}
                      onChange={handleChange('checkedBioMed')}
                      value="checkedBioMed"
                    />
                  }
                  label="Biology & Medicine"
                />
                <FormControlLabel
                  control={
                    <GreenCheckbox
                      checked={state.checkedLaw}
                      onChange={handleChange('checkedLaw')}
                      value="checkedLaw"
                    />
                  }
                  label="Law & legal"
                />
                <FormControlLabel
                  control={
                    <GreenCheckbox
                      checked={state.checkedTech}
                      onChange={handleChange('checkedTech')}
                      value="checkedTech"
                    />
                  }
                  label="Technology"
                />
              </Box>
              <GreenButton
                classeName={classes.button}
                variant="contained"
                onClick={submitUrl}
              >
                Submit
              </GreenButton>
            </Container>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel expanded={expanded === 'panel3'} onChange={handleExpansion('panel3')}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3bh-content"
            id="panel3bh-header"
          >
            <CloudUploadIcon className={classes.icons} />
            <Typography className={classes.heading}>Upload an audio file</Typography>
            <Typography className={classes.secondaryHeading}>
              Generate transcripts from uploaded audio files
          </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.expansion}>
            <DropZone />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Container>
      <Container>
        <Transcript content={transcript} progress={progress} />
      </Container>
      <Footer />
    </div>
  );
}

export default Main;
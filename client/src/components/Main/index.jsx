import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import {
  Container,
  TextField,
  Typography,
  Button,
  Box,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Select,
  FormControl,
  MenuItem,
  InputLabel
} from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MicIcon from '@material-ui/icons/Mic';
import VideocamIcon from '@material-ui/icons/Videocam';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Hero from '../Hero';
import AudioRecorder from 'react-audio-recorder';
import Transcript from '../Transcript'
import Footer from '../Footer';
import { useSnackbar } from 'notistack';
import URLs from '../../api';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    margin: '3rem'
  },
  formControl: {
    margin: theme.spacing(2),
    minWidth: 240,
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
    backgroundColor: '#3a3a3a',
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
  },
  dropzone: {
    border: '2px dashed #00e8c8',
    padding: 40
  },
  text: {
    color: 'white'
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

const Main = () => {
  const classes = useStyles();

  const [transcript, setTranscript] = useState();
  const [model, setModel] = useState('default')
  const [progress, setProgress] = useState(false);
  const [videoUrl, setVideoUrl] = useState();
  const [expanded, setExpanded] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const acceptedFormats = ["audio/mp3", "audio/wav", "audio/flac", "audio/wma"];
  const maxSize = 20000000;

  const config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
    }
  }

  const handleExpansion = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleChange = event => {
    setModel(event.target.value);
  };

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

  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.map(file => {
      if (acceptedFormats.indexOf(file.type) > -1) {
        if (file.size <= maxSize) {
          axios.post(URLs.FILEUPLOAD, file, config)
            .then(res => {
              setTranscript(res.data);
              setProgress(false);
            });
          enqueueSnackbar(`${file.name} uploaded. Processing...`, { variant: 'success' });
          setProgress(true)
        } else {
          enqueueSnackbar('This file is too big. Max size: 20Mb', { variant: 'error' });
        }
      } else {
        enqueueSnackbar('This format is not supported', { variant: 'error' });
      }
    })
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <>
      <Hero />
      <Container>

        {/* Audio Recorder */}
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
                <FormControl className={classes.formControl}>
                  <InputLabel id="model">Model</InputLabel>
                  <Select
                    labelId="model"
                    id="model"
                    value={model}
                    onChange={handleChange}
                  >
                    <MenuItem value={'default'}>Default</MenuItem>
                    <MenuItem value={'enhanced'}>Enhanced</MenuItem>
                  </Select>
                </FormControl>
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

        {/* Video converter */}
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
                <FormControl className={classes.formControl}>
                  <InputLabel id="model">Model</InputLabel>
                  <Select
                    labelId="model"
                    id="model"
                    value={model}
                    onChange={handleChange}
                  >
                    <MenuItem value={'default'}>Default</MenuItem>
                    <MenuItem value={'enhanced'}>Enhanced</MenuItem>
                  </Select>
                </FormControl>
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

        {/* File Upload */}
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
            <Container className={classes.dropzone} {...getRootProps()}>
              <input {...getInputProps()} />
              {
                isDragActive ?
                  <Typography className={classes.text} variant="body1" component="p">Drop audio files ...</Typography> :
                  <Typography className={classes.text} variant="body1" component="p">Drag and drop your audio files here, supported formats: MP3, WMV, FLAC, WAV.</Typography>
              }
            </Container>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Container>
      <Container>
        <Transcript content={transcript} progress={progress} />
      </Container>
      <Footer />
    </>
  );
}

export default Main;
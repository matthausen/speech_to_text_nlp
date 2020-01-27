import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import URLs from '../../api';

const useStyles = makeStyles(theme => ({
  dropzone: {
    border: '2px dashed #00e8c8',
    padding: 40
  },
  text: {
    color: 'white'
  }
}));

export default function DropZone() {
  const classes = useStyles();
  const acceptedFormats = ["audio/mp3", "audio/wav", "audio/flac", "audio/wma"];
  const maxSize = 20000000;
  const config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
    }
  }
  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.map(file => {
      if (acceptedFormats.indexOf(file.type) > -1) {
        if (file.size <= maxSize) {
          axios.post(URLs.FILEUPLOAD, file, config)
            .then(res => console.log(res.data))
        } else {
          console.log('second error here');
        }
      } else {
        console.log('first error here')
      }
    })
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <Container className={classes.dropzone} {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <Typography className={classes.text} variant="body1" component="p">Drop audio files ...</Typography> :
          <Typography className={classes.text} variant="body1" component="p">Drag and drop your audio files here, supported formats: MP3, WMV, FLAC, WAV.</Typography>
      }
    </Container>
  )
}
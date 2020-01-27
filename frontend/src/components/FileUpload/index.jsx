import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
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
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState();
  const [wrongFormat, setWrongFormat] = useState();
  const [fileTooBig, setFileTooBig] = useState();
  const acceptedFormats = ["audio/mp3", "audio/wav", "audio/flac", "audio/wma"];
  const maxSize = 20000000;
  const config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
    }
  }
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpload = (file) => {
    axios.post(URLs.FILEUPLOAD, file, config)
      .then(res => res.data);
  };

  const onDrop = useCallback(acceptedFiles => {
    handleClickOpen();
    acceptedFiles.map(file => {
      setFileName(file.name)
      if (acceptedFormats.indexOf(file.type) > -1) {
        if (file.size <= maxSize) {
          handleUpload(file)
        } else {
          setFileTooBig('This file is too big. Max size: 20Mb')
        }
      } else {
        setWrongFormat('This format is not supported.')
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
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Do you want to upload ${fileName}?`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {(fileTooBig) ? fileTooBig : null}
            {(wrongFormat) ? wrongFormat : null}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpload} color="primary" autoFocus>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
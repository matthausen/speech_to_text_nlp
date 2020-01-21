import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <Container className={classes.dropzone} {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <Typography className={classes.text} variant="body1" component="p">Drop the files here ...</Typography> :
          <Typography className={classes.text} variant="body1" component="p">Drag 'n' drop some files here, or click to select files</Typography>
      }
    </Container>
  )
}
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import URLs from '../../api';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    }
  },
  title: {
    '& > h2': {
      display: 'flex',
      alignItems: 'center'
    }
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginRight: 10
  },
}));

export default function EntitiesList({ entities }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [entity, setEntity] = useState('');
  const [search, setSearch] = useState({
    summary: 'No summary available for this word',
    image: '',
    article: 'No article available for this word',
  });

  // const entitiesList = JSON.parse(entities)
  console.log(entities);

  const config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
    }
  }

  const fetchWiki = (e) => {
    setOpen(true);
    setEntity(e);
    axios.post(URLs.WIKIDATAURL, e, config)
      .then(res => setSearch({
        summary: Object.values(res.data)[0],
        image: Object.values(res.data)[1],
        article: Object.values(res.data)[2],
      }));
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <p>Example</p>
    /* <div className={classes.root}>
      {(entities) ? entities.map((e, index) => {
        if (e !== "") {
          return (
            <Chip key={index} avatar={<Avatar>M</Avatar>} label={e} onClick={() => fetchWiki(e)} />
          )
        }
      }
      ) : null}
      <Dialog
        open={open}
        onClose={handleClose}
        overlayStyle={{ backgroundColor: 'transparent' }}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title" className={classes.title}>
          <Avatar alt="Entity" src={search.image} className={classes.large} />
          {entity}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {search && search.summary ? search.summary : null}
          </DialogContentText>
          <DialogContentText>
            {search && search.article ? search.article : null}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div> */
  );
}
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Typography } from '@material-ui/core';
import LabelIcon from '@material-ui/icons/Label';
import Main from '../Main';
import Header from '../Header';
import { useEntityValue } from '../../contexts/entityContext';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    flexDirection: 'row-reverse'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
}));

export default function AppDrawer(props) {
  const classes = useStyles();

  const [{ entityList }] = useEntityValue();
  const list = entityList.list[0].entitiesJson;

  console.log(list);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Header />
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar} />
        <List>
          {(entityList && list) ? Object.entries(list).map(([key, value]) => (
            <ListItem key={key}>
              <ListItemIcon><LabelIcon /></ListItemIcon>
              <ListItemText>{key} - {value}</ListItemText>
            </ListItem>
          )) : (
              <Typography variant="body2" component="">No results</Typography>
            )}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Main />
      </main>
    </div >
  );
}
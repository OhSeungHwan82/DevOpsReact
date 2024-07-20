import React from 'react';
import { Grid, List, ListItem, ListItemText, ListSubheader, Typography } from '@mui/material';
function CodeClassList({ codeClasses, onSelect }) {
  return (
    <List
        subheader={
            <ListSubheader 
                component="div" 
                style={{height:'50px',
                    backgroundColor: '#f5f5f5',
                    boxShadow: '0 4px 2px -2px gray',}}>
                <Grid container style={{height:'100%'}}>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="body1" fontWeight="bold">
                            코드번호
                        </Typography>
                    </Grid>
                    <Grid item xs={9} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="body1" fontWeight="bold">
                            코드이름
                        </Typography>
                    </Grid>
                </Grid>
            </ListSubheader>
        }
        style={{ maxHeight: '700px', overflow: 'auto' }}
    >
      {codeClasses.map((codeClass) => (
        <ListItem button key={codeClass.cl_code} onClick={() => onSelect(codeClass)}>
            <Grid container>
                <Grid item xs={3} textAlign="center">
                    <ListItemText primary={codeClass.cl_code} />
                </Grid>
                <Grid item xs={9} textAlign="center">
                    <ListItemText primary={codeClass.cl_name} />
                </Grid>
            </Grid>
        </ListItem>
      ))}
    </List>
  );
}

export default CodeClassList;

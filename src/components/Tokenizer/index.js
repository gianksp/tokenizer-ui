import { createContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FormControl, Grid, Paper, Input, InputLabel, FormHelperText, Button, Alert, Tabs, Tab, Typography, Box } from '@mui/material';
import Dropzone from 'components/Dropzone';
import Properties from 'components/Properties';
import Chains from 'components/Chains';
import Editor from 'components/Editor';
import { MinterContext } from 'components';


function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }


const minterProps = {
    chainId: '',
    type: 'ERC721',
    metadata: {
        name: '',
        description: '',
        image: '',
        attributes: [],
        background_color: 'ffffff',
        animation_url: '',
        youtube_url: ''
    }
};

const Tokenizer = ({t}) => {
    const [minter, setMinter] = useState(minterProps);
    const [value, setValue] = useState(0);
    const context = useMemo(
        () => ({ minter, setMinter }), 
        [minter]
      );

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <MinterContext.Provider value={context}>
            <Paper sx={{
                margin: '10%',
                width: '80%',
                height: '800px'
            }}
            elevation={10}>
                <Grid container sx={{ width: '100%', p: 4 }} spacing={2}>
                    <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Mint your NFT" {...a11yProps(0)} />
                        <Tab label="Additional Properties" {...a11yProps(1)} />
                        <Tab label="Preview Metadata" {...a11yProps(2)} />
                      </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Dropzone />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Properties />
                            </Grid>
                            <Grid item xs={12}>
                                <Alert severity="info">Hi</Alert>
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="outlined" fullWidth>Mint</Button>
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                      Item Two
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                      <Editor />
                    </TabPanel>
                  </Box>
                </Grid>
            </Paper>
        </MinterContext.Provider>
    );
}

export default Tokenizer;
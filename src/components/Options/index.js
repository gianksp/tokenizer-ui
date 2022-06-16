import { useContext } from 'react';
import { Grid, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import { DappifyContext } from 'react-dappify';
import singleNft from 'assets/images/single.png';

const Options = () => {
    const { configuration } = useContext(DappifyContext);
    return (
        <Grid container>
        <Grid item xs={6}>
            <Paper>
                <img src={singleNft} alt='' />
            </Paper>
        </Grid>
    </Grid>
    );
};

export default Options;

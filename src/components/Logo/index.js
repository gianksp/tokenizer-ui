import { useContext } from 'react';
import { Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { DappifyContext } from 'react-dappify';

const Logo = () => {
    const { configuration } = useContext(DappifyContext);
    return (
        <Grid container>
            <img src={configuration.logo} alt={configuration.name} style={{ maxHeight: 40 }} />
        </Grid>
    );
};

export default Logo;

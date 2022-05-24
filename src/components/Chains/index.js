import { useState, useContext } from 'react';
import { FormControl, Select, MenuItem, Button, Grid, Paper, Input, InputLabel, FormHelperText, Typography } from '@mui/material';
import { MinterContext } from 'components';
import constants from 'react-dappify/constants';

const Chains = ({t}) => {

    const {minter, setMinter} = useContext(MinterContext);

    const renderChains = () => {
        const list = [];
        const supported = Object.keys(constants.NETWORKS);
        supported.forEach((chainId) => {
            const network = constants.NETWORKS[chainId];
            const image = constants.LOGO[network.nativeCurrency.symbol];
            list.push(
                <MenuItem value={network.chainId} key={network.chainId}>
                    <Grid container direction="row" spacing={2}>
                        <Grid item>
                            <img style={{ width: 'auto', height: 24 }} src={image} alt={network.chainName} />
                        </Grid>
                        <Grid item>
                            {network.chainName}
                        </Grid>
                    </Grid>
                </MenuItem>
            )
        })
        return list;
    };

    return (
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Select the Network</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={minter.chainId}
                label="Select the Network"
                fullWidth
                onChange={(e) => {
                    const newMinter = {...minter};
                    newMinter.chainId = e.target.value;
                    setMinter(newMinter);
                }}
            >
                {renderChains()}
            </Select>
        </FormControl>

    );
}

export default Chains;
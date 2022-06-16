import { useState, useContext } from 'react';
import { FormControl, Select, MenuItem, Button, Grid, Paper, Input, InputLabel, FormHelperText, Typography } from '@mui/material';
import { MinterContext } from 'components';
import {constants, utils} from 'react-dappify';
const { setPreference } = utils.localStorage;

const Chains = ({t, defaultChainId }) => {
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
                            <img style={{ width: 'auto', height: 16 }} src={image} alt={network.chainName} />
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
            <InputLabel id="demo-simple-select-label">Network</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={minter.chainId}
                label="Network"
                fullWidth
                onChange={(e) => {
                    const newMinter = {...minter};
                    newMinter.chainId = e.target.value;
                    setMinter(newMinter);
                    setPreference(constants.PREFERENCES.CHAIN, { chainId: newMinter.chainId });
                }}
            >
                {renderChains()}
            </Select>
        </FormControl>

    );
}

export default Chains;
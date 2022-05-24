import { useContext } from 'react';
import { MenuItem, Select, FormControl, Grid, Alert, Input, InputLabel, FormHelperText, TextField, Paper, Button } from '@mui/material';
import Chains from 'components/Chains';
import { MinterContext } from 'components';

const Properties = ({t}) => {
    const {minter, setMinter} = useContext(MinterContext);
    return (
        
        <Grid container sx={{ width: '100%' }} spacing={2}>
            <Grid item xs={12}>
                <Chains />
            </Grid>
            <Grid item xs={12}>
                <TextField  label="Title" 
                            value={minter.metadata.name} 
                            fullWidth
                            onChange={(e) => {
                                const newMinter = {...minter};
                                newMinter.metadata.name = e.target.value;
                                setMinter(newMinter);
                            }}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField  multiline 
                            value={minter.metadata.description} 
                            rows={4} 
                            label="Description" 
                            fullWidth
                            onChange={(e) => {
                                const newMinter = {...minter};
                                newMinter.metadata.description = e.target.value;
                                setMinter(newMinter);
                            }}
                />
            </Grid>
            <Grid item xs={6}>
                <Grid container>
                    <Grid item xs={6}><Button disableElevation variant={ minter.type === 'ERC721' ? 'contained' : 'outlined' } fullWidth>ERC721</Button></Grid>
                    <Grid item xs={6}><Button disableElevation disabled variant={ minter.type === 'ERC1155' ? 'contained' : 'outlined' } fullWidth>ERC1155</Button></Grid>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <TextField disabled={minter.type === 'ERC721'} label="Quantity" type="number" fullWidth />
            </Grid>
            <Grid item xs={12}>
                <TextField  label="Social Media URL (optional)" 
                            fullWidth
                            value={minter.metadata.external_url} 
                            onChange={(e) => {
                                const newMinter = {...minter};
                                newMinter.metadata.external_url = e.target.value;
                                setMinter(newMinter);
                            }}
                />
            </Grid>
        </Grid>

    );
}

export default Properties;
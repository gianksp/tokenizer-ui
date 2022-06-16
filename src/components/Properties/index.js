import { useContext } from 'react';
import { Grid, TextField } from '@mui/material';
import Chains from 'components/Chains';
import { MinterContext } from 'components';

const Properties = ({ t, defaultChainId }) => {
    const {minter, setMinter} = useContext(MinterContext);

    return (
        
        <Grid container sx={{ width: '100%' }} spacing={2}>
            <Grid item xs={12}>
                <TextField  label={t('Title')}
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
                            rows={3} 
                            label={t('Description')} 
                            fullWidth
                            onChange={(e) => {
                                const newMinter = {...minter};
                                newMinter.metadata.description = e.target.value;
                                setMinter(newMinter);
                            }}
                />
            </Grid>
            <Grid item xs={4}>
                <TextField  label={t('# of copies')}
                            type="number" 
                            fullWidth 
                            value={minter.amount}
                            onChange={(e) => {
                                const newMinter = {...minter};
                                newMinter.amount = e.target.value;
                                newMinter.type = newMinter.amount > 1 ? 'ERC1155' : 'ERC721';
                                setMinter(newMinter);
                            }}
                />
            </Grid>
            <Grid item xs={8}>
                <Chains defaultChainId={defaultChainId} />
            </Grid>
        </Grid>

    );
}

export default Properties;
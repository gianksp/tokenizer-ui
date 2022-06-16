import { useContext, useState, useEffect } from 'react';
import { OutlinedInput, InputAdornment,  MenuItem, Select, FormControl, Grid, Alert, Input, InputLabel, FormHelperText, TextField, Paper, Button, Typography } from '@mui/material';
import Chains from 'components/Chains';
import { MinterContext } from 'components';

const ExtendedAttributes = ({t}) => {
    const {minter, setMinter} = useContext(MinterContext);
    const [fields, setFields] = useState(minter.additionalFields);

    useEffect(() => {
        const newMinter = {...minter};
        newMinter.additionalFields = fields;
        setMinter(newMinter);
    }, [fields]);

    const addField = () => {
        const currentFields = [...fields];
        currentFields.push({ key: '', value: '' });
        setFields(currentFields);
    }

    const removeField = (index) => {
        let currentFields = [...fields];
        currentFields.splice(index, 1);
        setFields(currentFields);
    }

    const renderFields = () => {
        const list = [];
        fields.forEach((field, index) => {
            list.push(
                <><Grid item xs={5} key={index}>
                    <TextField label="Key"
                        defaultValue={field.key}
                        fullWidth
                        onChange={(e) => {
                            const currentFields = [...fields];
                            currentFields[index].key = e.target.value;
                            setFields(currentFields);
                        } } />
                </Grid><Grid item xs={5}>
                        <TextField 
                            defaultValue={field.value}
                            label="Value"
                            fullWidth
                            onChange={(e) => {
                                const currentFields = [...fields];
                                currentFields[index].value = e.target.value;
                                setFields(currentFields);
                            } } />
                    </Grid><Grid item xs={2}>
                        <Button onClick={() => removeField(index)}>Remove</Button>
                    </Grid></>
            )
        });
        return list;
    }

    return (
        <Grid container sx={{ width: '100%', mt: 0 }} spacing={2}>
            <Grid item xs={12} sx={{ mt: 0 }}>
                <Typography variant="h1" fontSize="1.3em" fontWeight="bold">1. Re-sale Royalties</Typography>
                <Typography variant="body" fontSize="1em" fontWeight="300">
                    You, as a content creator, will receive a royalty based on the percentage 
                    everytime this NFT is being sold in a marketplace supporting <a height={10} size="small" href="https://eips.ethereum.org/EIPS/eip-2981" target="_blank" rel="noreferrer">EIP2981</a>
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <OutlinedInput
                    id="royalties"
                    type='number'
                    fullWidth
                    defaultValue={minter.royalties}
                    onChange={(e) => {
                        const newMinter = {...minter};
                        newMinter.royalties = e.target.value;
                        setMinter(newMinter);
                    } } 
                    endAdornment={
                    <InputAdornment position="end">
                        %
                    </InputAdornment>
                    }
                    label="Royalties"
                    inputProps={{
                        'aria-label': 'Royalties %',
                    }}
                />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h1" fontSize="1.3em" fontWeight="bold">2. Additional Fields</Typography>
                <Typography variant="body" fontSize="1em" fontWeight="300">
                    You can add custom fields to the metadata of this NFT in case you need to store custom properties
                    e.g. promo_code: 1155 in order to support different <a href="https://docs.opensea.io/docs/metadata-standards" target="_blank" rel="noreferrer">metadata standards</a>
                </Typography>
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
            {renderFields()}
            <Grid item xs={12}>
                <Button size="large" variant="contained" onClick={addField}>Add Custom Metadata Fields</Button>
            </Grid>
        </Grid>
    );
}

export default ExtendedAttributes;
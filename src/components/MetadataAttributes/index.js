import { useContext, useState, useEffect } from 'react';
import { MenuItem, Select, FormControl, Grid, Alert, Input, InputLabel, FormHelperText, TextField, Paper, Button, Typography } from '@mui/material';
import Chains from 'components/Chains';
import { MinterContext } from 'components';

const MetadataAttributes = ({t}) => {
    const {minter, setMinter} = useContext(MinterContext);
    const [fields, setFields] = useState(minter.metadataAttributes);
    useEffect(() => {
        const newMinter = {...minter};
        newMinter.metadataAttributes = fields;
        setMinter(newMinter);
    }, [fields]);

    const addField = () => {
        const currentFields = [...fields];
        currentFields.push({ trait_type: '', value: '' });
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
                    <TextField label={t('Key')}
                        defaultValue={field.trait_type}
                        fullWidth
                        onChange={(e) => {
                            const currentFields = [...fields];
                            currentFields[index].trait_type = e.target.value;
                            setFields(currentFields);
                        } } />
                    </Grid><Grid item xs={5}>
                        <TextField 
                            defaultValue={field.value}
                            label={t('Value')}
                            fullWidth
                            onChange={(e) => {
                                const currentFields = [...fields];
                                currentFields[index].value = e.target.value;
                                setFields(currentFields);
                            } } />
                    </Grid><Grid item xs={2}>
                        <Button onClick={() => removeField(index)}>{t('Remove')}</Button>
                    </Grid></>
            )
        });
        return list;
    }

    return (
        <Grid container sx={{ width: '100%', mt: 2  }} spacing={2}>
            <Grid item xs={12}>
                <Grid item xs={12} sx={{ mt: 2 }}>
                    <Typography component={"span"} variant="h1" fontSize="1.3em" fontWeight="bold">{t('3. Custom Attributes')}</Typography>
                    <Typography component={"span"} variant="body" fontSize="1em" fontWeight="300">
                        {t('Add custom unique attributes to your NFT to enhance rarity e.g. monster_type: electric as per')} <a href="https://docs.opensea.io/docs/metadata-standards" target="_blank" rel="noreferrer">metadata standards</a>
                    </Typography>
                </Grid>
            </Grid>
            {renderFields()}
            <Grid item xs={12}>
                <Button size="large" variant="contained" onClick={addField}>{t('Add Custom NFT Attributes')}</Button>
            </Grid>
        </Grid>

    );
}

export default MetadataAttributes;
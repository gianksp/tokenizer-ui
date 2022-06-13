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
                    <TextField label="Key"
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
        <Grid container sx={{ width: '100%', mt: 5  }} spacing={2}>
            <Grid item xs={12}>
                <Typography>Metadata Attributes</Typography>
            </Grid>
            {renderFields()}
            <Grid item xs={12}>
                <Button variant="contained" onClick={addField}>Add</Button>
            </Grid>
        </Grid>

    );
}

export default MetadataAttributes;
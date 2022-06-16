import { useContext, useState } from 'react';
import { MenuItem, Select, FormControl, Grid, Alert, Input, InputLabel, FormHelperText, TextField, Paper, Button } from '@mui/material';
import Chains from 'components/Chains';
import { MinterContext } from 'components';
import {constants} from 'react-dappify';
import CollectionDialog from 'components/CollectionDialog';

const Properties = ({t, defaultChainId, handleAuth }) => {
    const {minter, setMinter} = useContext(MinterContext);
    const [createCollectionDialog, setCreateCollectionDialog] = useState();


    const handleChange = (files) => {
        const targetFile = files[0];
        const newMinter = {...minter};
        newMinter.collectionMetadata.image = targetFile;
        setMinter(newMinter);
    }


    return (
        
        <Grid container sx={{ width: '100%' }} spacing={2}>
            {/*<Grid item xs={12}>
                <Chains defaultChainId={defaultChainId} />
    </Grid> */}
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
                            rows={3} 
                            label="Description" 
                            fullWidth
                            onChange={(e) => {
                                const newMinter = {...minter};
                                newMinter.metadata.description = e.target.value;
                                setMinter(newMinter);
                            }}
                />
            </Grid>
             {/*<Grid item xs={6}>
               <Grid container>
                    <Grid item xs={6}>
                        <Button disableElevation 
                                variant={ minter.type === 'ERC721' ? 'contained' : 'outlined' } 
                                fullWidth
                                onClick={() => {
                                    const newMinter = {...minter};
                                    newMinter.type = 'ERC721';
                                    newMinter.amount = 1;
                                    setMinter(newMinter);
                                }}>
                            ERC721
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button disableElevation 
                                variant={ minter.type === 'ERC1155' ? 'contained' : 'outlined' } 
                                fullWidth
                                onClick={() => {
                                    const newMinter = {...minter};
                                    newMinter.type = 'ERC1155';
                                    setMinter(newMinter);
                                }}>
                            ERC1155
                        </Button>
                    </Grid>
                </Grid>
                            </Grid>*/}
            <Grid item xs={4}>
                <TextField  label="# of copies" 
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
            {/*<Grid item xs={12}>
                <TextField  label="Social Media URL (optional)" 
                            fullWidth
                            value={minter.metadata.external_url} 
                            onChange={(e) => {
                                const newMinter = {...minter};
                                newMinter.metadata.external_url = e.target.value;
                                setMinter(newMinter);
                            }}
                />
                        </Grid> */}
            {/*<Grid item xs={6}>
                <Button disableElevation variant={ minter.collection === constants.CONTRACTS.tokenizer[minter.chainId] ? 'contained' : 'outlined' } fullWidth onClick={() => {
                    const newMinter = {...minter};
                    newMinter.collection = constants.CONTRACTS.tokenizer[minter.chainId];
                    setMinter(newMinter);
                }}>
                    Dappify Collection
                </Button>
            </Grid>
            <Grid item xs={6}>
                <Button disableElevation variant={ minter.collection && minter.collection !== constants.CONTRACTS.tokenizer[minter.chainId] ? 'contained' : 'outlined' } fullWidth onClick={() => {
                    setCreateCollectionDialog(true);
                }}>
                    Create New Collection
                </Button>
            </Grid>
            <CollectionDialog open={createCollectionDialog} onClose={() => {
                console.log('closing');
                setCreateCollectionDialog(false);
            }} handleChange={handleChange} handleAuth={handleAuth} /> */}
        </Grid>

    );
}

export default Properties;
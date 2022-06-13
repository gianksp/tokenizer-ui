import { useContext, useState, useEffect } from 'react';
import { Box, MenuItem, Select, FormControl, Grid, Alert, Input, InputLabel, FormHelperText, TextField, Paper, Button, Typography } from '@mui/material';
import Chains from 'components/Chains';
import { MinterContext } from 'components';
import CollectionDialog from 'components/CollectionDialog';

const Collections = ({t, defaultChainId, handleAuth, collections, onClose }) => {
    const {minter, setMinter} = useContext(MinterContext);
    const [createCollectionDialog, setCreateCollectionDialog] = useState();
    const [config, setConfig] = useState({});

    const loadLocalConfig = async () => {
        const cfg = await fetch(`dappify.json`)
        .then((r) => r.json())
        setConfig(cfg);
    }
    useEffect(() => {
        loadLocalConfig();
    }, []);

    const handleChange = (files) => {
        const targetFile = files[0];
        const newMinter = {...minter};
        newMinter.collectionMetadata.image = targetFile;
        setMinter(newMinter);
    }

    // const defaultDappifyCollection = (
    //     <Grid item xs={6}>
    //         <Button disableElevation variant={ minter.collection === constants.CONTRACTS.tokenizer[minter.chainId] ? 'contained' : 'outlined' } fullWidth onClick={() => {
    //             const newMinter = {...minter};
    //             newMinter.collection = constants.CONTRACTS.tokenizer[minter.chainId];
    //             setMinter(newMinter);
    //         }}>
    //             Dappify Collection
    //         </Button>
    //     </Grid>
    // );

    const collectionItem = (collection, onClick) => (
        <Button disableElevation
                fullWidth
                sx={{
                    height: 175,
                    width: 175,
                    mr: 2
                }}
                variant="outlined"
                onClick={onClick}>
                <Grid container>
                    <Box sx={{
                        position: 'absolute',
                        background: `url(${collection.metadata.image})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        height: 175,
                        width: 175,
                        left: 0,
                        top: 0,
                        opacity: 0.25
                    }} />
                    <Grid item xs={12}>
                        <Typography variant="h4" fontWeight="bold">{collection.metadata.name}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body">{collection.metadata.description}</Typography>
                    </Grid>
                </Grid>
        </Button>
    )

    const newCollection = collectionItem({
        metadata: {
            image: 'https://i.ibb.co/5MSMLFr/output-onlinepngtools-2.png',
            name: 'Add New',
            description: ''
        }
    }, () => setCreateCollectionDialog(true));

    const dappifyCollection =   minter?.chainId && 
                                config?.contract && 
                                config?.contract[minter?.chainId] && 
                                config?.contract[minter?.chainId][minter.type] &&
                                collectionItem({
        metadata: {
            image: 'https://i.ibb.co/5MSMLFr/output-onlinepngtools-2.png',
            name: 'Dappify',
            description: 'Default Collection'
        }
    }, () => {
        const newMinter = {...minter};
        newMinter.collection = config?.contract[minter.chainId];
        setMinter(newMinter);
    });

    const renderCollections = () => {
        const list = [
            newCollection,
            dappifyCollection
        ];
        const elements = collections?.results?.filter((item) => item.chainId === minter.chainId && item.type === minter.type) || [];
        elements.forEach((collection) => {
            console.log(collection);
            console.log(minter);
            list.push(collectionItem(collection, () => {
                const newMinter = {...minter};
                newMinter.collection = {};
                newMinter.collection[newMinter.type] = collection.contract;
                setMinter(newMinter);
            }))
        })
        return list;
    }

    return (
        
        <Grid container sx={{ width: '100%', p: 2 }} spacing={2}>
            {minter.chainId && renderCollections()}
            <CollectionDialog open={createCollectionDialog} onClose={() => {
                onClose();
                setCreateCollectionDialog(false);
            }} handleChange={handleChange} handleAuth={handleAuth} />
        </Grid>

    );
}

export default Collections;
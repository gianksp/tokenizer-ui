import React, { forwardRef, useState, useContext } from "react";
import { Typography, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button, Slide, Alert } from '@mui/material';
import { DappifyContext, Collection, constants, utils, contracts as artifacts, Transaction } from 'react-dappify';
import Dropzone from 'components/Dropzone';
import { MinterContext } from 'components';
import { ethers } from 'ethers';
// import DappifyNFT from 'react-dappify/contracts/ERC721DappifyV1.sol/ERC721DappifyV1.json';
// import Bytecode from 'react-dappify/contracts/artifacts/contracts.json';

const { contracts: Bytecode, ERC721DappifyV1, ERC1155DappifyV1 } = artifacts;

const { getProviderPreference } = utils.localStorage;

const { NETWORKS } = constants;

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CollectionDialog = ({ open=false, onClose, handleAuth }) => {
    const { Provider, isAuthenticated, logout, user, switchToChain } = useContext(DappifyContext);
    const {minter, setMinter} = useContext(MinterContext);
    const [collection] = useState();
    const [creatingCollection, setCreatingCollection] = useState({
        data: null,
        loading: false,
        error: null
    });

    const targetNetwork = NETWORKS[minter.chainId].chainName;


    const handleTokenImageChange = async (files) => {
        const selectedFile = files[0];
        const newMinter = {...minter};
        newMinter.collectionMetadata.image = selectedFile;
        setMinter(newMinter);
    }

    const handleChange = async (e) => {
        const newMinter = {...minter};
        newMinter.collectionMetadata[e.target.name] = e.target.value
        setMinter(newMinter);
    };


    const handleSubmit = async () => {

        let tokenId;
        let contractAddress;

        const pref = getProviderPreference();
        const web3Provider = await Provider.enableWeb3(pref);
        console.log(minter);
        await switchToChain(constants.NETWORKS[minter.chainId], web3Provider.provider);
        setCreatingCollection({ data: null, loading: true, error: null })

        try {

            // Append image file
            if (minter.collectionMetadata.image && minter.collectionMetadata.image instanceof File) {
                console.log('Uploading image file');
                console.log(minter.collectionMetadata.image);
                const imageFile = new Provider.File('image', minter.collectionMetadata.image);
                await imageFile.saveIPFS();
                const imageFileUrl = imageFile.ipfs();
                minter.collectionMetadata.image = imageFileUrl;
            }
                        
            // const currentProvider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = minter.type === 'ERC271' ? 
                Bytecode.output.contracts['contracts/ERC721DappifyV1.sol'].ERC721DappifyV1 :
                Bytecode.output.contracts['contracts/ERC1155DappifyV1.sol'].ERC1155DappifyV1;
                console.log(contract);

            console.log(contract);
            // return;
            const abi = contract.abi;
            const bytecode = contract.evm.bytecode;
            const market = new ethers.ContractFactory(abi, bytecode, web3Provider.getSigner());
            const marketplace = minter.type === 'ERC271' ? 
                await market.deploy(minter.collectionMetadata.name, minter.collectionMetadata.symbol) : 
                await market.deploy(minter.collectionMetadata.name, minter.collectionMetadata.symbol, '');
            const deployment = await marketplace.deployed();

            console.log(deployment);

            console.log(`New contract at ${deployment.address}`);
            const response = `${constants.NETWORKS[minter.chainId].blockExplorerUrls[0]}/address/${deployment.address}`;

            const newMinter = {...minter};
            newMinter.collection = deployment.address.toLocaleLowerCase();
            setMinter(newMinter);

            await new Transaction({
                // Creating new
                transactionHash: deployment.deployTransaction.hash,
                contract: deployment.address,
                uri: minter.collectionMetadata.shortUrl,
                metadata: minter.collectionMetadata,
                status: 'Created',
                symbol: minter.collectionMetadata.symbol,
                name: minter.collectionMetadata.name,
                chainId: minter.chainId,
                category: 'Collection',
                quantity: 1,
                type: minter.type
            }).save();

            // await new Collection({
            //     token_address: newMinter.collection,
            //     symbol: newMinter.collectionMetadata.symbol,
            //     name: newMinter.collectionMetadata.name,
            //     banner: newMinter.collectionMetadata.image,
            //     description: newMinter.collectionMetadata.description,
            //     chainId: newMinter.chainId,
            // }).save();

            // // Generate metadata and save to IPFS
            // const metadataFile = new Provider.File('metadata.json', {
            //   base64: Buffer.from(JSON.stringify(minter.metadata)).toString("base64"),
            // });
            // await metadataFile.saveIPFS();
            // const metadataFileUrl = metadataFile.ipfs();
            
            // let response;
            // const signer = web3Provider.getSigner();
            // const userAddress = user.get('ethAddress');
            // contractAddress = constants.CONTRACTS.tokenizer[minter.chainId];
            // const contract = new ethers.Contract(contractAddress, DappifyNFT.abi, signer);
            // let transaction = await contract.mint(userAddress, userAddress, minter.royalties*100, metadataFileUrl);
            // const tx = await transaction.wait();
            // tokenId = tx.events[0].topics[3];
            // response = `${constants.NETWORKS[minter.chainId].blockExplorerUrls[0]}/tx/${tx.transactionHash}`;

            setCreatingCollection({
                data: response,
                loading: false,
                error: null
            })
        } catch (err) {
            console.error(err);
            setCreatingCollection({
                data: null,
                loading: false,
                error: err.message
            })
        }
    }
    
    return (
        <Dialog
            PaperProps={{className:'collection__body'}}
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={onClose}
            aria-describedby="collection_dialog"
            onBackdropClick={onClose}
        >
        <DialogTitle className="collection__title dialog__title" textAlign="left">Creating a new ({minter.type}) Collection in {targetNetwork}</DialogTitle>
        <DialogContent className="collection__content">
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Dropzone handleChange={handleTokenImageChange} />
                </Grid>
                <Grid item xs={6}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                className="text__field"
                                label="Display name"
                                placeholder="Enter collection name"
                                name="name"
                                fullWidth
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                className="text__field"
                                label="Description"
                                name="description"
                                rows={3} 
                                multiline
                                fullWidth
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                className="text__field"
                                label="Symbol e.g BAYC"
                                placeholder="Enter token symbol"
                                name="symbol"
                                fullWidth
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        className="text__field"
                        label="External URL"
                        name="shortUrl"
                        fullWidth
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Alert severity="warning">Gas fees apply</Alert>
                </Grid>
                {creatingCollection.error && (
                    <Grid item xs={12}>
                        <Alert  severity="error">{creatingCollection.error}</Alert>
                    </Grid>
                )}
                {creatingCollection.data && (
                    <Grid item xs={12}>
                        <Alert severity="success">Your collection is now live <a href={creatingCollection.data} target="_blank" rel="noreferrer">view your collection</a></Alert>
                    </Grid>
                )}
            </Grid>
        </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                {!creatingCollection.data && (<Button size="large" onClick={handleSubmit} disabled={creatingCollection.loading} variant="contained" className="collection__button" fullWidth>Create collection</Button>)}
                {creatingCollection.data && (<Button size="large" onClick={onClose} disabled={creatingCollection.loading} variant="contained" className="collection__button" fullWidth>Close and continue</Button>)}
            </DialogActions>
        </Dialog>
   );
};

export default CollectionDialog;
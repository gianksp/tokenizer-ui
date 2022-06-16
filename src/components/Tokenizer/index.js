import React, { createContext, useMemo, useState, useContext, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import PropTypes from 'prop-types';
import { IconButton, TextField, Checkbox, FormGroup, FormControlLabel, Snackbar, FormControl, Grid, Paper, Input, InputLabel, FormHelperText, Button, Alert, Tabs, Tab, Typography, Box } from '@mui/material';
import Dropzone from 'components/Dropzone';
import Properties from 'components/Properties';
import Chains from 'components/Chains';
import Editor from 'components/Editor';
import Preview from 'components/Preview';
import ExtendedAttributes from 'components/ExtendedAttributes';
import { MinterContext } from 'components';
import { DappifyContext, constants, utils, contracts as artifacts, Transaction, UserProfile, Property } from 'react-dappify';
import MetadataAttributes from 'components/MetadataAttributes';
import { ethers } from 'ethers';
// import ERC721DappifyV1 from 'react-dappify/contracts/ERC721DappifyV1.sol/ERC721DappifyV1.json';
// import ERC1155DappifyV1 from 'react-dappify/contracts/ERC1155DappifyV1.sol/ERC1155DappifyV1.json';
import WalletsDialog from 'components/WalletsDialog';
import Collections from 'components/Collections';
import NFTList from 'components/NFTList';
import Logo from 'components/Logo';
import Steps from 'components/Steps';
import LogoutIcon from '@mui/icons-material/Logout';

const { formatAddress } = utils.format;

const { contracts: Bytecode, ERC721DappifyV1, ERC1155DappifyV1 } = artifacts;
const { setPreference, getProviderPreference } = utils.localStorage;

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }


const minterProps = {
    lazy: false,
    royalties: 0,
    chainId: '',
    amount: 1,
    type: 'ERC721',
    metadata: {
        name: '',
        description: '',
        image: '',
        attributes: [],
        background_color: 'ffffff',
        animation_url: '',
        youtube_url: ''
    },
    additionalFields: [],
    metadataAttributes: [],
    collectionMetadata: {
        name: '',
        description: '',
        symbol: '',
        shortUrl: '',
        image: ''
    }
};

const Tokenizer = ({ t,  onMint }) => {
    const { Provider, isAuthenticated, logout, user, switchToChain, configuration } = useContext(DappifyContext);
    const [minter, setMinter] = useState(minterProps);
    const [value, setValue] = useState(0);
    const [items, setItems] = useState([]);
    const [minting, setMinting] = useState({ data: null, loading: false, error: null });
    const [showWalletDialog, setShowWalletDialog] = useState();
    const [options, setOptions] = useState([]);
    const defaultChainId = options.find((opt) => opt.key === 'chainId' )?.value || '';
    const [background, setBackground] = useState();

    const context = useMemo(
        () => ({ minter, setMinter }), 
        [minter]
      );

    useEffect(() => {
        if (defaultChainId) {
            const newMinter = {...minter};
            newMinter.chainId = defaultChainId;
            setMinter(newMinter);
            setPreference(constants.PREFERENCES.CHAIN, { chainId: newMinter.chainId });
        }
    }, [defaultChainId]);

    const loadProperties = async () => {
        const props = await Property.findAllWithType({ type: 'option' });
        setOptions(props);
        const layoutProps = await Property.findAllWithType({ type: 'layout' });
        const backgroundProp = layoutProps.find((prop) => prop.key === 'background');
        setBackground(backgroundProp?.value);
    }

    const loadUserCollections = async () => {
        const context = await UserProfile.getCurrentUserContext();
        const { currentProfile } = context;
        const txs = await Transaction.listByProject({
            projectId: configuration.appId,
            page:0,
            limit:100,
            filters: [
                { 
                    key: 'category',
                    value: 'Collection' 
                },
                { 
                    key: 'status',
                    value: 'Created' 
                },
                { 
                    key: 'from',
                    value: currentProfile.source
                }
            ]
        });
        console.log(txs);
        setItems(txs);
    };

    useEffect(() => {
        loadUserCollections();
        loadProperties();
    }, [configuration.appId, user]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleAuth = async () => {
        setShowWalletDialog(true);
    }

    const handleSubmit = async () => {
        let tokenId;
        let contractAddress;

        console.log(minter);

        const pref = getProviderPreference();
        const web3Provider = await Provider.enableWeb3(pref);
        // await switchToChain(constants.NETWORKS[minter.chainId], web3Provider.provider);
        setMinting({ data: null, loading: true, error: null })

        try {
            // Append metadata extra fields
            minter.additionalFields.forEach((field) => minter.metadata[[field.key]] = field.value );

            // Append attributes
            minter.metadata.attributes = minter.metadataAttributes;

            // Append image file
            if (minter.metadata.image && minter.metadata.image instanceof File) {
                console.log('Uploading image file');
                const imageFile = new Provider.File('image', minter.metadata.image);
                await imageFile.saveIPFS();
                const imageFileUrl = imageFile.ipfs();
                minter.metadata.image = imageFileUrl;
            }
            // Append audio file
            if (minter.metadata.youtube_url && minter.metadata.youtube_url instanceof File) {
                console.log('Uploading video file');
                const videoFile = new Provider.File('youtube_url', minter.metadata.youtube_url);
                await videoFile.saveIPFS();
                const videoFileUrl = videoFile.ipfs();
                minter.metadata.youtube_url = videoFileUrl;
            }
            // Append video file
            if (minter.metadata.animation_url && minter.metadata.animation_url instanceof File) {
                console.log('Uploading audio file');
                const audioFile = new Provider.File('animation_url', minter.metadata.animation_url);
                await audioFile.saveIPFS();
                const audioFileUrl = audioFile.ipfs();
                minter.metadata.animation_url = audioFileUrl;
            }

            // Generate metadata and save to IPFS
            const metadataFile = new Provider.File('metadata.json', {
              base64: Buffer.from(JSON.stringify(minter.metadata)).toString("base64"),
            });
            await metadataFile.saveIPFS();
            const metadataFileUrl = metadataFile.ipfs();
            
            let response, hash, status, contract, transaction;

            if (!minter.lazy) {
                // Mint from blockchain
                const signer = web3Provider.getSigner();
                const userAddress = user.get('ethAddress');
                contractAddress = minter.collection[minter.type];

                if (minter.type === 'ERC721') {
                    contract = new ethers.Contract(contractAddress, ERC721DappifyV1.abi, signer);
                    transaction = await contract.mint(userAddress, userAddress, minter.royalties*100, metadataFileUrl);
                } else if (minter.type === 'ERC1155') {
                    contract = new ethers.Contract(contractAddress, ERC1155DappifyV1.abi, signer);
                    transaction = await contract.mint(userAddress, userAddress, minter.royalties*100, metadataFileUrl, minter.amount);
                } else {
                    throw new Error('Unsupported type');
                }

                const tx = await transaction.wait();
                tokenId = tx.events[0].topics[3];
                hash = tx.transactionHash;
                status = 'Minted';
                response = `${constants.NETWORKS[minter.chainId].blockExplorerUrls[0]}/tx/${hash}`;
            } else {
                // Lazy mint
                status = 'LazyMinted';
            }
            
            await new Transaction({
                // Creating new
                transactionHash: hash,
                contract: contractAddress,
                uri: metadataFileUrl,
                tokenId: tokenId,
                metadata: minter.metadata,
                status: status,
                symbol: minter.collectionMetadata.symbol,
                name: minter.metadata.name,
                chainId: minter.chainId,
                event: minter,
                category: 'NFT',
                type: minter.type,
                quantity: parseInt(minter.amount)
            }).save();
    
            setMinting({
                data: response,
                loading: false,
                error: null
            })
        } catch (err) {
            console.error(err);
            setMinting({
                data: null,
                loading: false,
                error: err.message
            })
        }
    }

    const getInitialDropzoneFiles = () => {
        const list = [];
        if (minter.metadata.image) list.push(minter.metadata.image);
        if (minter.metadata.animation_url) list.push(minter.metadata.animation_url);
        if (minter.metadata.youtube_url) list.push(minter.metadata.youtube_url);
        return list;
    }

    const handleTokenImageChange = (files) => {
        // setFiles(files)
        files.forEach((file) => {
            const newMinter = {...minter};
            if (file.type.startsWith('image')) {
                newMinter.metadata.image = file;
            } else if (file.type.startsWith('audio')) {
                newMinter.metadata.animation_url = file;
            } else if (file.type.startsWith('video')) {
                newMinter.metadata.youtube_url = file;
            } else {
                console.log('Not supported');
            }
            setMinter(newMinter);
        });
    }
    console.log(defaultChainId);


    const authContent = (

        <Grid container sx={{
            px: '20%'
        }}>
            <WalletsDialog isOpen={showWalletDialog} onClose={() => setShowWalletDialog(false)} />
            <Grid container sx={{ width: '100%', p: 4 }} spacing={2}>
                <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="My NFT" {...a11yProps(0)} />
                    <Tab label="Advanced (Optional)" {...a11yProps(1)} />
                    <Tab label="Metadata Source" {...a11yProps(2)} />
                    {/* isAuthenticated && (<Tab label="My NFTs" {...a11yProps(3)} />) */}
                  </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Dropzone initialFiles={getInitialDropzoneFiles()} handleChange={handleTokenImageChange} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Properties defaultChainId={defaultChainId} handleAuth={handleAuth} />
                        </Grid>
                        {/*<Grid item xs={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox defaultChecked={minter.lazy} onChange={(e) => {
                                    const newMinter = {...minter};
                                    newMinter.lazy = e.target.checked;
                                    setMinter(newMinter);
                                }} />} label="I want to lazy mint" />
                            </FormGroup>
                            </Grid> */}

                            <Collections hidden={true} defaultChainId={defaultChainId} handleAuth={handleAuth} collections={items} onClose={() => {
                                loadUserCollections();
                            }} />

                            {minting.error && (
                                <Grid item xs={12}>
                                    <Alert  severity="error">{minting.error}</Alert>
                                </Grid>
                            )}
                            {minting.data && (
                                <Grid item xs={12}>
                                    {!minter.lazy && (<Alert severity="success">Your minting was successful <a href={minting.data} target="_blank" rel="noreferrer">view your transaction</a></Alert>)}
                                    {minter.lazy && (<Alert severity="success">Your token has been minted</Alert>)}
                                </Grid>
                            )}
                            {!isAuthenticated && (
                                <Grid item xs={12}>
                                    <Button variant="contained" size="large" fullWidth  onClick={handleAuth}>Connect your wallet to get started!</Button>
                                </Grid>
                            )}
                            {isAuthenticated && (
                                <Grid item xs={12}>
                                    <Button variant="contained" size="large" fullWidth onClick={handleSubmit}>Create your NFT</Button>
                                </Grid>
                            )}
                    </Grid>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <ExtendedAttributes />
                    <MetadataAttributes />
                    <Collections defaultChainId={defaultChainId} handleAuth={handleAuth} collections={items} onClose={() => {
                        loadUserCollections();
                    }} />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <Grid container spacing={2}>
                        {/*<Grid item xs={12} md={6}>
                            <Preview />
                </Grid> */}
                        <Grid item xs={12}>
                            <Editor />
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <NFTList />
                        </Grid>
                    </Grid>
                </TabPanel>
              </Box>
            </Grid>
        </Grid>
    );

    const [activeStep, setActiveStep] = useState(1);

    return (
        <MinterContext.Provider value={context}>
            <React.Fragment>
                <CssBaseline />
                <Box sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    opacity: 0.75,
                    background: `url(${background})`,
                    backgroundSize: 'cover',
                    width: '100%',
                    height: '100%',
                    zIndex: -1,
                    backgroundRepeat: 'repeat-y'
                }}></Box>
                <Grid container direction="column"
                                alignItems="center"
                                justifyContent="center"
                                spacing={1}
                                sx={{ margin: '0 auto' }}>
                    <Grid item xs={12} sx={{ m: 4 }}>
                        <Logo />
                    </Grid>
                    <Grid item xs={12}>
                        {
                            isAuthenticated && (
                                <div>
                                    <span><b>Welcome</b> {formatAddress(user.get('ethAddress'))} </span>
                                    <IconButton aria-label="logout" color="primary" onClick={logout}>
                                        <LogoutIcon />
                                    </IconButton>
                                </div>
                            )
                        }
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h1" fontSize="1.75em" fontWeight={900}>NFT Forge</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h2" fontSize="1.2em" fontWeight={300}>The simplest, yet most flexible way to create NFTs <i>Anywhere</i></Typography>
                    </Grid>
                    {/*<Grid item xs={12} sx={{ mt: 3 }}>
                        <Steps activeStep={activeStep} />
                    </Grid> */}
                    
                </Grid>

    


                {authContent}
            </React.Fragment>
        </MinterContext.Provider>
    );
}

export default Tokenizer;
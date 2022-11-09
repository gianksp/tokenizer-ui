import { useState, useContext, useEffect } from 'react';
import { FormControl, Select, MenuItem, Button, Grid, Paper, Input, InputLabel, FormHelperText, Typography, FormGroup, FormControlLabel, Autocomplete, Box, TextField, Switch } from '@mui/material';
import { MinterContext } from 'components';
import { constants, utils } from 'react-dappify';
import axios from 'axios';

const { setPreference } = utils.localStorage;

const Chains = ({t, props, configuration }) => {
    const {minter, setMinter} = useContext(MinterContext);
    const [networks, setNetworks] = useState([]);
    const [defaultContracts, setDefaultContracts] = useState({});
    const defaultChainId = props.find((opt) => opt.key === 'chainId' )?.value || configuration?.chainId;


	const loadSupportedNetworks = async () => {
		const response = await axios.get(
			`${process.env.REACT_APP_DAPPIFY_API_URL}/chain`,
			{
				headers: {
					"x-api-Key": process.env.REACT_APP_DAPPIFY_API_KEY,
					accept: "application/json"
				}
			}
		);
		setNetworks(response.data);
	};

    const loadDefaultContracts = async () => {
        const cfg = await fetch(`dappify.json`)
        .then((r) => r.json())
        setDefaultContracts(cfg.contract);
    }

	useEffect(() => {
		loadSupportedNetworks();
        loadDefaultContracts();
	}, []);

    const handleSelectNetwork = (e, value) => {
        const newMinter = {...minter};
        const stringId = JSON.stringify(value.chainId);
        newMinter.chainId = stringId.startsWith('0x') ? stringId : `0x${value.chainId.toString(16)}`;
        newMinter.network = value;
        newMinter.collection = defaultContracts[defaultChainId];
		console.log(`Setting minter`);
		console.log(newMinter.collection);
        setMinter(newMinter);
        setPreference(constants.PREFERENCES.CHAIN, { chainId: newMinter.chainId });
    }

    useEffect(() => {
        if (defaultChainId && defaultContracts) {
            const newMinter = {...minter};
            const stringId = JSON.stringify(defaultChainId);
            newMinter.chainId = stringId.startsWith('0x') ? stringId : `0x${defaultChainId.toString(16)}`;
            const targetNetwork = networks.find((network) => network.chainId.toString() === stringId);
            newMinter.network = targetNetwork;
            newMinter.collection = defaultContracts[newMinter.chainId];
			console.log(`Setting minter`);
			console.log(newMinter.collection);
			console.log(defaultContracts);
			console.log(defaultChainId);
            setMinter(newMinter);
            setPreference(constants.PREFERENCES.CHAIN, { chainId: newMinter.chainId });
        }
    }, [defaultChainId, networks, defaultContracts]);

    return networks.length > 0 && minter.network && (
        <Grid container spacing={1}>
				<Grid item xs={12}>
					<FormControl fullWidth>
						<Autocomplete
							id="country-select-demo"
							fullWidth
							options={networks}
                            defaultValue={minter.network}
							autoHighlight
							getOptionLabel={(option) => option.name}
							onChange={handleSelectNetwork}
							renderOption={(props, option) => (
								<li {...props}>
									<Grid
										container
										sx={{ px: 3, py: 1, cursor: "pointer" }}
										key={option.chainId}
									>
										<Box sx={{ minWidth: 30 }}>
											<img
												src={option.imageUrl}
												alt={option.name}
												height="24"
												style={{
													maxHeight: "24px",
													margin: "0 auto",
													borderRadius: "50%"
												}}
												onError={(event) => {
													event.target.src =
														"https://chainlist.org/_next/image?url=%2Funknown-logo.png&w=64&q=75";
													event.onerror = null;
												}}
											/>
										</Box>
										<Typography
											variant="h3"
											fontWeight={200}
                                            fontSize={14}
											sx={{ ml: 2 }}
										>
											{option.name}
										</Typography>
									</Grid>
								</li>
							)}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Select your ecosystem"
									inputProps={{
										...params.inputProps,
										autoComplete: "new-password" // disable autocomplete and autofill
									}}
								/>
							)}
						/>
					</FormControl>
				</Grid>
			</Grid>

    );
}

export default Chains;


       /* <FormControl fullWidth>
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
            </FormControl> */
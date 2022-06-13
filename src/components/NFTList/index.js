import { useEffect, useState, useContext } from 'react';
import { MinterContext } from 'components';
import { Grid, Alert, Paper } from '@mui/material';
import { NFT, UserProfile } from 'react-dappify';
import NFTCard from 'components/NFTCard';

const NFTList = () => {
    const [hasError, setHasError] = useState();
    const {minter, setMinter} = useContext(MinterContext);
    const [nfts, setNfts] = useState([]);

    const additionalFields = [];
    minter.additionalFields.forEach((field) => {
        additionalFields[[field.key]] =  field.value
    })

    const attributes = [];
    minter.metadataAttributes.forEach((attribute) => {
        attributes[[attribute.trait_type]] =  attribute.value
    })
    console.log(minter);
    // minter.medatata?.attributes = attributes;
    const [code, setCode] = useState(
        JSON.stringify({ ...minter.metadata, ...additionalFields })
    );

    const fetchMyNfts = async() => {
        const profile = await UserProfile.getCurrentUser();
        console.log(profile);
        const myNfts = await NFT.getFromUser(profile);
        setNfts(myNfts);
    };

    useEffect(() => {
        fetchMyNfts();
    }, [])

    // console.log(minter);

    const renderNfts = () => {
        const list = [];
        nfts.forEach((nft, index) => {
            console.log(nft);
            list.push(
                <Grid item md={3} xs={2} key={index}>
                    <NFTCard nft={nft} />
                </Grid>
            )
        });
        return list;
    };

    return (
        <Grid container spacing={2}>
            {renderNfts()}
        </Grid>
  );
}

export default NFTList;
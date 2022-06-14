import { useEffect, useState, useContext } from 'react';
import { MinterContext } from 'components';
import { Grid, Box, Paper, Typography } from '@mui/material';
import { Metadata } from 'react-dappify';

const NFTCard = ({ nft }) => {
    const [imagePreview, setImagePreview] = useState();
    const [audioPreview, setAudioPreview] = useState();
    const [videoPreview, setVideoPreview] = useState();
    const [currentNft, setCurrentNft] = useState(nft);

    useEffect(() => {

        const loadMetadata = async() => {
            // Has no metadata and only uri? we need to load it
            if (!nft.metadata.name && nft.metadata.uri) {
                try{
                const meta = await fetch(nft.metadata.uri, {cache: "force-cache"});
                const data = await meta.json(); 
                nft.metadata = new Metadata(data);
                setCurrentNft({...nft});
                }catch (e) {
                    console.log(e);
                }
            }
        }

        // if (nft.metadata.animation_url) {
        //     setAudio(new Audio(nft.metadata.animation_url))
        // }

        loadMetadata();
    }, [nft]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sx={{ minHeight: 70 }}>
                <Paper elevation={5}>
                    <Box sx={{ 
                        width: '100%', 
                        height: 200, 
                        background: `url(${currentNft.metadata.image})`, 
                        backgroundSize: 'contain,cover', 
                        backgroundRepeat:'no-repeat',
                        backgroundPosition: 'center',
                        margin: '0 auto'
                    }}>
                    {videoPreview && (
                        <video controls style={{ width: '100%' }}>
                            <source src={videoPreview} type="audio/ogg" />
                            <source src={videoPreview} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </video>
                    )}
                    {audioPreview && (
                        <audio controls  style={{ width: '100%' }}>
                            <source src={audioPreview} type="audio/ogg" />
                            <source src={audioPreview} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    )}
                    </Box>
                    <Grid container spacing={2} sx={{ p: 2 }}>
                        <Grid item xs={12}  sx={{ wordBreak: 'break-all' }}>
                            <Typography variant="h5">{currentNft.metadata.name}</Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ wordBreak: 'break-all' }}>
                            <Typography variant="body">{currentNft.collection.name} #{currentNft.tokenId} ({currentNft.quantity})</Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ wordBreak: 'break-all' }}>
                            <Typography variant="body">{currentNft.metadata.description}</Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
  );
}

export default NFTCard;
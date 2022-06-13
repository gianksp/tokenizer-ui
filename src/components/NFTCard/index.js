import { useEffect, useState, useContext } from 'react';
import { MinterContext } from 'components';
import { Grid, Box, Paper, Typography } from '@mui/material';

const NFTCard = ({ nft }) => {
    const [imagePreview, setImagePreview] = useState();
    const [audioPreview, setAudioPreview] = useState();
    const [videoPreview, setVideoPreview] = useState();

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sx={{ minHeight: 70 }}>
                <Paper elevation={5} sx={{ width: 250 }}>
                    <Box sx={{ 
                        width: '100%', 
                        height: 250, 
                        background: `url(${nft.metadata.image})`, 
                        backgroundSize: 'contain', 
                        backgroundRepeat:'no-repeat' 
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
                            <Typography variant="h5">{nft.metadata.name}</Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ wordBreak: 'break-all' }}>
                            <Typography variant="body">{nft.metadata.description}</Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
  );
}

export default NFTCard;
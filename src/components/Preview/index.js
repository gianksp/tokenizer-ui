import { useEffect, useState, useContext } from 'react';
import { MinterContext } from 'components';
import { Grid, Box, Paper, Typography } from '@mui/material';

const Preview = () => {
    const {minter, setMinter} = useContext(MinterContext);
    const [imagePreview, setImagePreview] = useState();
    const [audioPreview, setAudioPreview] = useState();
    const [videoPreview, setVideoPreview] = useState();

    useEffect(() => {
        if (minter.metadata.image instanceof File) {
            const reader = new FileReader();
            reader.onload = function(){
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(minter.metadata.image);
        }

        if (minter.metadata.animation_url instanceof File) {
            const reader = new FileReader();
            reader.onload = function(){
                setAudioPreview(reader.result);
            };
            reader.readAsDataURL(minter.metadata.animation_url);
        }

        if (minter.metadata.youtube_url instanceof File) {
            const reader = new FileReader();
            reader.onload = function(){
                setVideoPreview(reader.result);
            };
            reader.readAsDataURL(minter.metadata.youtube_url);
        }

    }, [minter]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sx={{ minHeight: 70 }}>
                <Paper elevation={5} sx={{ width: 400 }}>
                    <Box sx={{ 
                        width: '100%', 
                        height: 400, 
                        background: `url(${imagePreview})`, 
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
                            <Typography variant="h5">{minter.metadata.name}</Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ wordBreak: 'break-all' }}>
                            <Typography variant="body">{minter.metadata.description}</Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
  );
}

export default Preview;
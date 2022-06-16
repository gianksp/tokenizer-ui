import React, { useState, useContext } from "react";
import { DropzoneArea } from "mui-file-dropzone";
import { MinterContext } from 'components';
import uniq from 'lodash/uniq';

const Dropzone = ({ initialFiles=[], handleChange }) => {
    const {minter, setMinter} = useContext(MinterContext);
    const [files, setFiles] = useState([]);

    return <DropzoneArea    showPreviews={false}
                            acceptedFiles={[
                                "image/jpeg", 
                                "image/png", 
                                "video/mp4",
                                "audio/mpeg"
                            ]}
                            maxFileSize={10485760}
                            dropzoneText="Drop your jpeg, png, mp3 audio and mp4 videos up to 10mb"
                            initialFiles={uniq(initialFiles)}
                            onChange={handleChange} />;
}

export default Dropzone;
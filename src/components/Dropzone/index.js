import React from "react";
import { DropzoneArea } from "mui-file-dropzone";
import uniq from 'lodash/uniq';

const Dropzone = ({ initialFiles=[], handleChange, t=()=>{} }) => {

    return <DropzoneArea    showPreviews={false}
                            acceptedFiles={[
                                "image/*",
                                "video/*",
                                "audio/*"
                            ]}
                            maxFileSize={10485760}
                            dropzoneText={t("Drop your jpeg, png, mp3 audio and mp4 videos up to 10mb")}
                            initialFiles={uniq(initialFiles)}
                            onChange={handleChange} />;
}

export default Dropzone;
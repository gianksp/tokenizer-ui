import React, { useState, useContext } from "react";
import { DropzoneArea } from "mui-file-dropzone";
import { MinterContext } from 'components';
import uniq from 'lodash/uniq';

const Dropzone = ({ initialFiles=[], handleChange }) => {
    const {minter, setMinter} = useContext(MinterContext);
    const [files, setFiles] = useState([]);

    return <DropzoneArea    showPreviews={true}
                            maxFileSize={5000000}
                            initialFiles={uniq(initialFiles)}
                            onChange={handleChange} />;
}

export default Dropzone;
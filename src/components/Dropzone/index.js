import React, { useState, useContext } from "react";
import { DropzoneArea } from "mui-file-dropzone";
import { MinterContext } from 'components';

const Dropzone = () => {
    const {minter, setMinter} = useContext(MinterContext);
    const [files, setFiles] = useState([]);

    const handleChange = (files) => {
        setFiles(files)
    }

    return <DropzoneArea onChange={handleChange} />;
}

export default Dropzone;
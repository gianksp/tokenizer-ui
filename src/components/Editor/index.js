import { useEffect, useState, useContext } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { MinterContext } from 'components';
import { Grid, Alert } from '@mui/material';

const Editor = () => {
    const [hasError, setHasError] = useState();
    const {minter, setMinter} = useContext(MinterContext);

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

    // useEffect(() => {
    //     setHasError(false);
    //     try {
    //         const newMinter = {...minter};
    //         newMinter.metadata = JSON.parse(code);
    //         setMinter(newMinter);
    //     } catch (e) {
    //         setHasError(true);
    //         console.log(e);
    //     }
    // }, [code])

    // console.log(minter);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sx={{ minHeight: 70 }}>
                {hasError && (<Alert severity="error">Invalid JSON structure</Alert>)}
            </Grid>
            <Grid item xs={12}>
                <CodeEditor
                    value={code}
                    language="json"
                    // onChange={(evn) => setCode(evn.target.value)}
                    padding={15}
                    style={{
                        fontSize: 12,
                        backgroundColor: "#f5f5f5",
                        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                    }}
                />
            </Grid>
        </Grid>
  );
}

export default Editor;
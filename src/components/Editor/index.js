import { useEffect, useState, useContext } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { MinterContext } from 'components';

const Editor = () => {
    // console.log(MinterContext);

  const {minter, setMinter} = useContext(MinterContext);
  const [code, setCode] = useState(
    JSON.stringify(minter.metadata)
  );

  useEffect(() => {
    const newMinter = {...minter};
    newMinter.metadata = JSON.parse(code);
    setMinter(newMinter);
  }, [code])

  console.log(minter);
  
  return (
    <CodeEditor
      value={code}
      language="json"
      onChange={(evn) => setCode(evn.target.value)}
      padding={15}
      style={{
        fontSize: 12,
        backgroundColor: "#f5f5f5",
        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
      }}
    />
  );
}

export default Editor;
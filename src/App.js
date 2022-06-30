import { useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Router, Redirect } from '@reach/router';
import { CssBaseline } from '@mui/material';
import Tokenizer from 'components';
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import { DappifyContext, Template } from 'react-dappify';
import { isEmpty } from 'lodash';

const defaultTranslation = {
  "react": {
    "useSuspense": true
  },
  "resources": {
    "en": {
      "translation": {}
    }
  },
  "lng": "en",
  "fallbackLng": "en",
  "interpolation": {
    "escapeValue": false
  }
}

i18n
.use(initReactI18next)
.init(defaultTranslation); 

const App = () => {
  const { t } = useTranslation();
  const { configuration } = useContext(DappifyContext);
  const [template, setTemplate] = useState({});
  
  useEffect(() => {
    setTemplate(Template.current());
  }, [configuration]);

  useEffect(() => {
    if (!isEmpty(template)) {
      i18n
        .use(initReactI18next)
        .init(template.translation); 
    }
  }, [template]);
 

  const theme = createTheme(configuration.theme);

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
            <Tokenizer exact default path={`/${process.env.REACT_APP_TEMPLATE_NAME}`} defaultChainId={configuration.template.chainId} onMint={(nft) => console.log(nft)} lazy={false} t={t} />
            <Redirect noThrow={true} from='/' to={`/${process.env.REACT_APP_TEMPLATE_NAME}`} />
        </Router>
      </ThemeProvider>
  );
}

export default App;

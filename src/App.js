import { useContext} from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Tokenizer from 'components';
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import { DappifyContext } from 'react-dappify';

const App = () => {
  const { t } = useTranslation();
  const { configuration } = useContext(DappifyContext);

  i18n
  .use(initReactI18next)
  .init(configuration?.translation);

  const theme = createTheme(configuration.theme);

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Tokenizer defaultChainId={configuration.template.chainId} onMint={(nft) => console.log(nft)} lazy={false} t={t} />
      </ThemeProvider>
  );
}

export default App;

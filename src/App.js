import { useContext, useEffect} from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { green, purple } from '@mui/material/colors';
import Tokenizer from 'components';
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import { DappifyContext } from 'react-dappify';

// i18n
//   .use(initReactI18next) // passes i18n down to react-i18next
//   .init({
//     // the translations
//     // (tip move them in a JSON file and import them,
//     // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
//     resources: {
//       en: {
//         translation: {
//           "Welcome to React": "Welcome to React and react-i18next"
//         }
//       }
//     },
//     lng: "en", // if you're using a language detector, do not define the lng option
//     fallbackLng: "en",

//     interpolation: {
//       escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
//     }
//   });

// const theme = createTheme({
//   palette: {
//     mode:'dark',
//     primary: {
//       main: purple[500],
//     },
//     secondary: {
//       main: green[500],
//     },
//   },
// });

const App = () => {
  // const { t } = useTranslation();
  const { configuration } = useContext(DappifyContext);

  useEffect(() => {
    i18n
      .use(initReactI18next)
      .init(configuration?.translation);
  }, []);

  const theme = createTheme(configuration.theme);

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Tokenizer defaultChainId={configuration.template.chainId} onMint={(nft) => console.log(nft)} lazy={false} />
      </ThemeProvider>
  );
}

export default App;

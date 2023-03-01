import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'
import { SessionContextType, SessionContext, SetSessionContext, defaultSessionValue } from '../lib/contexts'
import { useStateWithLocalStorage } from '../lib/hooks'


const theme = extendTheme({
  colors: {
    primary: {
      primary: "#2F4454",
      50: '#e8f4fe',
      100: '#ccdae7',
      200: '#adc2d1',
      300: '#8ea9be',
      400: '#6f91ab',
      500: '#557791',
      600: '#425d71',
      700: '#2e4252',
      800: '#182833',
      900: '#010e16',
    },
    secondary: {
      secondary: "#376E6F",
      50: '#e2f9fc',
      100: '#c7e6e7',
      200: '#a8d4d5',
      300: '#88c3c4',
      400: '#68b2b3',
      500: '#4f9899',
      600: '#3b7677',
      700: '#285455',
      800: '#123434',
      900: '#001414',
    },
    text: {
      onPrimary: '#FFFFFFC2',
      onSecondary: '#FFFFFFD4'
    }
  }
})


export default function App({ Component, pageProps }: AppProps) {
  const [session, setSession] = useStateWithLocalStorage<SessionContextType>('session', defaultSessionValue)

  return (
    <>
      <Head>
        <title>Vocab</title>
        <meta name="author" content="Leo Cances" />
      </Head>

      <ChakraProvider theme={theme}>
        <SessionContext.Provider value={session}>
          <SetSessionContext.Provider value={setSession}>
            <Component {...pageProps} />
          </SetSessionContext.Provider>
        </SessionContext.Provider>
      </ChakraProvider>
    </>
  )
}

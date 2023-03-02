import '@/styles/globals.css'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { ChakraProvider, extendTheme, useColorModeValue, theme as base } from '@chakra-ui/react'
import { SessionContextType, SessionContext, SetSessionContext, defaultSessionValue } from '../lib/contexts'
import { useStateWithLocalStorage } from '../lib/hooks'

import { theme } from '@/styles/theme'
import '@/styles/theme/styles.css'


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

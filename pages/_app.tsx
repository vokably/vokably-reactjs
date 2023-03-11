import '@/styles/globals.css'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { ChakraProvider, extendTheme, useColorModeValue, theme as base } from '@chakra-ui/react'
import { SessionContextType, SessionContext, SetSessionContext, defaultSessionValue } from '../lib/contexts'
import { LearningSession, defaultLearningSession, LearningSessionContext, SetLearningSessionContext } from '../lib/contexts'
import { useStateWithLocalStorage } from '../lib/hooks'

import { theme } from '@/styles/theme'
import '@/styles/theme/styles.css'


export default function App({ Component, pageProps }: AppProps) {
  const [session, setSession] = useStateWithLocalStorage<SessionContextType>('session', defaultSessionValue)
  const [learningSession, setLearningSession] = useStateWithLocalStorage<LearningSession>('learningSession', defaultLearningSession)

  return (
    <>
      <Head>
        <title>Vocab</title>
        <meta name="author" content="Leo Cances" />
      </Head>

      <ChakraProvider theme={theme}>
        <SessionContext.Provider value={session}>
        <SetSessionContext.Provider value={setSession}>
        <LearningSessionContext.Provider value={learningSession}>
        <SetLearningSessionContext.Provider value={setLearningSession}>
            <Component {...pageProps} />
        </SetLearningSessionContext.Provider>
        </LearningSessionContext.Provider>
        </SetSessionContext.Provider>
        </SessionContext.Provider>
      </ChakraProvider>
    </>
  )
}

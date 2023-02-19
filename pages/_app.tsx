import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ChakraProvider } from '@chakra-ui/react'
import { SessionContextType, SessionContext, SetSessionContext } from './lib/contexts'
import { useStateWithLocalStorage } from './lib/hooks'

export default function App({ Component, pageProps }: AppProps) {
  const [session, setSession] = useStateWithLocalStorage<SessionContextType>('session', {} as SessionContextType)

  return (
    <>
    <Head>
      <title>Vocab</title>
      <meta name="author" content="Leo Cances" />
    </Head>

    <ChakraProvider>
      <SessionContext.Provider value={{ loadedChapters: [] }}>
        <SetSessionContext.Provider value={setSession}>
          <Component {...pageProps} />
        </SetSessionContext.Provider>
      </SessionContext.Provider>
    </ChakraProvider>
    </>
  )
}

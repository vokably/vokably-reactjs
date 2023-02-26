import * as React from 'react'
import {
  Container, Box, Text, Button, VStack, HStack, Tooltip, Tag, Flex, useToast, Wrap, Spacer, Heading,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import TableInfo from '@/type/tableInfo'
import { ChapterDisplay } from '../components/chapterDisplay'
import { SessionContext, SetSessionContext, defaultSessionValue } from '../lib/contexts'
import { useRouter } from 'next/router'
import Word from '@/type/word'


export default function Home(props: any) {
  const session = React.useContext(SessionContext)
  const setSession = React.useContext(SetSessionContext)
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [nbWords, setNbWords] = React.useState<number>(0)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [allWords, setAllWords] = React.useState<Word[]>(session.allWords)

  const all_languages = props.all_languages

  const updateSessionChapter = (ch: TableInfo) => {
    // If chapter already loaded, remove it from the list
    if (session.loadedChapters.includes(ch)) {
      setSession({
        ...session,
        loadedChapters: session.loadedChapters.filter((c) => c !== ch),
      })
      setNbWords(nbWords - ch.nbWord)

      // otherwise, add it to the list
    } else {
      setSession({
        ...session,
        loadedChapters: [...session.loadedChapters, ch],
      })
      setNbWords(nbWords + ch.nbWord)
    }
  }

  const loadWords = async () => {
    let ch2load = session.loadedChapters.map((ch) => ch.table);

    // remove duplicates from ch2load
    ch2load = ch2load.filter((v, i, a) => a.indexOf(v) === i)
    const nb2load = ch2load.length;

    setIsLoading(true)

    // Check if the words are already in the session, if not, fetch them
    let _allWords: Word[] = allWords
    if (allWords.length == 0) {
      console.log('fetching')

      for (const tn of ch2load) {
        // fetch from the /table endpoint, using cache first
        const res = await fetch(`api/table?tableName=${tn}`, {
          method: 'GET',
          mode: 'same-origin',
          cache: 'default',
          next: { revalidate: 60 * 15 },
          headers: {
            Content_Type: 'application/json',
          },
        })

        if (res.status !== 200) {
          console.error(`Error: ${res.status}`)
          return
        }

        const data = await res.json()
        _allWords = [..._allWords, ...data]
      }
    }

    const chapterToKeep = session.loadedChapters.map((ch) => ch.displayName)

    // Keep only the words whose "chapter" field is in the list of loaded chapters
    const filteredWords = _allWords.filter((w: Word) => {
      return chapterToKeep.includes(w.chapter)
    })

    // Add the words to the session
    setSession({
      ...session,
      activeWords: filteredWords,
      allWords: _allWords,
    })
    setAllWords(_allWords)
    setIsLoading(false)
  }


  const startSession = async () => {
    await loadWords()
    router.push("/cross")
    onClose()
  }


  const startTableSession = async () => {
    await loadWords()
    router.push("/table")
    onClose()
  }

  return (
    <Box maxW={['xs']} mx={'auto'}>
      <VStack p={8} spacing={8} mx='auto'>
        <Heading my={8}>Session</Heading>

        <Text fontSize={'1.2em'} align="justify">
          You are going to start a new session.

          A session is a set of vocabulary words that you want to train on.
          It can be a set of words from a chapter, or a set of words from a specific course.
          During the session, you will have metrics on how well you know the words,
          how many times you have seen them, and how many times you have answered them correctly,
          and finally, how fast you are able to answer them.
        </Text>

        <Button colorScheme={'green'} size={"lg"} onClick={() => {
          setSession(defaultSessionValue)
          onOpen()
        }}>
          Vocabulary selection
        </Button>
      </VStack>

      <Drawer placement="right" size="['full']" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Select the vocabulary</DrawerHeader>

            <DrawerBody>
              <VStack>
                <Wrap>
                  {all_languages.map((ch: TableInfo, index: any) => {
                    return (
                      <ChapterDisplay
                        key={index}
                        ch={ch.displayName}
                        onClick={() => updateSessionChapter(ch)}
                      />
                    )
                  })}
                </Wrap>

                <VStack spacing={4}>
                  <Text>
                    You have selected {session.loadedChapters.length} chapters.
                  </Text>
                  <Text>
                    You will be training on {nbWords} words.
                  </Text>

                  <Button
                    colorScheme={'green'}
                    onClick={startSession}
                    isLoading={isLoading}
                  >
                    Start
                  </Button>

                  <Button
                    colorScheme={'Blue'}
                    onClick={startTableSession}
                    isLoading={isLoading}
                  >
                    Table
                  </Button>
                </VStack>
              </VStack>
            </DrawerBody>

          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  )
}


export async function getStaticProps() {
  // fetch the list of available languages table
  const base_id = process.env.AIRTABLE_BASE_ID
  const access_token = process.env.AIRTABLE_ACCESS_TOKEN

  const res = await fetch(
    `https://api.airtable.com/v0/${base_id}/list-table`,
    {
      method: 'GET',
      cache: 'force-cache',
      headers: {
        Content_Type: 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    }
  )
  let data = await res.json()

  if (!data.records) {
    console.error(`Error: ${data.error}`)
    return {
      props: {
        all_languages: [],
      },
    }
  }

  // filter the data to get only the table names
  const all_languages = data.records.map((r: any) => {
    return {
      "tableName": r.fields['tableName'],
      "displayName": r.fields['displayName'],
      "nbWord": r.fields['nbWord'],
      "order": r.fields['order'],
      "table": r.fields['table'],
    }
  })

  all_languages.sort((a: any, b: any) => (a.order > b.order) ? 1 : -1)

  return {
    props: {
      all_languages: all_languages,
    },
    revalidate: process.env.NODE_ENV === 'development' ? 1 : 60,
  }
}
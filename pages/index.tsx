import * as React from 'react'
import {
  Container, Box, Text, Button, VStack, IconButton, Tooltip, Tag, Flex, useToast, Wrap, Spacer, Heading,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { MdBackupTable, MdPersonOutline } from 'react-icons/md'
import { VscDebugStart } from 'react-icons/vsc'
import { ChapterDisplay } from '../components/chapterDisplay'
import { FlagNorway } from '../components/flags'
import { SessionContext, SetSessionContext, defaultSessionValue } from '../lib/contexts'
import { useRouter } from 'next/router'
import Airtable from 'airtable'
import { Chapter, Word} from '@/lib/types'


export default function Home(props: any) {
  const session = React.useContext(SessionContext)
  const setSession = React.useContext(SetSessionContext)
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [nbWords, setNbWords] = React.useState<number>(0)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const allChapter = props.allChapter

  const updateSessionChapter = (ch: Chapter) => {
    // If chapter already loaded, remove it from the list
    if (session.selectedChapter.includes(ch)) {
      setSession({
        ...session,
        selectedChapter: session.selectedChapter.filter((c) => c !== ch),
      })
      setNbWords(nbWords - ch.nbWord)

      // otherwise, add it to the list
    } else {
      setSession({
        ...session,
        selectedChapter: [...session.selectedChapter, ch],
      })
      setNbWords(nbWords + ch.nbWord)
    }
  }

  const uniqueSessionChapter = (ch: Chapter) => {
    setSession({
      ...session,
      selectedChapter: [ch],
    })
    setNbWords(ch.nbWord)
  }


  const startSession = async () => {
    router.push("/cross")
    onClose()
  }

  const startTableSession = async () => {
    router.push("/table")
    onClose()
  }

  
  return (
    <Box mx={'auto'} bg={'primary.primary'} color='text.onPrimary' maxH='100vh' overflowY={'auto'}>
      <VStack
        spacing={8}
        mx='auto'
        border='2px'
      >

        <Flex w='full' bg={'whiteAlpha.100'} px={8} py={4} borderBottom={'2px'} my={'auto'}>
          <Box>
            <FlagNorway />
          </Box>
          <Spacer />
          <Text> 123 words learnt</Text>
          <Spacer />
          <IconButton bg={'primary.primary'} borderRadius='full' aria-label="Table" icon={<MdPersonOutline size={24} />} size="sm" onClick={() => { }} />
        </Flex>

        <VStack spacing={4} p={8} w='full'>
          {allChapter.map((ch: Chapter, index: any) => {
            return (
              <Box
                key={index}
                px={4}
                py={4}
                bg={'secondary.secondary'}
                // borderRadius={8}
                boxShadow={'6px 6px 0px 0px rgba(0,0,0,1);'}
                w='full'
                color={'text.onSecondary'}
              >
                <Flex w='full' h='full'>
                  <Text fontSize={'1.2em'} align="justify">{ch.name}</Text>
                  <Spacer />
                  <IconButton
                    mr={2}
                    bg={'secondary.secondary'}
                    aria-label="Table"
                    icon={<MdBackupTable size={24} />}
                    size="sm"
                    onClick={() => { uniqueSessionChapter(ch); startTableSession() }}
                  />
                  <IconButton
                    bg={'secondary.secondary'}
                    aria-label="Start"
                    icon={<VscDebugStart size={24} />}
                    size="sm"
                    onClick={() => { uniqueSessionChapter(ch); startSession() }}
                  />
                </Flex>
              </Box>
            )
          })}
        </VStack>


        <Box w='full' bg={'whiteAlpha.100'} px={8} py={4} borderTop={'2px'} my={'auto'}>
          <Button w='full' colorScheme={'green'} size={"lg"} onClick={() => {
            setSession(defaultSessionValue)
            onOpen()
          }}>
            Vocabulary selection
          </Button>
        </Box>
      </VStack>

      <Drawer placement="right" size="['full']" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Select the vocabulary</DrawerHeader>

            <DrawerBody>
              <VStack>
                <Wrap>
                  {allChapter.map((ch: Chapter, index: any) => {
                    return (
                      <ChapterDisplay
                        key={index}
                        ch={ch.name}
                        onClick={() => updateSessionChapter(ch)}
                      />
                    )
                  })}
                </Wrap>

                <Text>
                  You have selected {session.selectedChapter.length} chapters.
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
                  colorScheme={'blue'}
                  onClick={startTableSession}
                  isLoading={isLoading}
                >Table</Button>
              </VStack>
            </DrawerBody>

          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  )
}


export async function getStaticProps() {
  const BASE_ID = process.env.AIRTABLE_BASE_ID as string
  const ACCESS_TOKEN = process.env.AIRTABLE_ACCESS_TOKEN as string

  const tableName = 'en-no-json-01'
  const base = new Airtable({ apiKey: ACCESS_TOKEN }).base(BASE_ID)
  const records = await base(tableName).select().all();

  let chapters: Chapter[] = []
  records.forEach((record) => {
    let wordsJson: Word[] = []
    console.log(`chapter : `, record.get('chapter'))
    const rawVocabulary = JSON.parse(record.get('words') as string)
    rawVocabulary.forEach((w: any) => {
      wordsJson.push({
        a: w.a,
        b: w.b,
        chapter: record.get('chapter') as string,
        counter: 0,
      })
    })

    const chapterInfo: Chapter = {
      name: record.get('chapter') as string,
      nbWord: record.get('nbWord') as number,
      order: record.get('order') as number,
      words: wordsJson,
    }

    chapters.push(chapterInfo)
  });

  // sort the words by order
  chapters.sort((a, b) => (a.order > b.order) ? 1 : -1)

  return {
    props: {
      allChapter: chapters,
    }
  }
}
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
import { FlagButton, FlagNorway } from '../components/flags'
import { SessionContext, SetSessionContext, defaultSessionValue } from '../lib/contexts'
import { useRouter } from 'next/router'
import { getAllChapter } from '@/lib/utils'
import { Chapter, Word} from '@/lib/types'


const languages = new Map<string, string>([
  ['en', "en-no-json-01"],
  ['uk', "uk-no-json-01"]
])

export default function Home(props: any) {
  const session = React.useContext(SessionContext)
  const setSession = React.useContext(SetSessionContext)
  const router = useRouter()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [nbWords, setNbWords] = React.useState<number>(0)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [allChapter, setAllChapter] = React.useState<Chapter[]>(props.allChapter)

  React.useEffect(() => {
    setIsLoading(true)

    // Add a to the url information about the current language
    const _lang = router.query.lang as string || "en"
    const _table = languages.get(_lang) || "en-no-json-01"

    // fetch the new table of vocabulary
    fetch(`/api/table?lang=${_lang}`)
    .then((res) => {
      if (res.status !== 200) {
        console.error(`Error ${res.status}: ${res.statusText}`)
        onChangeLanguage()
      }

      return res.json()
    })
    .then((data) => {
      setSession({
        ...session,
        language: _lang,
        airtable: _table,
      })
      setAllChapter(data)
      setIsLoading(false)
    })
  }, [router.query.lang])

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

  const onChangeLanguage = () => {
    if (session.language === "en") {
      router.push(`/?lang=uk`, undefined, { shallow: true })  // we want to refetch the data
    } else {
      router.push(`/?lang=en`, undefined, { shallow: true })  // we want to refetch the data
    }
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
            <FlagButton callback={onChangeLanguage}/>
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
                border={'2px'}
                borderColor={'black'}
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
                    isLoading={isLoading}
                  />
                  <IconButton
                    bg={'secondary.secondary'}
                    aria-label="Start"
                    icon={<VscDebugStart size={24} />}
                    size="sm"
                    onClick={() => { uniqueSessionChapter(ch); startSession() }}
                    isLoading={isLoading}
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


export async function getServerSideProps(context: any) {
  // context.res.setHeader(
  //   'Cache-Control',
  //   'public, s-maxage=600'  // 10 minutes cache
  // )

  let tableName = "en-no-json-01"
  if (context.query.lang) {
    console.log(context.query.lang)
    tableName = context.query.lang === "en" ? "en-no-json-01" : "uk-no-json-01"
  }

  const allChapters = await getAllChapter(context.query.lang)

  return {
    props: {
      allChapter: allChapters,
    }
  }
}
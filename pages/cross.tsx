import * as React from 'react'
import {
  Container, Box, Text, Button, VStack, HStack, Tooltip, Tag, Flex, useColorModeValue, Wrap, Spacer,
  useColorMode, IconButton
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { SessionContext, SetSessionContext } from '../lib/contexts'
import { zip, shuffleArray } from '@/lib/utils'
import { Word, nullWord } from '@/lib/types'
import { bsL, bsD } from '@/lib/utils'
import Link from 'next/link'


interface WordPairs {
  left: Word[]
  right: Word[]
}


export default function Home() {
  const session = React.useContext(SessionContext)
  const setSession = React.useContext(SetSessionContext)

  const [allWords, setAllWords] = React.useState<Word[]>([])
  const [wordsLoaded, setWordsLoaded] = React.useState<boolean>(false)
  const [wordPairs, setWordPairs] = React.useState<WordPairs>({ left: [], right: [] })
  const [shuffleWords, setShuffleWords] = React.useState<boolean>(false)

  const [leftSelectedWord, setLeftSelectedWord] = React.useState<Word>(nullWord)
  const [rightSelectedWord, setRightSelectedWord] = React.useState<Word>(nullWord)

  const color = useColorModeValue('gray.800', 'gray.50')
  const borderColor = useColorModeValue('black', 'white')
  const bg = useColorModeValue('#EFEFEF', 'gray.800')
  const boxShadow = useColorModeValue(bsL, bsD)
  const colorScheme = useColorModeValue('primary', 'secondary')


  React.useEffect(() => {
    if (!wordsLoaded) {
      setAllWords(session.selectedChapter.map((ch) => ch.words).flat())
      setWordsLoaded(true)
    }

    // Select 5 random words, the lower the counter the higher the chance of being selected, random
    let randomWords = allWords.sort((a: Word, b: Word) => a.counter - b.counter).slice(0, 5)
    const leftWords = [...shuffleArray(randomWords)]
    const rightWords = [...shuffleArray(randomWords)]

    const pairs: WordPairs = {
      left: leftWords,
      right: rightWords
    }
    setWordPairs(pairs)

  }, [allWords, wordsLoaded, shuffleWords])


  const [startTime, setStartTime] = React.useState<number>(-1)
  const [isMirrored, setIsMirrored] = React.useState<boolean>(false)
  React.useEffect(() => {
    setTimeout(() => {
      // Can't update the context in two different useEffect, because they are not
      // thread safe, so we need to do it in one useEffect
      let nbGoodAnswers = session.nbGoodAnswers
      let nbBadAnswers = session.nbBadAnswers
      const _a = leftSelectedWord
      const _b = rightSelectedWord

      // The user have just selected the left word
      if ((_a.b && !_b.b) || (_a.b && _b.b)) {
        setStartTime(performance.now())
      }

      if (leftSelectedWord.a && rightSelectedWord.b) {
        // compute the response time (exception if first time)
        let responseTime = session.responseTime
        if (startTime !== -1) {
          const endTime = performance.now()
          const duration = endTime - startTime
          responseTime = [...session.responseTime, duration]
          setStartTime(endTime)  // As soon as the user select the right word, we reset the start time
        }

        // check if the words match
        if (leftSelectedWord.b === rightSelectedWord.b) {
          nbGoodAnswers += 1
          setShuffleWords(!shuffleWords)

          // update the counter for the word
          const updatedWords = allWords.map((word: Word) => {
            if (word.a === leftSelectedWord.a) {
              word.counter += 1
            }
            return word
          })
          setAllWords(updatedWords)

        } else {
          nbBadAnswers += 1
          setShuffleWords(!shuffleWords)

          //  Shake the div with id = "global-2-column"
          const body = document.getElementById('global-2-column')
          if (body) {
            body.classList.add('shake')
            setTimeout(() => {
              body.classList.remove('shake')
            }
              , 500)
          }
        }

        setLeftSelectedWord(nullWord)
        setRightSelectedWord(nullWord)
        setIsMirrored(Math.random() > 0.5)

        // If the word is not in the history, add it
        let wordHistory = session.wordHistory
        if (!session.wordHistory.includes(leftSelectedWord)) {
          wordHistory = [...session.wordHistory, leftSelectedWord]
        }

        // update the session
        setSession({
          ...session,
          nbGoodAnswers: nbGoodAnswers,
          nbBadAnswers: nbBadAnswers,
          responseTime: responseTime,
          wordHistory: wordHistory
        })
      }
    }, 250)
  }, [leftSelectedWord, rightSelectedWord])

  return (
    // build the left and right columns
    <Box
      bg={bg}
      color={color}
      height='100vh'
    >
      <Container maxW={['xl']} mx='auto' p={8}>

        <VStack id="global-2-column" w='full' my={'auto'}>
          <Flex w='full' pb={4}>
            <Text
              my='auto'
              fontWeight={'bold'}
              fontSize={'1.5em'}
            >
              Vocab
            </Text>

            <Spacer />

            <Link href={`/?lang=${session.language}`}>
              <Button colorScheme="red" variant="outline">
                Finish
              </Button>
            </Link>

            <Spacer />

            <IconButton
              aria-label='Toggletheme'
              icon={useColorModeValue(<ViewIcon />, <ViewOffIcon />)}
              onClick={useColorMode().toggleColorMode}
              boxShadow={boxShadow}
              colorScheme={colorScheme}
            />

          </Flex>

          <VStack spacing={4}>
            {zip(wordPairs.left, wordPairs.right).map((pair, i) => {
              const [left, right] = pair
              if (isMirrored) {
                return (
                  <HStack key={i} w='full' spacing={6} justify='space-between'>
                    <WordCard
                      key={i}
                      word={left}
                      lang={'a'}
                      selectedWord={leftSelectedWord}
                      setSelectedWord={setLeftSelectedWord}
                    />
                    <WordCard
                      key={i}
                      word={right}
                      lang={'b'}
                      selectedWord={rightSelectedWord}
                      setSelectedWord={setRightSelectedWord}
                    />
                  </HStack>
                )
              } else {
                return (
                  <HStack key={i} w='full' spacing={6} justify='space-between'>
                    <WordCard
                      key={i}
                      word={right}
                      lang={'b'}
                      selectedWord={rightSelectedWord}
                      setSelectedWord={setRightSelectedWord}
                    />
                    <WordCard
                      key={i}
                      word={left}
                      lang={'a'}
                      selectedWord={leftSelectedWord}
                      setSelectedWord={setLeftSelectedWord}
                    />
                  </HStack>
                )
              }
            })}
          </VStack>

          <Box>
            {leftSelectedWord.a && <Reveal leftSelectedWord={leftSelectedWord} />}
          </Box>
        </VStack>

        <StatCard />
      </Container>
    </Box>
  )
}


const Reveal: React.FC<{ leftSelectedWord: Word }> = ({ leftSelectedWord }) => {
  const [val, setVal] = React.useState<string>('')
  const [timer, setTimer] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const boxShadow = useColorModeValue(bsL, bsD)

  React.useEffect(() => {
    if (timer !== null)
      clearTimeout(timer)

    setIsLoading(true)
    let _timer = setTimeout(() => {
      setVal(leftSelectedWord.b)
      setIsLoading(false)
    }, 5000)

    setTimer(_timer)

    return () => {
      clearTimeout(_timer)
      setTimer(null)
    }

  }, [leftSelectedWord])

  return (
    <Button
      my={4}
      fontSize={20}
      fontWeight="bold"
      colorScheme={'blue'}
      borderRadius={0} p={4}
      boxShadow={boxShadow}
      isLoading={isLoading}
    >
      {val}
    </Button>
  )
}



interface WordCardProps {
  word: Word
  lang: string
  selectedWord: Word
  setSelectedWord: React.Dispatch<React.SetStateAction<Word>>
}

const WordCard: React.FC<WordCardProps> = (props) => {
  const { word, lang } = props
  const bgPop = useColorModeValue('#EFEFEF', 'gray.800')
  const hoverBg = useColorModeValue('success.200', 'success.700')
  const boxShadow = useColorModeValue(bsL, bsD)
  const colorScheme = useColorModeValue('primary', 'secondary')

  const toggleSelectedWord = () => {
    if (props.selectedWord.a === word.a) {
      props.setSelectedWord(nullWord)
    } else {
      props.setSelectedWord(word)
    }
  }

  return (
    <Box
      _hover={{
        bg: hoverBg,
        border: '1px solid #fff'
      }}
      bg={(props.selectedWord.a === word.a) ? hoverBg : bgPop}
      p={4}
      mx="auto"
      minW={'150px'}
      cursor="pointer"
      border={(props.selectedWord.a === word.a)
        ? '1px solid #909090'
        : '1px solid #000000ff'
      }
      boxShadow={boxShadow}
      transition="all 0.2s ease-in-out"
      onClick={toggleSelectedWord}
      transform={props.selectedWord.a === word.a ? 'scale(1.1)' : 'scale(1)'}
    >
      <Text fontWeight={'medium'} >{
        lang === 'a' ? word.a : word.b
      }</Text>
    </Box>
  )
}


const StatRow: React.FC<{ label: string, val: string }> = ({ label, val }) => {
  return (
    <Flex w='full'>
      <Text>{label}</Text>
      <Spacer />
      <Text>{val}</Text>
    </Flex>
  )
}

const StatCard: React.FC = () => {
  const session = React.useContext(SessionContext)
  const nbWords = session.selectedChapter.map((ch) => ch.words).flat().length

  const nbga = session.nbGoodAnswers
  const nbba = session.nbBadAnswers
  const nbt = nbga + nbba
  const acc = nbt > 0 ? Math.round((nbga / nbt) * 100) : 0
  const totalResponseTime = session.responseTime.reduce((summed, a) => summed + a, 0)
  const averageResponseTime = Math.round(totalResponseTime / nbt)

  // display the average response time with the following format ss.ms
  const timeString = (ms: number) => {
    const s = Math.floor(ms / 1000)
    const ms_ = ms % 1000

    // Round the ms to 2 digits
    const ms__ = Math.round(ms_ / 10)
    return `${s}.${ms__}s`
  }

  const bg = useColorModeValue('#EFEFEF', 'gray.800')
  const boxShadow = useColorModeValue(bsL, bsD)

  return (
    <Box
      m={8}
      p={4}
      shadow="md"
      border={'1px solid #000000ff'}
      bg={bg}
      boxShadow={boxShadow}
    >
      <VStack>
        <StatRow label='Nb Good answer:' val={nbga.toString()} />
        <StatRow label='Nb Bad answer:' val={nbba.toString()} />
        <StatRow label='Nb Total answer:' val={nbt.toString()} />
        <StatRow label='Accuracy:' val={acc.toString() + '%'} />
        <StatRow label='Average answer time:' val={
          nbt > 0 ? timeString(averageResponseTime) : '0s'
        } />
        <StatRow label='Words seen: ' val={
          session.wordHistory.length.toString() + ` / ${nbWords}`
        } />

      </VStack>

    </Box>
  )
}
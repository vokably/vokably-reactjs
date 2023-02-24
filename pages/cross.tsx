import * as React from 'react'
import { Container, Box, Text, Button, VStack, HStack, Tooltip, Tag, Flex, useToast, Wrap, Spacer } from '@chakra-ui/react'
import { useStateWithLocalStorage } from '../lib/hooks'
import { SessionContext, SetSessionContext } from '../lib/contexts'
import Word from '@/type/word'

import Link from 'next/link'

export default function Home() {
  const toast = useToast()
  const session = React.useContext(SessionContext)
  const setSession = React.useContext(SetSessionContext)
  const descRef = React.useRef<HTMLDivElement>(null)

  const [toggleWord, setToggleWord] = React.useState<boolean>(false)
  const [wordsLoaded, setWordsLoaded] = React.useState<boolean>(false)
  const [allWords, setAllWords] = React.useState<any>([])
  const [leftWords, setLeftWords] = React.useState<any>([])
  const [rightWords, setRightWords] = React.useState<any>([])
  const [order, setOrder] = React.useState<boolean>(true)

  const [leftSelectedWord, setLeftSelectedWord] = React.useState<Word>({ a: '', b: '', chapter: '', counter: 0 })
  const [leftSelectedPos, setLeftSelectedPos] = React.useState<number>(0)
  const [rightSelectedWord, setRightSelectedWord] = React.useState<Word>({ a: '', b: '', chapter: '', counter: 0 })
  const [rightSelectedPos, setRightSelectedPos] = React.useState<number>(0)


  React.useEffect(() => {
    
    if (!wordsLoaded) {
      setAllWords([])
      setAllWords(session.allWords)
      setWordsLoaded(true)
    }

    if (wordsLoaded) {

      // Select 5 random words, the lower the counter the higher the chance of being selected, random
      let randomWords = allWords.sort((a: Word, b: Word) => a.counter - b.counter).slice(0, 5)
      randomWords = randomWords.sort(() => 0.5 - Math.random())

      // Randomize the position of the words for left and right columns
      let posLeft = [1, 2, 3, 4, 5]
      posLeft = posLeft.sort(() => 0.5 - Math.random())

      let posRight = [1, 2, 3, 4, 5]
      posRight = posRight.sort(() => 0.5 - Math.random())

      // Associate the words with the positions
      const leftWords = randomWords.map((word: Word, index: number) => {
        return {
          word: word,
          pos: posLeft[index]
        }
      })

      const rightWords = randomWords.map((word: Word, index: number) => {
        return {
          word: word,
          pos: posRight[index]
        }
      })

      const leftWordsRandom = leftWords.sort(() => 0.5 - Math.random())
      const rightWordsRandom = rightWords.sort(() => 0.5 - Math.random())

      setLeftWords(leftWordsRandom)
      setRightWords(rightWordsRandom)
    }

  }, [allWords, wordsLoaded, toggleWord])


  const [startTime, setStartTime] = React.useState<number>(0)
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

        const endTime = performance.now()
        const responseTime = endTime - startTime

        // check if the words match
        if (leftSelectedWord.b === rightSelectedWord.b) {
          nbGoodAnswers += 1
          setToggleWord(!toggleWord)

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
          setToggleWord(!toggleWord)

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

        setLeftSelectedWord({} as Word)
        setLeftSelectedPos(0)
        setRightSelectedWord({} as Word)
        setRightSelectedPos(0)
        setOrder(Math.random() > 0.5)

        // make so that no words are focus
        descRef.current?.focus()

        // update the session
        setSession({
          ...session,
          nbGoodAnswers: nbGoodAnswers,
          nbBadAnswers: nbBadAnswers,
          responseTime: [...session.responseTime, responseTime]
        })
      }
    }, 250)
  }, [leftSelectedWord, rightSelectedWord])

  return (
    // build the left and right columns
    <Box bg={'gray.700'} height='100vh'>
      <Container maxW={['xl']} mx='auto' p={8}>

        <VStack id="global-2-column" w='full'>
          <Flex w='full' pb={4}>
            <Text
              color='white'
              my='auto'
              fontWeight={'bold'}
              fontSize={'1.5em'}
            >
              Vocab
            </Text>
            <Spacer />
            <Link href="/session">
              <Button colorScheme="red" variant="outline">
                Finish
              </Button>
            </Link>
          </Flex>

          {/* 50% to inverse order of column */}
          {order
            ? (
              <HStack spacing={4}>
                <Column
                  words={leftWords}
                  lang={'norwegian'}
                  selectedWord={leftSelectedWord}
                  selectedPos={leftSelectedPos}
                  setSelectedWord={setLeftSelectedWord}
                  setSelectedPos={setLeftSelectedPos}
                />
                <Column
                  words={rightWords}
                  lang={'english'}
                  selectedWord={rightSelectedWord}
                  selectedPos={rightSelectedPos}
                  setSelectedWord={setRightSelectedWord}
                  setSelectedPos={setRightSelectedPos}
                />
              </HStack>
            )
            : (
              <HStack spacing={4}>
                <Column
                  words={rightWords}
                  lang={'english'}
                  selectedWord={rightSelectedWord}
                  selectedPos={rightSelectedPos}
                  setSelectedWord={setRightSelectedWord}
                  setSelectedPos={setRightSelectedPos}
                />
                <Column
                  words={leftWords}
                  lang={'norwegian'}
                  selectedWord={leftSelectedWord}
                  selectedPos={leftSelectedPos}
                  setSelectedWord={setLeftSelectedWord}
                  setSelectedPos={setLeftSelectedPos}
                />
              </HStack>
            )
          }

          <Box ref={descRef}>
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
      my={'auto'}
      fontSize={24}
      fontWeight="bold"
      colorScheme={'blue'}
      borderRadius={8} p={4}
      isLoading={isLoading}
    >
      {val}
    </Button>
  )
}


interface ColumnProps {
  words: any
  lang: string
  selectedWord: Word
  selectedPos: number
  setSelectedWord: React.Dispatch<React.SetStateAction<Word>>
  setSelectedPos: React.Dispatch<React.SetStateAction<number>>
}


const Column: React.FC<ColumnProps> = (props) => {

  const { words, selectedWord, selectedPos, setSelectedWord, setSelectedPos } = props

  return (
    <VStack maxW={['xl']} spacing={4}>
      {
        words.map((word: any, index: number) => {
          return (
            <WordBox
              key={index}
              word={word.word}
              lang={props.lang}
              pos={word.pos}
              selectedWord={selectedWord}
              selectedPos={selectedPos}
              setSelectedWord={setSelectedWord}
              setSelectedPos={setSelectedPos}
            />
          )
        })
      }
    </VStack>
  )
}


interface WordBoxProps {
  word: Word
  lang: string
  pos: number
  selectedWord: Word
  selectedPos: number
  setSelectedWord: React.Dispatch<React.SetStateAction<Word>>
  setSelectedPos: React.Dispatch<React.SetStateAction<number>>
}

const WordBox: React.FC<WordBoxProps> = (
  { word, pos, selectedWord, selectedPos, setSelectedWord, setSelectedPos, lang }
) => {

  const bgColor = selectedPos === pos ? 'gray.600' : 'gray.700'
  const borderColor = selectedPos === pos ? 'green.600' : 'gray.600'
  const borderWidth = selectedPos === pos ? 2 : 1

  return (
    // animate the box when selected
    // <Tooltip
    //   label={lang === 'norwegian' ? word.b : word.a}
    //   aria-label="A tooltip"
    //   placement="top"
    //   hasArrow
    //   openDelay={1500}
    // >
      <Box
        _hover={{
          bg: 'gray.600',
        }}
        borderWidth={borderWidth}
        borderRadius={8}
        borderColor={borderColor}
        bg={bgColor}
        width={'150px'}
        mx="auto"
        p={4}
        boxShadow="md"
        onClick={() => {
          setSelectedWord(word)
          setSelectedPos(pos)
        }}
        cursor="pointer"
        transition="all 0.2s ease-in-out"
      >
        <Text color='gray.100'>{
          lang === 'norwegian' ? word.a : word.b
        }</Text>
      </Box>
    // </Tooltip>
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

  return (
    <Box
      m={8}
      p={4}
      shadow="md"
      color='white'
    >
      <VStack>
        <StatRow label='Nb Good answer:' val={nbga.toString()} />
        <StatRow label='Nb Bad answer:' val={nbba.toString()} />
        <StatRow label='Nb Total answer:' val={nbt.toString()} />
        <StatRow label='Accuracy:' val={acc.toString() + '%'} />
        <StatRow label='Average answer time:' val={
          nbt > 0 ? timeString(averageResponseTime) : '0s'
        } />
      </VStack>

    </Box>
  )
}
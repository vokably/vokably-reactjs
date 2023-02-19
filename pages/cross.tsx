import * as React from 'react'
import { Container, Box, Text, Button, VStack, HStack, Tooltip, Tag, Flex, useToast, Wrap, Spacer} from '@chakra-ui/react'
import Header from './components/header'
import { useStateWithLocalStorage } from './lib/hooks'
import { SessionContext, SetSessionContext } from './lib/contexts'
import Head from 'next/head'

const all_chapter = [
  "chapter1.json",
  "chapter2.json",
  "chapter3.json",
  "chapter4.json",
  "family.json",
  "ordinal.json",
  "time.json",
]

type Word = {
  norwegian: string
  english: string
  counter: number
}

export default function Home() {
  const toast = useToast()
  const session = React.useContext(SessionContext)
  const setSession = React.useContext(SetSessionContext)

  const [toggleWord, setToggleWord] = React.useState<boolean>(false)
  const [wordsLoaded, setWordsLoaded] = React.useState<boolean>(false)
  const [allWords, setAllWords] = React.useState<any>([])
  const [selectedWords, setSelectedWords] = React.useState<any>([])
  const [leftWords, setLeftWords] = React.useState<any>([])
  const [rightWords, setRightWords] = React.useState<any>([])
  const [order, setOrder] = React.useState<boolean>(true)

  const [chapter, setChapter] = useStateWithLocalStorage<string[]>("chapters", ["chapter1.json"])

  const [leftSelectedWord, setLeftSelectedWord] = React.useState<Word>({norwegian: '', english: '', counter: 0})
  const [leftSelectedPos, setLeftSelectedPos] = React.useState<number>(0)
  const [rightSelectedWord, setRightSelectedWord] = React.useState<Word>({norwegian: '', english: '', counter: 0})
  const [rightSelectedPos, setRightSelectedPos] = React.useState<number>(0)

  const [counter, setCounter] = React.useState<number>(0)


  React.useEffect(() => {
    const loadOneFile = async (file: string) => {
      fetch(`vocabulary/${file}`)
        .then(res => res.json())
        .then(data => {
          // recreate the data structure to add the counter default to 0
          data = data.map((word: Word) => {
            return {
              norwegian: word.norwegian,
              english: word.english,
              counter: 0
            }
          })

          // Shuffle the words
          data = data.sort(() => 0.5 - Math.random())

          // add the words to the allWords array
          setAllWords((allWords: any) => [...allWords, ...data])
        })
    }

    if (!wordsLoaded) {
      // empty the allWords array
      setAllWords([])

      chapter.forEach((file) => {
        loadOneFile(file)
      })
      setWordsLoaded(true)

      toast({
        title: "Words loaded",
        description: "Words loaded",
        status: "success",
        duration: 2000,
        isClosable: true,
      })
    }

    if (wordsLoaded) {
      console.log('words loaded')

      // Select 5 random words, the lower the counter the higher the chance of being selected, random
      let randomWords = allWords.sort((a: Word, b: Word) => a.counter - b.counter).slice(0, 5)
      randomWords = randomWords.sort(() => 0.5 - Math.random())
      setSelectedWords(randomWords)

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


  React.useEffect(() => {
    console.log('checking')
    // wait 250ms before clearing the selected words
    const timer = setTimeout(() => {
      if (leftSelectedWord.norwegian  && rightSelectedWord.english) {

        // check if the words match
        if (leftSelectedWord.english === rightSelectedWord.english) {
          console.log('match')
          setCounter(counter + 1)
          setToggleWord(!toggleWord)

          // update the counter for the word
          const updatedWords = allWords.map((word: Word) => {
            if (word.norwegian === leftSelectedWord.norwegian) {
              word.counter += 1
            }
            return word
          })
          setAllWords(updatedWords)

        } else {
          console.log('no match')
          setCounter(counter - 1)
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
        setLeftSelectedPos(-1)
        setRightSelectedWord({} as Word)
        setRightSelectedPos(-1)
        setOrder(Math.random() > 0.5)
      }
    }, 250)

  }, [leftSelectedWord, rightSelectedWord])

  return (
    // build the left and right columns
    <Box bg={'gray.700'} height='100vh'>
    <Container maxW={['xl']} mx='auto' p={8}>

      <VStack id="global-2-column" w='full'>
        <Flex w='full' borderBottom={'1px solid #fff'} pb={4}>
          <Text color='white' my='auto' fontWeight={'bold'} fontSize={'1.5em'}>Vocab</Text>
          <Spacer />
          <Header>
            <Wrap>
              {all_chapter.map((ch, index) => {
                return (
                  <ChapterDisplay
                    key={index}
                    ch={ch}
                    setChapter={() => setSession({loadedChapters: [...session.loadedChapters, ch]})}
                    setWordsLoaded={setWordsLoaded}
                  />
                )
              })}
            </Wrap>
          </Header>
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

      <Counter val={counter} />
      {leftSelectedWord.norwegian && <Reveal leftSelectedWord={leftSelectedWord}/>}
      </VStack>
    </Container>
    </Box>
  )
}

interface ChapterDisplayProps {
  ch: string
  setChapter: React.Dispatch<React.SetStateAction<string[]>>
  setWordsLoaded: React.Dispatch<React.SetStateAction<boolean>>
}

const ChapterDisplay: React.FC<ChapterDisplayProps> = ({ch, isActive, setChapter, setWordsLoaded}) => {
  const [isLocalActive, setIsLocalActive] = React.useState<boolean>(false)

  const onClick = () => {
    // if the chapter is already active, remove it from the list
    if (isActive) {
      setChapter((prev) => {
        return prev.filter((c) => c !== ch)
      })
      setIsLocalActive(false)
    } else {
      setChapter((prev) => {
        return [...prev, ch]
      })
      setIsLocalActive(true)
    }

    setWordsLoaded(false)
  }

  return (
    <Tag
      size="lg"
      colorScheme={(isLocalActive || isActive) ? 'green' : 'red'}
      mr={2}
      onClick={onClick}
    >
      {ch}
    </Tag>
  )
}


const Counter: React.FC<{val: number}> = ({val}) => {
  const color =  val > 0 ? 'green.500' : 'red.500'

  return (
      <Text my={'auto'} color={color} fontSize={24} fontWeight="bold"
        bg='white' borderRadius={8} p={4}
      >{val}</Text>
  )
}


const Reveal: React.FC<{leftSelectedWord: Word}> = ({leftSelectedWord}) => {
  const [val, setVal] = React.useState<string>('')
  const [timer, setTimer] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  React.useEffect(() => {
    console.log('leftSelectedWord', leftSelectedWord)
    console.log('timer', timer)

    if (timer !== null)
      clearTimeout(timer)

    setIsLoading(true)
    let _timer = setTimeout(() => {
      setVal(leftSelectedWord.english)
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

  const {words, selectedWord, selectedPos, setSelectedWord, setSelectedPos} = props

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
  {word, pos, selectedWord, selectedPos, setSelectedWord, setSelectedPos, lang}
) => {

  const bgColor = selectedPos === pos ? 'gray.600' : 'gray.700'
  const borderColor = selectedPos === pos ? 'green.600' : 'gray.600'
  const borderWidth = selectedPos === pos ? 2 : 1

  return (
    // animate the box when selected
    <Tooltip
      label={lang === 'norwegian' ? word.english : word.norwegian}
      aria-label="A tooltip"
      placement="top"
      hasArrow
      openDelay={1500}
    >
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
        lang === 'norwegian' ? word.norwegian : word.english
      }</Text>
    </Box>
    </Tooltip>
  )
}
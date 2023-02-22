import * as React from 'react'
import { Container, Box, Input, Text, Button, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  const [currentWord, setCurrentWord] = React.useState<string>('')
  const [currentTranslation, setCurrentTranslation] = React.useState<string>('')
  const [userTranslation, setUserTranslation] = React.useState<string>('')
  const [secondScreen, setSecondScreen] = React.useState<boolean>(true)
  const [toggleWord, setToggleWord] = React.useState<boolean>(false)
  const [wordsLoaded , setWordsLoaded] = React.useState<boolean>(false)
  const [allWords, setAllWords] = React.useState<any>([])

  React.useEffect(() => {
    router.push('/session')
    if (!wordsLoaded) {
      fetch('/vocab.json')
        .then(res => res.json())
        .then(data => {
          setAllWords(data)
          setWordsLoaded(true)
        })
    }

    if (wordsLoaded) {
      const randomWord = allWords[Math.floor(Math.random() * allWords.length)]
      setCurrentWord(randomWord.norwegian)
      setCurrentTranslation(randomWord.english)
    }
    
  }, [toggleWord, allWords, wordsLoaded])


  return (
   <Container maxW={['xl']}>
      <Box>
        {secondScreen 
        ? <SecondScreen
          userTranslation={userTranslation}
          currentTranslation={currentTranslation}
          onClick={() => {
            setSecondScreen(false);
            setToggleWord(!toggleWord);
          }}
        /> 
        : <FirstScreen
          setUserTranslation={setUserTranslation}
          displayWord={currentWord}
          onClick={() => {setSecondScreen(true)}}
        />
        }
      </Box>
    </Container>
  )
}


interface FirstScreenProps {
  setUserTranslation: React.Dispatch<React.SetStateAction<string>> 
  displayWord: string
  onClick: () => void
}

const FirstScreen: React.FC<FirstScreenProps> = (props) => {
  return (
    <Box p={8} shadow="md" borderWidth="1px">
      <VStack spacing={4} align='left'>
        <Text>{props.displayWord}</Text>
        <Input placeholder="Type here..." 
          autoFocus
          onChange={(e) => {props.setUserTranslation(e.target.value)}}
          onKeyDown={(e) => {e.key === 'Enter' && props.onClick()}}
        />
        <Button 
          onClick={props.onClick}
        >Submit</Button>
      </VStack>
    </Box>
  )
}


interface SecondScreenProps {
  userTranslation: string
  currentTranslation: string
  onClick: () => void
}


const SecondScreen: React.FC<SecondScreenProps> = (props) => {
  return (
    <Box p={8} shadow="md" borderWidth="1px">
      <VStack spacing={4} align='left'>
        {
          props.userTranslation === props.currentTranslation ? (
            <Text color="green.500">Correct!</Text>
          ) : (
            <VStack>
              <Text color="red.500">Incorrect!</Text>
              <Text>It was: {props.currentTranslation}</Text>
            </VStack>
          )
        }
        <Button onClick={props.onClick}>Continue</Button>
      </VStack>
    </Box>
  )
}
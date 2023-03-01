import * as React from 'react'
import { useRouter } from 'next/router'
import { Container, Box, Text, Button, VStack, HStack, Tooltip, Tag, Flex, useToast, Wrap, Spacer, WrapItem, IconButton } from '@chakra-ui/react'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon, RepeatIcon } from '@chakra-ui/icons'
import { useStateWithLocalStorage } from '../lib/hooks'
import { SessionContext, SetSessionContext } from '../lib/contexts'
import { AiOutlineArrowsAlt, AiOutlineShrink } from 'react-icons/ai'
import { CgArrowsExchangeAlt } from 'react-icons/cg'
import {Chapter, Word} from '@/lib/types'

export default function WordTable() {
  const toast = useToast();
  const session = React.useContext(SessionContext);
  const router = useRouter();

  const [page, setPage] = useStateWithLocalStorage<number>('page', 0);
  const [nbDisplay, setNbDisplay] = useStateWithLocalStorage<number>('nbDisplay', 25);
  const [displayWords, setDisplayWords] = useStateWithLocalStorage<Word[]>('displayWords', []);
  const [isHidden, setIsHidden] = useStateWithLocalStorage<boolean>('isHidden', true);
  const [viewSize, setViewSize] = useStateWithLocalStorage<string>('viewSize', 'md');
  const [mirrorView, setMirrorView] = useStateWithLocalStorage<boolean>('mirrorView', false);

  const allWords = session.selectedChapter.map((ch) => ch.words).flat();
  const nbPages = Math.ceil(allWords.length / nbDisplay);


  React.useEffect(() => {
    if (allWords.length == 0) {
      toast({
        title: "No words loaded",
        description: "Please select at least one chapter",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
      router.push('/')
    }

    setDisplayWords(allWords.slice(page * nbDisplay, (page + 1) * nbDisplay))
  }, [page, nbDisplay])


  const randomizePage = () => {
    allWords.sort(() => Math.random() - 0.5)

    setDisplayWords(allWords.slice(page * nbDisplay, (page + 1) * nbDisplay))
  }


  const increaseViewSize = () => {
    switch (viewSize) {
      case 'xs': setViewSize('sm'); break;
      case 'sm': setViewSize('md'); break;
      case 'md': setViewSize('lg'); break;
      case 'lg': setViewSize('lg'); break;
    }
    console.log(viewSize)
  }

  const decreaseViewSize = () => {

    switch (viewSize) {
      case 'xs': setViewSize('xs'); break;
      case 'sm': setViewSize('xs'); break;
      case 'md': setViewSize('sm'); break;
      case 'lg': setViewSize('md'); break;
      case 'xl': setViewSize('lg'); break;
      case '2xl': setViewSize('xl'); break;
      default: setViewSize('md'); break;
    }
    console.log(viewSize)
  }


  return (
    <Box
      bg={'primary.primary'}
      color={'text.onPrimary'}
    >
      <Accordion allowToggle>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex='1' textAlign='left'>
                Dispaly parameters
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Box p={4}>
              <Wrap>
                {session.selectedChapter.map((ch: Chapter, index: number) => {
                  return (
                    <WrapItem key={index}>
                      <Tag bg={'secondary.secondary'}>{ch.name}</Tag>
                    </WrapItem>
                  )
                })
                }
              </Wrap>
            </Box>

            <Box p={4}>
              <HStack spacing={8}>
                <Text>Display size</Text>
                <Button bg={'secondary.secondary'} onClick={() => setNbDisplay(10)}>10</Button>
                <Button bg={'secondary.secondary'} onClick={() => setNbDisplay(25)}>25</Button>
                <Button bg={'secondary.secondary'} onClick={() => setNbDisplay(50)}>50</Button>
                <Button bg={'secondary.secondary'} onClick={() => setNbDisplay(100)}>100</Button>
              </HStack>
            </Box>

            <Box p={4}>
              <HStack spacing={8}>
                <Text>View size</Text>
                <Button bg={'secondary.secondary'} onClick={decreaseViewSize}><AiOutlineShrink /></Button>
                <Button bg={'secondary.secondary'} onClick={increaseViewSize}><AiOutlineArrowsAlt /></Button>
                <Button bg={'secondary.secondary'} onClick={() => setMirrorView(!mirrorView)}><CgArrowsExchangeAlt /></Button>
                <Button bg={'secondary.secondary'} onClick={randomizePage}><RepeatIcon /></Button>
              </HStack>
            </Box>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <Box p={8}>
        <Table size={viewSize}>
          <Thead>
            <Tr>
              <Th color={'text.onPrimary'} >A</Th>
              <Th color={'text.onPrimary'} >B</Th>
              <Th>
                {isHidden
                  ? <IconButton bg={'secondary.secondary'} color={'text.onSecondary'} aria-label="Show" icon={<ViewIcon />} onClick={() => setIsHidden(false)} />
                  : <IconButton bg={'secondary.secondary'} color={'text.onSecondary'} aria-label="Hide" icon={<ViewOffIcon />} onClick={() => setIsHidden(true)} />
                }
              </Th>
            </Tr>
          </Thead>

          <Tbody>
            {displayWords.map((w, index) => <TableRow key={index} word={w} hide={isHidden} mirrorView={mirrorView} />)}
          </Tbody>
        </Table>
      </Box>

      <Box p={8}>
        <HStack spacing={8}>
          <Text>{page + 1} / {nbPages}</Text>
          {page > 0 && <Button onClick={() => setPage(page - 1)}>Previous</Button>}
          {page < nbPages - 1 && <Button onClick={() => setPage(page + 1)}>Next</Button>}
        </HStack>

      </Box>
    </Box>
  )
}


interface TableRowProps {
  word: Word,
  hide: boolean
  mirrorView: boolean
}

const TableRow: React.FC<TableRowProps> = ({ word, hide, mirrorView }) => {
  const [isHidden, setIsHidden] = React.useState<boolean>(true)
  // const isHidden = true

  return (
    <Tr>
      {mirrorView ? <Td>{word.a}</Td> : <Td>{word.b}</Td>}
      {mirrorView
        ? (<Td>
          {(hide && isHidden) || (!hide && !isHidden)
            ? <Text>{'----------'}</Text>
            : <Text>{word.b}</Text>
          }
        </Td>
        )
        : (<Td>
          {(hide && isHidden) || (!hide && !isHidden)
            ? <Text>{'----------'}</Text>
            : <Text>{word.a}</Text>
          }
        </Td>
        )
      }
      <Td>
        {isHidden
          ? <IconButton bg={'secondary.secondary'} color={'text.onSecondary'} aria-label="Show" icon={<ViewIcon />} onClick={() => setIsHidden(false)} />
          : <IconButton bg={'secondary.secondary'} color={'text.onSecondary'} aria-label="Hide" icon={<ViewOffIcon />} onClick={() => setIsHidden(true)} />
        }
      </Td>
    </Tr>
  )
}
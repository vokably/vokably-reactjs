import {
  useColorModeValue,
  useColorMode,
  useDisclosure,
  Box,
  IconButton,
  Spacer,
  Flex,
  Link,
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon, AtSignIcon } from '@chakra-ui/icons'
import React, { Component, FC, useContext } from 'react'
import { FlagButton,} from '@/components/flags'
import { getAllChapter, bsL, bsD} from '@/lib/utils'
import { SessionContext, SetSessionContext, defaultSessionValue } from '@/lib/contexts'
import { useRouter } from 'next/router'

const Header: FC = () => {
  const session = React.useContext(SessionContext)
  const router = useRouter()
  const bg = useColorModeValue('#EFEFEF', 'gray.800')
  const boxShadow = useColorModeValue(bsL, bsD)
  const colorScheme = useColorModeValue('primary', 'secondary')

  const onChangeLanguage = () => {
    if (session.language === "en") {
      router.push(`/?lang=uk`, undefined, { shallow: true })
    } else {
      router.push(`/?lang=en`, undefined, { shallow: true })
    }
  }

  return (
    <Flex
      w='full'
      px={8}
      py={4}
      borderBottom={'2px'}
      my={'auto'}
    >
      <Box>
        <FlagButton callback={onChangeLanguage} />
      </Box>
      <Spacer />
      {/* <Text> 123 words learnt</Text>
          <Spacer />
          <IconButton bg={'primary'} borderRadius='full' aria-label="Table" icon={<MdPersonOutline size={24} />} size="sm" onClick={() => { }} /> */}

      {/* Create a button that change the color theme from light to dark */}
      <IconButton
        aria-label='Toggletheme'
        icon={useColorModeValue(<ViewIcon />, <ViewOffIcon />)}
        onClick={useColorMode().toggleColorMode}
        boxShadow={boxShadow}
        colorScheme={colorScheme}
      />
      <Spacer />

      <Link href="/">
        <IconButton
          aria-label='Start session'
          icon={<AtSignIcon />}
          boxShadow={boxShadow}
          colorScheme={colorScheme}
        />
      </Link>
    </Flex>
  )
}

export default Header
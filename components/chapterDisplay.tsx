import * as React from 'react'
import { Container, Box, Text, Button, VStack, HStack, Tooltip, Tag, Flex, useToast, Wrap, Spacer } from '@chakra-ui/react'
import Head from 'next/head'


interface ChapterDisplayProps {
  ch: string
  onClick: () => void
}

export const ChapterDisplay: React.FC<ChapterDisplayProps> = ({ ch, onClick }) => {
  const [isLocalActive, setIsLocalActive] = React.useState<boolean>(false)

  const _onClick = () => {
    // if the chapter is already active, remove it from the list
    if (isLocalActive) {
      setIsLocalActive(false)
    } else {
      setIsLocalActive(true)
    }
  }

  return (
    <Tag
      size="lg"
      colorScheme={(isLocalActive) ? 'green' : 'red'}
      mr={2}
      _hover={{ cursor: 'pointer' }}
      onClick={() => {
        _onClick()
        onClick()
      }}
    >
      {ch}
    </Tag>
  )
}
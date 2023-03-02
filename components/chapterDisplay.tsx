import * as React from 'react'
import {Tag, useColorModeValue} from '@chakra-ui/react'
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
      m={2}
      size="lg"
      borderRadius={0}
      borderWidth={1}
      borderColor={'black'}
      colorScheme={(isLocalActive) ? 'success' : 'error'}
      boxShadow={'3px 3px 0px 0px rgba(0,0,0,1);'}
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
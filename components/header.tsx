import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Box,
  IconButton,
  Spacer,
  Flex,
} from '@chakra-ui/react'
import {
  HamburgerIcon
} from '@chakra-ui/icons'

import React, { Component, FC, useContext } from 'react'

interface HeaderProps {
  children: any
}

const Header: FC<HeaderProps> = ({children}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box>
      <Flex w='full'>
        <Spacer />
        <IconButton aria-label='menu' icon={<HamburgerIcon />} onClick={onOpen} />
      </Flex>

    <Drawer placement="top" size="xs" isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Drawer Title</DrawerHeader>

          <DrawerBody>{children}</DrawerBody>

        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
    </Box>
  )
}

export default Header
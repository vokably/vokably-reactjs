import { ChakraProvider, extendTheme, defineStyleConfig, theme as base } from '@chakra-ui/react'


const ColorPrimary = 
{
  100: '#ffe8e4',
  200: '#f9c1bc',
  300: '#ee9a91',
  400: '#e67266',
  500: '#dd4b3b',
  600: '#c43222',
  700: '#992619',
  800: '#6e1a12',
  900: '#440e07'
}


const Button = defineStyleConfig({
  // The styles all button have in common
  baseStyle: {
    borderRadius: 0,
    borderWidth: 1,
    // backgroundColor: 'primary.400',
    borderColor: 'black',
    boxShadow: '3px 3px 0px 0px rgba(0,0,0,1);',
    _hover: {
      backgroundColor: 'primary.500',
    },
  },
})


export const theme = extendTheme({
  fonts: {
    heading: `Roboto, ${base.fonts?.heading}`,
    body: `Inter, ${base.fonts?.heading}`,
  },

  components: {
    Button,
  },

  colors: {
    primary: ColorPrimary,
    secondary: 
    {
      50: '#fff6de',
      100: '#f7e3b7',
      200: '#efd08e',
      300: '#e7bd64',
      400: '#e0ab38',
      500: '#c7911f',
      600: '#9a7116',
      700: '#6f510d',
      800: '#433003',
      900: '#1a0f00',
    },
    error: {
      50: '#ffe8e4',
      100: '#f9c1bc',
      200: '#ee9b91',
      300: '#e67366',
      400: '#dd4d3b',
      500: '#c43322',
      600: '#992719',
      700: '#6e1a12',
      800: '#440e07',
      900: '#1e0200',
    },
    success:
    {
      50: '#e4faf3',
      100: '#c6e7de',
      200: '#a7d5c8',
      300: '#87c5b1',
      400: '#66b49b',
      500: '#4d9b82',
      600: '#3a7865',
      700: '#285648',
      800: '#14352a',
      900: '#00140c',
    }
  }
})
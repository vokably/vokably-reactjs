import React from 'react';
import FirebaseAuth from '@/components/firebase/auth/FirebaseAuth'
import { Box, Heading, Text, useColorModeValue, VStack} from '@chakra-ui/react';
import {bsL, bsD} from '@/lib/utils'

const signIn = () => {

  const bg = useColorModeValue('#EFEFEF', 'gray.800')
  const boxShadow = useColorModeValue(bsL, bsD)
  const colorScheme = useColorModeValue('primary', 'secondary')

  return (
    <Box
      p={8}
      m={4}
      bg={bg}
      boxShadow={boxShadow}
    >
      <VStack spacing={8}>
        <Heading>Sign in !</Heading>
        <Text w='full'>
          By signing in, you will be able to save your progress and access your
          personal dashboard from any device.
        </Text>
        <FirebaseAuth />
      </VStack>
    </Box>
  );
};

export default signIn;
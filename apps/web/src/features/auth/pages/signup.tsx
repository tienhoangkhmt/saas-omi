'use client'

import {
  Avatar,
  Box,
  Center,
  Container,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react'
import { SignupView, useAuth } from '@saas-ui/auth'
import { LoadingOverlay, LoadingSpinner } from '@saas-ui/react'

import { authProviders, authType } from '@app/config'
import { Link } from '@app/nextjs'

import { Logo } from '@ui/lib'

export const SignupPage = () => {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return (
      <LoadingOverlay variant="fullscreen">
        <LoadingSpinner />
      </LoadingOverlay>
    )
  }

  return (
    <Stack flex="1" direction="row" height="$100vh">
      <Stack
        flex="1"
        alignItems="center"
        justify="center"
        direction="column"
        spacing="8"
      >
        <Container>
          <Logo margin="0 auto" mb="12" />
          <SignupView
            title="Sign up"
            type={authType}
            providers={authProviders}
          />
        </Container>

        <Text color="muted">
          Already have an account?{' '}
          <Link href="/login" color="chakra-body-text">
            Log in
          </Link>
          .
        </Text>
      </Stack>
      <Stack flex="1" bg="primary.500">
        <Center flex="1">
          <Container>
            <HStack mb="4" spacing="4">
              <Avatar
                bg="white"
                src="data:image/png;base64,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"
              />
              <Box>
                <Text color="white" fontSize="md" fontWeight="medium">
                  Ahmed
                </Text>
                <Text color="whiteAlpha.700" fontSize="md">
                  Founder of{' '}
                  <Link href="https://localxpose.io">LocalXpose</Link>
                </Text>
              </Box>
            </HStack>
            <Text color="white" fontSize="lg">
              I really recommend Saas UI to any developer or team seeking a
              robust, visually appealing, and easy-to-implement UI framework.
              The support and updates from the Saas UI team were exceptional,
              Thank you.
            </Text>
          </Container>
        </Center>
      </Stack>
    </Stack>
  )
}

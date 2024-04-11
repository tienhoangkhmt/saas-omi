import { Box, Text } from '@chakra-ui/react'

import CustomAvatar from '../Avatar'
import { getBgMess } from './utils'

interface MessItems {
  userId?: number | string 
  currentId: number | string
  note: boolean
  isRight?: boolean
}

const MessItems: React.FC<MessItems> = (props) => {
  const objStyle = {
    gridTemplateColumns: props?.isRight ? '90% 10%' : '10% 90%',
    marginLeft: props?.isRight ? 'auto' : '0',
  }

  return (
    <Box {...objStyle} maxW="70%" textAlign={`${props?.isRight ? 'right' : 'left'}`} display="grid">
      {!props?.isRight ? (
        <>
          <Box>
            <CustomAvatar isBadge={false} />
          </Box>
          <Box marginLeft={3} w="auto">
            <Box
              display="inline-block"
              padding={3}
              marginBottom={3}
              borderRadius={19}
              wordBreak="break-word"
              bg={getBgMess({ userId: props.userId, currentUserId: props.currentId })}
            >
              <Text>
                mDSFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFeesss11111111111111
              </Text>
            </Box>
            <Box
              display="inline-block"
              padding={3}
              marginBottom={3}
              borderRadius={19}
              wordBreak="break-word"
              bg={getBgMess({ userId: 1, currentUserId: 1 })}
            >
              <Text>meessSDFFFFFFFs</Text>
            </Box>
          </Box>
        </>
      ) : (
        <>
          <Box marginLeft={3} w="auto">
            <Box
              display="inline-block"
              padding={3}
              marginBottom={3}
              borderRadius={19}
              wordBreak="break-word"
              bg={getBgMess({ userId: 1, currentUserId: 1 })}
            >
              <Text>
                mDSFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFeesss11111111111111
              </Text>
            </Box>
            <Box
              display="inline-block"
              padding={3}
              marginBottom={3}
              borderRadius={19}
              wordBreak="break-word"
              bg={getBgMess({ userId: 1, currentUserId: 1 })}
            >
              <Text>meessSDFFFFFFFs</Text>
            </Box>
          </Box>
          <Box>
            <CustomAvatar isBadge={false} />
          </Box>
        </>
      )}
    </Box>
  )
}

export default MessItems

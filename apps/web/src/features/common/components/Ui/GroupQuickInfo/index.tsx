import { Box, BoxProps, Text } from '@chakra-ui/react'

import CustomAvatar from '../Avatar'

type TGroupQuickInfo = {
  isText?: boolean,
  userName: string,
  chatEnd?: string,
  style?: BoxProps
}

const GroupQuickInfo: React.FC<TGroupQuickInfo> = ({ isText = false, chatEnd = '', userName = '', style = {} }) => {
  return (
    <Box
      justifyContent={`${isText ? 'space-between' : 'normal'}`}
      alignItems="center"
      display="flex"
      marginBottom={4}
      w="300px"
      {...style}
    >
      <Box>
        <CustomAvatar propsIcons={{ color: 'green' }} />
      </Box>
      <Box>
        <Box marginLeft={`${!isText ? 3 : 0}`} display="flex" justifyContent="space-between">
          <Text>{userName}</Text>
          {isText && <Text>1 hour</Text>}
        </Box>
        {isText && <Text>{ chatEnd || 'Ronaldo: Lorem ipsum dolor sit am...' }</Text>}
      </Box>
    </Box>
  )
}

export default GroupQuickInfo

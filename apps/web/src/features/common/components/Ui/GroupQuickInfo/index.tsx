import { Box, Text } from '@chakra-ui/react'

import CustomAvatar from '../Avatar'

type TGroupQuickInfo = {
  isText?: boolean
}

const GroupQuickInfo: React.FC<TGroupQuickInfo> = ({ isText = false }) => {
  return (
    <Box
      justifyContent={`${isText ? 'space-between' : 'normal'}`}
      alignItems="center"
      display="flex"
      marginBottom={4}
      w="300px"
    >
      <Box>
        <CustomAvatar propsIcons={{ color: 'green' }} />
      </Box>
      <Box>
        <Box marginLeft={`${!isText ? 3 : 0}`} display="flex" justifyContent="space-between">
          <Text>Andreas Ramos</Text>
          {isText && <Text>1 hour</Text>}
        </Box>
        {isText && <Text>Ronaldo: Lorem ipsum dolor sit am...</Text>}
      </Box>
    </Box>
  )
}

export default GroupQuickInfo

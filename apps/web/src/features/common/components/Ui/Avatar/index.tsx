import {
  Avatar,
  AvatarBadge,
  AvatarBadgeProps,
  AvatarProps,
} from '@chakra-ui/react'
import { IconBaseProps } from 'react-icons'

import CustomIcons from '../Icons'

interface ICustomAvatarProps extends AvatarProps {
  propsIcons?: IconBaseProps
  propsBadge?: AvatarBadgeProps
  isBadge?: boolean
}

const CustomAvatar: React.FC<ICustomAvatarProps> = (props) => {

  const { isBadge = true } = props;

  return (
    <Avatar {...props}>
      {isBadge && (
        <AvatarBadge {...props.propsBadge} boxSize="32px">
          <CustomIcons {...props.propsIcons} />
        </AvatarBadge>
      )}
    </Avatar>
  )
}

export default CustomAvatar

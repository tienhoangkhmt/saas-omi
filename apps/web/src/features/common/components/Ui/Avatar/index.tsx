import { Avatar, AvatarBadge, AvatarBadgeProps, AvatarProps } from '@chakra-ui/react'
import CustomIcons from '../Icons';
import { IconBaseProps } from 'react-icons';

interface ICustomAvatarProps extends AvatarProps {
  propsIcons?: IconBaseProps,
  propsBadge?: AvatarBadgeProps
}

const CustomAvatar: React.FC<ICustomAvatarProps> = (props) => {
  
  return (
    <Avatar {...props}>
       <AvatarBadge {...props.propsBadge} boxSize='1.25em'>
          <CustomIcons {...props.propsIcons} />
       </AvatarBadge>
    </Avatar>
  )
}

export default CustomAvatar;

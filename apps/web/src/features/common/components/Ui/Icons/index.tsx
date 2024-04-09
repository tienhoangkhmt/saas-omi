import { IconBaseProps } from "react-icons";
import { FiHome, FiSettings, FiUsers } from "react-icons/fi";

export interface IPropsCustomIcons extends IconBaseProps {
  name?: string
}

const CustomIcons = (props: IPropsCustomIcons) => {
  const { name } = props;

  switch (name) {
    case 'users': 
      return <FiUsers  {...props} />
    case 'setting': 
      return <FiSettings  {...props} />
    default: {
      return <FiHome  {...props} />
    }
  }
}

export default CustomIcons;
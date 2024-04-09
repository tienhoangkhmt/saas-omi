import { NavItem, NavItemProps } from "@saas-ui/react";
import CustomIcons from "../Icons";

export interface IPropsCustomNavItem extends NavItemProps {
  nameIcon?: string
}

export const CustomNavItem: React.FC<IPropsCustomNavItem> = (props) => {
  const { cursor = "pointer", nameIcon } = props;

  return <NavItem {...props} cursor={cursor} icon={<CustomIcons name={nameIcon} color="white" />} />
}

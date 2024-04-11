import { Box } from "@chakra-ui/react";
import GroupQuickInfo from "../GroupQuickInfo";
import CustomIcons from "../Icons";

type socialItem = {
  icon: string
}

type THeaderChat = {
  listSocial: socialItem[]
}

const HeaderChat:React.FC<THeaderChat> = ({ listSocial = [] }) => {

  return (
    <Box>
      <Box>
        <GroupQuickInfo userName="Hoang" />
      </Box>
      <Box>
          {
            listSocial.map((item) => (
              <CustomIcons name={item.icon} />
            ))
          }
      </Box>
    </Box>
  )
}

export default HeaderChat;

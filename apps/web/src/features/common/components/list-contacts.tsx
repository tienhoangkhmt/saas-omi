import { List } from "@chakra-ui/react"
import GroupQuickInfo from "./Ui/GroupQuickInfo";

const ListContacts = () => {

  return (
    <List>
      <GroupQuickInfo userName="hoang" isText />
      <GroupQuickInfo userName="hoang" isText />
      <GroupQuickInfo userName="hoang" isText />
      <GroupQuickInfo userName="hoang" isText />
      <GroupQuickInfo userName="hoang" isText />
      <GroupQuickInfo userName="hoang" isText />
      <GroupQuickInfo userName="hoang" isText />
    </List>
  )
}

export default ListContacts;

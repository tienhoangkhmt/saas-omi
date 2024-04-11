import { Badge, Card, CardBody, Text } from '@chakra-ui/react'
import {
  IconBadge,
  PersonaAvatar,
  Timeline,
  TimelineContent,
  TimelineIcon,
  TimelineItem,
  TimelineProps,
  TimelineSeparator,
  TimelineTrack,
} from '@saas-ui/react'

interface ICustomTimeLine extends TimelineProps {}

const CustomTimeLine: React.FC<ICustomTimeLine> = (props) => {
  return (
    <Timeline>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineIcon>
            <PersonaAvatar
              src="/showcase-avatar.jpg"
              colorScheme="purple.300"
              name="Renata Alink"
              size="xs"
              bg="purple.200"
              presence="online"
            />
          </TimelineIcon>
          <TimelineTrack />
        </TimelineSeparator>
        <TimelineContent>
          <Text color="muted">
          Session #1232 resolve by Agent Leesin11
          </Text>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineTrack />
          <TimelineIcon>
            <Badge
              rounded="full"
              borderWidth="2px"
              borderColor="yellow.300"
              bg="none"
              boxSize="13px"
            />
          </TimelineIcon>
          <TimelineTrack />
        </TimelineSeparator>
        <TimelineContent>
          <Text color="muted">Session #1232 end by Agent Leesin</Text>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem >
        <TimelineSeparator>
          <TimelineTrack flex="0" />
          <TimelineIcon>
            <PersonaAvatar
              src="/showcase-avatar.jpg"
              name="Renata Aa"
              size="xs"
              bg="purple.200"
              presence="online"
            />
          </TimelineIcon>
          <TimelineTrack />
        </TimelineSeparator>
        <TimelineContent>
          <Card>
            <CardBody>
            Session #1233 start
            </CardBody>
          </Card>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineTrack />
          <TimelineIcon>
            <Badge
              rounded="full"
              borderWidth="2px"
              borderColor="green.300"
              bg="none"
              boxSize="13px"
            />
          </TimelineIcon>
        </TimelineSeparator>
        <TimelineContent>
          <Text color="muted">
            Session #1233 - Agent Teemo ADC make first response
          </Text>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}

export default CustomTimeLine

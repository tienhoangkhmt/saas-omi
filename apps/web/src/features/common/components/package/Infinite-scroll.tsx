/* eslint-disable @typescript-eslint/no-empty-interface */
import { useState } from 'react'

import { Box, BoxProps } from '@chakra-ui/react'
import styled from '@emotion/styled'
import InfiniteScroll, { Props } from 'react-infinite-scroll-component'

interface ICustomInfiniteScrollProps {
  infiniteProps: Props
  endpoint: string
  id: string
  Component: React.ComponentType<any>,
  propBox: BoxProps,
  loader?: React.ReactNode
}

const WrapperInfiniteScroll = styled(Box)`
  &::-webkit-scrollbar {
    width: 15px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    width: 10px;
    border: 3px solid transparent;
    background-clip: content-box;
    background-color: #a8a7a7;
  }
`

const CustomInfiniteScroll: React.FC<ICustomInfiniteScrollProps> = (props) => {
  const { Component, infiniteProps, propBox, loader } = props;
  const {inverse = true } = infiniteProps;

  const [dataSource, setDataSource] = useState([]);
  
  const handleFetchData = () => {
    setDataSource([])
  }

  return (
    <WrapperInfiniteScroll {...propBox} id={props.id}>
      <InfiniteScroll
        {...infiniteProps}
        dataLength={dataSource?.length}
        next={handleFetchData}
        inverse={inverse}
        hasMore={true}
        loader={loader ? loader : <h4>Loading...</h4> }
        scrollableTarget={props.id}
      >
        <Component data={dataSource} />
      </InfiniteScroll>
    </WrapperInfiniteScroll>
  )
}

export default CustomInfiniteScroll

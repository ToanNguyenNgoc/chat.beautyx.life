//643e1858a206c3987b0e35d4

import { useInfiniteQuery } from "@tanstack/react-query"
import moment from "moment"
import InfiniteScroll from "react-infinite-scroll-component"
import apis from "src/apis"

export function Test() {
  const { data, isLoading, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['643e1858a206c3987b0e35d4'],
    queryFn: ({ pageParam = 1 }) => apis.getMessages({
      p: pageParam,
      topic_id: '643e1858a206c3987b0e35d4',
      l: 15,
      sort: '-created_at'
    }),
    getNextPageParam: (page: any) => page?.context?.current_page + 1
  })
  const messagesT = data?.pages.map(i => i.context.data).flat() ?? []
  return (
    <div
      style={{height:'100dvh'}}
    >
      <div
        id="scrollableDiv"
        style={{
          height: '100vh',
          overflow: 'auto',
          padding: '0px 12px',
          display: 'flex',
          flexDirection: 'column-reverse',
          backgroundColor: 'var(--green)'
        }}
      >
        <InfiniteScroll
          dataLength={messagesT.length}
          next={fetchNextPage}
          style={{ display: 'flex', flexDirection: 'column-reverse'}}
          inverse={true}
          hasMore={true}
          loader={<h4>Loading...</h4>}
          scrollableTarget="scrollableDiv"
        >
          {messagesT.map((item, index) => (
            <div style={{
              backgroundColor: 'var(--light)',
              margin: '10px 0px',
              height: '120px'
            }} key={index}>
              div - #{item.msg}
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  )
}
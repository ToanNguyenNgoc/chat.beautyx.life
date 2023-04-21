import Echo from 'laravel-echo';
import { useInfiniteQuery } from '@tanstack/react-query';
import apis from 'src/apis';
import { Link } from 'react-router-dom';
import { dateFromNow } from 'src/utils';
import InfiniteScroll from 'react-infinite-scroll-component';
import { LoadMessage } from 'src/components';

interface ChatLeftProps {
  echo: Echo | null
}

export function PageChatLeft(props: ChatLeftProps) {
  const { echo } = props
  const { data, isLoading, fetchNextPage } = useInfiniteQuery({
    queryKey: ['TOPICS'],
    queryFn: ({ pageParam = 1 }) => apis.getTopics({
      p: pageParam,
      l: 14,
      sort: '-updated_at'
    }),
    getNextPageParam: (page: any) => {
      if (page.context?.current_page <= page.context?.last_page) {
        return page?.context?.current_page + 1
      }
      return null
    }
  })
  const topics = data?.pages?.map(i => i.context.data).flat() ?? []
  return (
    <div className='page-left'>
      <div className='page-left-head'>
        <div className='head-title'>
          <h3>Chats</h3>
          <div className='head-title-icon'>
            <button type="button" className="btn btn-light"><i className="fa fa-bell-o" aria-hidden="true"></i></button>
            <button type="button" className="btn btn-light" disabled><i className="fa fa-video-camera" aria-hidden="true"></i></button>
            <button type="button" className="btn btn-light"><i className="fa fa-pencil-square-o" aria-hidden="true"></i></button>
          </div>
        </div>
        <div className='head-search'>
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Search" />
          </div>
        </div>
      </div>
      <div className='page-left-classify'>
        <div className='active'>Inbox</div>
        <div>Communities</div>
      </div>
      <div className='page-left-list'>
        {isLoading && <LoadMessage/>}
        <InfiniteScroll
          dataLength={topics.length}
          hasMore={true}
          loader={<></>}
          next={fetchNextPage}
        >
          <ul className="list-user">
            {
              topics.map(topic => (
                <li key={topic._id} className='detail-user'>
                  <Link
                    className='detail-user_item'
                    to={{ pathname: `/chats/${topic._id}` }}
                  >
                    <div className="detail-user_item-cnt">
                      <div className="detail-user_item-cnt-avt">
                        <img
                          src="https://devapi.myspa.vn/media/10084/277763215_543969187157980_5261600049025341561_n.jpeg?v=1678373000"
                          alt=""
                        />
                        <span></span>
                      </div>
                      <div className="detail-user_item-cnt-right">
                        <div className="topic-left">
                          <span className="topic-left-name">
                            Gấu chó Gấu chó Gấu chó Gấu chó Gấu chó Gấu chó
                          </span>
                          <div className="topic-left-msg">
                            <span className="topic-left-msg-txt">
                              {topic.messages[0]?.msg}
                            </span>
                            <span className="topic-left-msg-time">
                              {dateFromNow(topic.updated_at)}
                            </span>
                          </div>
                        </div>
                        <div className="topic-right">
                          <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            }
          </ul>
        </InfiniteScroll>
      </div>
    </div>
  );
}
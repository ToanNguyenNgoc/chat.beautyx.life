import Echo from 'laravel-echo';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useContext } from 'react';
import { AppContext, AppContextType } from 'src/context/AppProvider';
import apis from 'src/apis';
import { LoadMessage } from 'src/components';
import { dateFromNow, onErrorImg } from 'src/utils';
import icon from 'src/assets/icon';

interface ChatLeftProps {
  echo: Echo | null,
  isDesktopOrLaptop: boolean
}

export function PageChatLeft(props: ChatLeftProps) {
  const { subdomain } = useContext(AppContext) as AppContextType
  const navigate = useNavigate()
  const params = useParams()
  const { data, isLoading, fetchNextPage } = useInfiniteQuery({
    queryKey: ['TOPICS'],
    queryFn: ({ pageParam = 1 }) => apis.getTopics({
      p: pageParam,
      l: 14,
      sort: '-updated_at',
      org: subdomain ?? ''
    }),
    onSuccess: (data) => {
      // const firstTopic = data.pages[0]?.context?.data[0]
      // if (data.pages.length === 1 && firstTopic && isDesktopOrLaptop) {
      //   navigate(
      //     `/chats/${firstTopic._id}`,
      //     { state: firstTopic }
      //   )
      // }
    },
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
        {isLoading && <LoadMessage />}
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
                  <div
                    style={params.id === topic._id ? { backgroundColor: '#f5f5f5' } : {}}
                    className='detail-user_item'
                    onClick={() => navigate(
                      `/chats/${topic._id}`,
                      { state: topic }
                    )}
                  >
                    <div className="detail-user_item-cnt">
                      <div className="detail-user_item-cnt-avt">
                        {
                          topic.topic_user?.length > 1 ?
                          <img src={icon.userGroup} alt="" />
                            :
                            <img
                              src={topic.topic_user[0]?.topic_user?.avatar ?? ''}
                              alt=""
                              onError={onErrorImg}
                            />
                        }
                        <span></span>
                      </div>
                      <div className="detail-user_item-cnt-right">
                        <div className="topic-left">
                          <span className="topic-left-name">
                            {topic.name || topic.topic_user?.map(i => i.topic_user?.fullname)?.join(',')}
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
                  </div>
                </li>
              ))
            }
          </ul>
        </InfiniteScroll>
      </div>
    </div>
  );
}
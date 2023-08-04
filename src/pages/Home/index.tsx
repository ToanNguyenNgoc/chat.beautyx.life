/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, Button, TextField, useMediaQuery } from '@mui/material'
import { useInfiniteQuery } from '@tanstack/react-query'
import { FC, useContext, useEffect, useRef } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import apis from 'src/apis'
import 'src/assets/main.css'
import { XCircularProgress, XStyledBadge } from 'src/components'
import { AppContext, AppContextType } from 'src/context/AppProvider'
import { useElementScreen } from 'src/hooks'
import { ITopic } from 'src/interfaces'
import { dateFromNow, unique } from 'src/utils'

export function Main() {
  const params = useParams()
  const mb = useMediaQuery('(max-width:767px)')
  let display = ['TOPIC', 'MESSAGE']
  if (mb) display = ['TOPIC']
  if (mb && params.id) display = ['MESSAGE']
  return (
    <div className="main">
      {
        display.includes('TOPIC') &&
        <>
          <div className="shortcuts-cnt">
            <div className="shortcut-list">
              <Button style={{ backgroundColor: 'var(--light)' }} variant='contained' color='success' >
                <i className="fa fa-home fa-lg" aria-hidden="true"></i>
              </Button>
              <Button style={{ backgroundColor: 'var(--light)' }} variant='contained' color='success' >
                <i className="fa fa-users fa-lg" aria-hidden="true"></i>
              </Button>
              <Button style={{ backgroundColor: 'var(--light)' }} variant='contained' color='success' >
                <i className="fa fa-calendar fa-lg" aria-hidden="true"></i>
              </Button>
              <Button style={{ backgroundColor: 'var(--light)' }} variant='contained' color='success' >
                <i className="fa fa-shopping-bag fa-lg" aria-hidden="true"></i>
              </Button>
            </div>
          </div>
          <TopicList />
        </>
      }
      {
        display.includes('MESSAGE') &&
        <div className="topic-chat-cnt">
          <Outlet />
        </div>
      }
    </div>
  )
}
const TopicList: FC = () => {
  const params = useParams()
  const navigate = useNavigate()
  const { subdomain } = useContext(AppContext) as AppContextType
  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: ['TOPICS'],
    queryFn: ({ pageParam = 1 }) => apis.getTopics({
      p: pageParam,
      l: 15,
      sort: '-updated_at',
      org: subdomain ?? ''
    }),
    onSuccess: (data) => { },
    getNextPageParam: (page: any) => page?.context?.current_page + 1
  })
  const topics: ITopic[] = data?.pages?.map(i => i.context.data).flat() ?? []
  const total = data?.pages[0]?.context?.total || 1
  return (
    <div className="chat-topic">
      <div className="chat-topic_head">
        <div className="chat-topic_head-ctn">
          <span>Chats</span>
          <div className="chat-topic_head-ctn-btn">
            <Button style={{ backgroundColor: '#dfdfdf' }} variant='contained' color='success' >
              <i className="fa fa-bell-o" aria-hidden="true"></i>
            </Button>
            <Button style={{ backgroundColor: '#dfdfdf' }} variant='contained' color='success' >
              <i className="fa fa-video-camera" aria-hidden="true"></i>
            </Button>
            <Button style={{ backgroundColor: '#dfdfdf' }} variant='contained' color='success' >
              <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
            </Button>
          </div>
        </div>
        <div className="chat-topic_head-ip">
          <TextField
            color='success'
            hiddenLabel fullWidth
            id="filled-hidden-label-small"
            placeholder='Tìm kiếm trong tin nhắn...'
            variant="filled"
            size="small"
          />
        </div>
      </div>
      <div className="chat-topic_list">
        <ul className="topic-list">
          {
            topics.map(item => {
              let name = item.name
              if (item.topic_user.length > 0) {
                name = unique(item.topic_user?.map(i => i.user?.fullname).filter(Boolean)).join(',')
              }
              return (
                <li key={item._id} className='topic-item'>
                  <div onClick={() => navigate(`/chats/${item._id}`, { state: item })}
                    className={params.id === item._id ? 'topic-link topic-act' : 'topic-link'}
                  >
                    <div className="avatar">
                      <XStyledBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="standard"
                      >
                        <Avatar alt="" src="" />
                      </XStyledBadge>
                    </div>
                    <div className="topic-info">
                      <span className="topic-info_name">{name}</span>
                      <div className="topic-info_date">
                        <span className="topic-info_date-mes">{item.messages[0]?.msg}</span>
                        <span className="topic-info_date-time">{dateFromNow(item.updated_at)}</span>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })
          }
        </ul>
        {topics.length < total && <BottomTopic fetchNextPage={fetchNextPage} />}
      </div>
    </div>
  )
}
export const BottomTopic: FC<{ fetchNextPage?: () => void }> = ({ fetchNextPage }) => {
  const refBottom = useRef<HTMLDivElement>(null)
  const isVisible = useElementScreen({
    root: null,
    rootMargin: "0px",
    threshold: 0.3,
  }, refBottom)
  useEffect(() => {
    if (isVisible && fetchNextPage) fetchNextPage()
  }, [isVisible])
  return (
    <div ref={refBottom}>
      <XCircularProgress label='Đang tải đoạn chat...' />
    </div>
  )
}
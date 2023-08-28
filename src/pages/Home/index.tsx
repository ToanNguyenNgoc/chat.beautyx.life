/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, Button, TextField, Tooltip, useMediaQuery } from '@mui/material'
import { useInfiniteQuery } from '@tanstack/react-query'
import { ChangeEvent, FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import apis from 'src/apis'
import 'src/assets/main.css'
import { AvatarTopic, SendManyMessage, XCircularProgress } from 'src/components'
import { AppContext, AppContextType } from 'src/context/AppProvider'
import { useElementScreen } from 'src/hooks'
import { ITopic } from 'src/interfaces'
import { dateFromNow, onRenderTopicName } from 'src/utils'
import { Chat } from './components'

export function Main() {
  const location = useLocation()
  const { subdomain } = useContext(AppContext) as AppContextType
  const [openTopic, setOpenTopic] = useState<ITopic>()
  const mb = useMediaQuery('(max-width:767px)')
  let display = ['TOPIC', 'MESSAGE']
  if (mb) display = ['TOPIC']
  // if (mb && params.id) display = ['MESSAGE']
  if (mb && openTopic) display = ['MESSAGE']
  const onNavigateManager = (path: string) => {
    window.location.assign(`https://${subdomain}.myspa.vn/${path}`)
  }
  const init = sessionStorage.getItem('init_app') || '0'
  useEffect(() => {
    if (init === '0') {
      sessionStorage.setItem('init_app', '1')
      window.location.assign(location.pathname)
    }
  }, [])
  return (
    <div className="main">
      {
        display.includes('TOPIC') &&
        <>
          <div className="shortcuts-cnt">
            <div className="shortcut-list">
              <Tooltip placement='left-start' title='Dashboard'>
                <Button onClick={() => onNavigateManager('')} style={{ backgroundColor: 'var(--light)' }} variant='contained' color='success' >
                  <i className="fa fa-home fa-lg" aria-hidden="true"></i>
                </Button>
              </Tooltip>
              <Tooltip placement='left-start' title='Khách hàng'>
                <Button onClick={() => onNavigateManager('ManageUser/member_list')} style={{ backgroundColor: 'var(--light)' }} variant='contained' color='success' >
                  <i className="fa fa-users fa-lg" aria-hidden="true"></i>
                </Button>
              </Tooltip>
              <Tooltip placement='left-start' title='Lịch hẹn'>
                <Button onClick={() => onNavigateManager('ManageAppointment')} style={{ backgroundColor: 'var(--light)' }} variant='contained' color='success' >
                  <i className="fa fa-calendar fa-lg" aria-hidden="true"></i>
                </Button>
              </Tooltip>
              <Tooltip placement='left-start' title='Danh sách bán hàng'>
                <Button onClick={() => onNavigateManager('ManageOrder/order_list')} style={{ backgroundColor: 'var(--light)' }} variant='contained' color='success' >
                  <i className="fa fa-shopping-bag fa-lg" aria-hidden="true"></i>
                </Button>
              </Tooltip>
            </div>
            <ProfileShortcut />
          </div>
          <TopicList openTopic={openTopic} setOpenTopic={setOpenTopic} />
        </>
      }
      {
        display.includes('MESSAGE') &&
        <div className="topic-chat-cnt">
          {/* <Outlet /> */}
          {openTopic && <Chat topicItem={openTopic} goBack={() => setOpenTopic(undefined)} />}
        </div>
      }
    </div>
  )
}
const ProfileShortcut: FC = () => {
  const mb = useMediaQuery('(max-width:767px)')
  const profileRef = useRef<HTMLDivElement>(null)
  window.addEventListener('click', () => profileRef.current?.classList.remove('profile-act'))
  const { user, org, logout } = useContext(AppContext) as AppContextType
  const [openSend, setOpenSend] = useState(false)
  return (
    <div className="shortcut-profile-cnt">
      <div onClick={(e) => e.stopPropagation()} ref={profileRef} className="profile">
        <div className="profile-top">
          {
            mb &&
            <div
              className='profile-bottom_btn-menu'
              onClick={() => profileRef.current?.classList.remove('profile-act')}
            >
              <i className="fa fa-chevron-left" aria-hidden="true"></i>
            </div>
          }
          <div className="profile-head">
            <label className='profile-head_label'>Doanh nghiệp</label>
            <div className="profile-head_detail">
              <Avatar src={org?.image_url || org?.name} alt={org?.name} />
              <div className="profile-head_detail-right">
                <p>{org?.name}</p>
              </div>
            </div>
          </div>
          <div className="profile-head">
            <label className='profile-head_label'>Tài khoản</label>
            <div className="profile-head_detail">
              <Avatar src={user?.avatar || user?.fullname} alt={user?.fullname} />
              <div className="profile-head_detail-right">
                <p>{user?.fullname}</p>
                <p>{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
        <ul className="profile-bottom">
          <li onClick={() => setOpenSend(true)} className="profile-bottom_btn">
            <div className="profile-bottom_btn-icon">
              <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
            </div>
            <span className="profile-bottom_btn-txt">Gửi tin nhắn cho nhiều người</span>
          </li>
          <SendManyMessage open={openSend} onClose={() => setOpenSend(false)} />
          {/* {
            !mb &&
            <li onClick={logout} className="profile-bottom_btn">
              <div className="profile-bottom_btn-icon">
                <i className="fa fa-sign-out" aria-hidden="true"></i>
              </div>
              <span className="profile-bottom_btn-txt">Đăng xuất</span>
            </li>
          } */}
        </ul>
      </div>
      <div onClick={(e) => {
        e.stopPropagation();
        profileRef.current?.classList.toggle('profile-act')
      }}>
        {
          mb ? <div className='profile-bottom_btn-menu'><i className="fa fa-bars" aria-hidden="true"></i></div>
            :
            <Avatar src={user?.avatar || user?.fullname} alt={user?.fullname} />
        }
      </div>
    </div>
  )
}
const TopicList: FC<{ openTopic?: ITopic, setOpenTopic: React.Dispatch<React.SetStateAction<ITopic | undefined>> }> = ({ openTopic, setOpenTopic }) => {
  const params = useParams()
  const navigate = useNavigate()
  const { subdomain } = useContext(AppContext) as AppContextType
  const [search, setSearch] = useState('')
  const onChangeSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTimeout(() => setSearch(e.target.value), 800)
  }, [search])
  const { data, fetchNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['TOPICS', search],
    queryFn: ({ pageParam = 1 }) => apis.getTopics({
      p: pageParam,
      l: 15,
      s: search,
      sort: '-updated_at',
      org: subdomain ?? ''
    }),
    onSuccess: (data) => {
      if (data.pages.length > 0 && data.pages[0].context.data.length > 0) {
        setOpenTopic(data.pages[0]?.context.data[0])
      }
    },
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
            {/* <Button style={{ backgroundColor: '#dfdfdf' }} variant='contained' color='success' >
              <i className="fa fa-bell-o" aria-hidden="true"></i>
            </Button>
            <Button style={{ backgroundColor: '#dfdfdf' }} variant='contained' color='success' >
              <i className="fa fa-video-camera" aria-hidden="true"></i>
            </Button> */}
            {/* <Button style={{ backgroundColor: '#dfdfdf' }} variant='contained' color='success' >
              <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
            </Button> */}
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
            onChange={onChangeSearch}
          />
        </div>
      </div>
      <div className="chat-topic_list">
        <ul className="topic-list">
          {
            topics.map(item => (
              <li key={item._id} className='topic-item'>
                <div
                  // onClick={() => navigate(`/chats/${item._id}`, { state: item })}
                  onClick={() => setOpenTopic(item)}
                  // className={params.id === item._id ? 'topic-link topic-act' : 'topic-link'}
                  className={openTopic?._id === item._id ? 'topic-link topic-act' : 'topic-link'}
                >
                  <AvatarTopic topic={item} />
                  <div className="topic-info">
                    <span className="topic-info_name">{onRenderTopicName(item).name}</span>
                    <div className="topic-info_date">
                      <span className="topic-info_date-mes">{item.messages[0]?.msg}</span>
                      <span className="topic-info_date-time">{dateFromNow(item.updated_at)}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))
          }
        </ul>
        {(topics.length < total || isLoading) && <BottomTopic fetchNextPage={fetchNextPage} />}
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
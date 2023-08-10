/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, Button } from "@mui/material";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AvatarTopic, MessageInput, Typing, XCircularProgress } from "src/components";
import { AppContext, AppContextType } from "src/context/AppProvider";
import { IMessage, ITopic } from "src/interfaces";
import { dateFromNow, linkify, unique } from "src/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import apis from "src/apis";
import InfiniteScroll from "react-infinite-scroll-component";
import "src/assets/message.css"


export const Chat: FC = () => {
  const params = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const curTopic: ITopic | null = location?.state
  const { echo, user, subdomain } = useContext(AppContext) as AppContextType
  const [messages, setMessages] = useState<IMessage[]>([])
  const [isTyping, setIsTyping] = useState()
  const bottomRef = useRef<HTMLDivElement>(null)
  let name = curTopic?.name || ''
  if (curTopic && curTopic?.topic_user.length > 0) {
    name = unique(curTopic?.topic_user?.map(i => i.user?.fullname).filter(Boolean)).join(',')
  }
  const { data, isLoading, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['CHAT', params.id],
    queryFn: ({ pageParam = 1 }) => apis.getMessages({
      p: pageParam,
      topic_id: params.id ?? '',
      l: 15,
      sort: '-created_at',
    }),
    enabled: (params.id) ? true : false,
    getNextPageParam: (page: any) => page?.context?.current_page + 1
  })
  const messagesT = data?.pages.map(i => i.context.data).flat() ?? []
  const totalItem = data?.pages[0]?.context?.total ?? 0
  const onScrollBottom = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  useEffect(() => {
    if (echo && user.id) {
      let chat: any = echo.join(`ci.chat.${subdomain}.${params.id}`)
        .subscribed(() => {
          chat.whisper('connected', {
            user: {
              id: user.id,
              fullname: user.fullname,
              avatar: user.avatar,
              current_platform: 'MANAGER_WEB'
            }, socketId: echo?.socketId()
          })
          chat.listenForWhisper('typing', (u: any) => {
            setIsTyping(u?.user?.isTyping)
          })
        })
        .listen('MessagePosted', (u: IMessage) => {
          if (user.id !== u.user_id) {
            setMessages(prev => {
              if (prev.indexOf(u) === -1) {
                return [u, ...prev]
              }
              return prev
            })
            onScrollBottom()
          }
        })
    }
    return () => {
      setMessages([])
    }
  }, [echo, params.id, user.id])
  return (
    <div className="message">
      <div className="mess-head">
        <div className="mess-head_left">
          <Button onClick={() => navigate(-1)} style={{ backgroundColor: 'var(--bg-color)' }} variant="contained" >
            <i className="fa fa-caret-left fa-lg" aria-hidden="true"></i>
          </Button>
          <div className="name-avatar">
            {curTopic && <AvatarTopic topic={curTopic} />}
            <span className="name">{name}</span>
          </div>
        </div>
        <div className="mess-head_right"></div>
      </div>
      <div
        id="scrollableDiv"
        className="mess-body"
      >
        <InfiniteScroll
          dataLength={messagesT?.length ?? 10}
          hasMore={messagesT.length < totalItem ? true : false}
          loader={<></>}
          next={fetchNextPage}
          inverse={true}
          scrollableTarget="scrollableDiv"
          style={{ display: 'flex', flexDirection: 'column-reverse', padding: '0px 8px' }}
        >
          <div ref={bottomRef} className="bottom-ref" />
          {isTyping && <Typing />}
          {
            messages.concat(messagesT).map((item, index) => {
              const change = item.user_id === user?.id
              return (
                <div key={index} className="message-item-cnt">
                  <div className="message-item">
                    <div className={change ? "message-item-user message-item-user-ch" : "message-item-user"}>
                      <Avatar src={item.user?.avatar || item.user.fullname} alt={item.user?.fullname} />
                      <span className="message-item-user_name">{item.user.fullname}</span>
                      <span className="message-item-user_time">{dateFromNow(item.created_at)}</span>
                    </div>
                    <div className={change ? "message-body message-body-ch" : "message-body"}>
                      <div className={change ? "message-body_txt message-body_txt-ch" : "message-body_txt"}>
                        <div dangerouslySetInnerHTML={{ __html: linkify(item.msg || '') }} />
                        {item.media_urls?.length > 0 && <Images media_urls={item.media_urls} />}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          }
          {(isLoading || isFetchingNextPage) && <XCircularProgress label="Đang tải tin nhắn..." />}
        </InfiniteScroll>
      </div>
      <MessageInput input_media_id="media_topic" setMessages={setMessages} topic_id={params.id ?? ''} onScrollBottom={onScrollBottom} />
    </div>
  )
}
const Images: FC<{ media_urls?: string[] }> = ({ media_urls = [] }) => {
  const onRenderClass = () => {
    let className = 'message-body_images-3'
    switch (media_urls.length) {
      case 1:
        className = "message-body_images"
        break;
      case 2:
        className = "message-body_images-2"
        break;
      default:
        break;
    }
    return className
  }

  return (
    <div className={onRenderClass()}>
      {
        media_urls.map(media_url => (
          <div key={media_url} className="message-body_images-item">
            <img src={media_url} alt="" />
          </div>
        ))
      }
    </div>
  )
}
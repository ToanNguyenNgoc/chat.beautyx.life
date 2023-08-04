/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, Button } from "@mui/material";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "src/assets/message.css"
import { Typing, XCircularProgress, XStyledBadge } from "src/components";
import { AppContext, AppContextType } from "src/context/AppProvider";
import { IMessage, ITopic, MessageBody } from "src/interfaces";
import { dateFromNow, linkify, unique } from "src/utils";
import * as Yup from "yup"
import { useFormik } from "formik"
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import apis from "src/apis";
import InfiniteScroll from "react-infinite-scroll-component";
import dayjs from "dayjs";


interface MessageInputProps {
  topic_id: string;
  onScrollBottom?: () => void;
  setMessages?: React.Dispatch<React.SetStateAction<IMessage[]>>
}

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
            <XStyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="standard"
            >
              <Avatar alt="" src="" />
            </XStyledBadge>
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
                      <Avatar src={item.user?.avatar || item.user.fullname} alt="" />
                      <span className="message-item-user_name">{item.user.fullname}</span>
                      <span className="message-item-user_time">{dateFromNow(item.created_at)}</span>
                    </div>
                    <div className={change ? "message-body message-body-ch" : "message-body"}>
                      <div className={change ? "message-body_txt message-body_txt-ch" : "message-body_txt"}
                        dangerouslySetInnerHTML={{ __html: linkify(item.msg) }}
                      />
                    </div>
                  </div>
                </div>
              )
            })
          }
          {(isLoading || isFetchingNextPage) && <XCircularProgress label="Đang tải tin nhắn..." />}
        </InfiniteScroll>
      </div>
      <MessageInput setMessages={setMessages} topic_id={params.id ?? ''} onScrollBottom={onScrollBottom} />
    </div>
  )
}
const MessageInput: FC<MessageInputProps> = ({
  topic_id, setMessages, onScrollBottom
}) => {
  const { echo, user, subdomain } = useContext(AppContext) as AppContextType
  const onEmitTyping = (isTyping: boolean) => {
    let chat: any = echo?.join(`ci.chat.${subdomain}.${topic_id}`)
    chat?.whisper('typing', {
      user: {
        id: user.id,
        fullname: user.fullname,
        avatar: user.avatar,
        isTyping: isTyping
      }, socketId: echo?.socketId()
    })
  }
  const { mutate } = useMutation({
    mutationKey: ['CHAT', topic_id],
    mutationFn: (body: MessageBody) => apis.postMessage(body),
    onSuccess: (result: any, variables, context) => onEmitTyping(false),
  })
  let formik = useFormik({
    initialValues: { body: '' },
    validationSchema: Yup.object({
      body: Yup.string().required()
    }),
    onSubmit: (values) => handleSubmit(values)
  })
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const resizeTextArea = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      if (formik.values.body.length > 0) {
        textAreaRef.current.style.height =
          textAreaRef.current.scrollHeight + "px";
      }
    }
  };
  useEffect(resizeTextArea, [formik.values.body]);
  const handleSubmit = (values: any) => {
    if (setMessages) {
      const newMessage = {
        _id: dayjs().format('HHmmss'),
        created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        msg: values.body,
        topic_id: topic_id,
        user: user,
        user_id: user.id,
        reply_id: null
      }
      setMessages(prev => [newMessage, ...prev])
    }
    mutate({ topic_id: topic_id, msg: values.body })
    formik.resetForm()
    if (onScrollBottom) onScrollBottom()
  }
  return (
    <div className="mess-input-cnt">
      <div className="mess-images"></div>
      <div className="mess-ctl">
        <div className="mess-ctl_cnt">
          <div>
            <input type="file" id="media" hidden />
            <label className="mess-ctl_cnt-btn" htmlFor="media">
              <i className="fa fa-solid fa-image"></i>
            </label>
          </div>
        </div>
        <form className="mess-ctl_form" autoComplete="off" onSubmit={formik.handleSubmit} >
          <textarea
            onFocus={() => onEmitTyping(true)}
            onBlur={() => onEmitTyping(false)}
            onKeyDown={(e) => { if (e.code === "Enter") { e.preventDefault(); formik.handleSubmit() } }}
            ref={textAreaRef}
            name="body"
            value={formik.values.body}
            onChange={formik.handleChange}
            rows={1} placeholder="Aa"
          />
          <Button variant="contained" style={{ backgroundColor: 'var(--purple)' }} type='submit' >
            <i className="fa fa-solid fa-paper-plane"></i>
          </Button>
        </form>
      </div>
    </div>
  )
}
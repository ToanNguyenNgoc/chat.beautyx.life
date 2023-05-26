/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useLocation, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import React, { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { AppContext, AppContextType } from "src/context/AppProvider";
import apis from "src/apis";
import { linkify, onErrorImg, useOnScreen } from "src/utils";
import { IMessage, ITopic, MessageBody } from "src/interfaces";
import { Skeleton } from "./Skeleton";
import { Typing } from "./Typing"
import icon from "src/assets/icon";

export function PageChatRight() {
   const params = useParams()
   const location = useLocation()
   const curTopic: ITopic | null = location?.state
   const { echo, user } = useContext(AppContext) as AppContextType
   const [messages, setMessages] = useState<IMessage[]>([])
   const [isTyping, setIsTyping] = useState()
   const bottomRef = useRef<HTMLDivElement>(null)
   const isInScreen = useOnScreen({ rootMargin: '0px', threshold: 0.3 }, bottomRef)
   const { data, isLoading, fetchNextPage } = useInfiniteQuery({
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
   useEffect(() => {
      if (echo && user.id) {
         let chat: any = echo.join(`ci.chat.demo.${params.id}`)
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
                  setMessages(prev => [u, ...prev])
               }
            })
      }
      return () => {
         setMessages([])
      }
   }, [echo, params.id, user.id])
   const onScrollBottom = () => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
   }
   return (
      <>
         <div className='page-right-head'>
            <div className='head-user'>
               <div className='head-back'>
                  <Link
                     to={{ pathname: `/chats` }}
                  >
                     <img src="https://beautyx.vn/static/media/chevron-left.ac52a0ac09a2c0f64c752c5b4d237b5c.svg" alt="" />
                  </Link>
               </div>
               <div className='head-avatar'>
                  {
                     (curTopic?.topic_user?.length ?? 0) > 1 ?
                        <img src={icon.userGroup} alt="" />
                        :
                        <img src={curTopic?.topic_user[0]?.topic_user?.avatar ?? ''} onError={onErrorImg} alt="" />
                  }
               </div>
               <div>
                  <div className='head-username'>
                     <span className='head-name'>
                        {curTopic?.name ?? curTopic?.topic_user?.map(i => i.topic_user?.fullname)?.join(',')}
                     </span>
                     <div className='head-status'>
                        <span></span>
                        <span>Online</span>
                     </div>
                  </div>
                  {/* <div>@soicodon</div> */}
               </div>
            </div>
            <div className='call'>
               <button type="button" className="btn btn-link"><i className="fa fa-phone" aria-hidden="true"></i></button>
               <button type="button" className="btn btn-link" disabled><i className="fa fa-video-camera" aria-hidden="true"></i></button>
               <button type="button" className="btn btn-link"><i className="fa fa-exclamation" aria-hidden="true"></i></button>
            </div>
         </div>
         <div
            id="scrollableDiv"
            className="message-cnt"
         >
            <InfiniteScroll
               dataLength={messagesT?.length ?? 10}
               hasMore={messagesT.length < totalItem ? true : false}
               loader={<></>}
               next={fetchNextPage}
               inverse={true}
               scrollableTarget="scrollableDiv"
               className="page-right-message message-list"
               style={{ display: 'flex', flexDirection: 'column-reverse', padding: '0px 12px' }}
            >
               {isLoading && <LoadMessage />}
               <div ref={bottomRef} className="bottom-ref" />
               <ScrollBottomBtn onClick={onScrollBottom} show={isInScreen} />
               {isTyping && <Typing />}
               {
                  messages.concat(messagesT).map((item, index) => (
                     <div key={index} className="message-item-cnt">
                        <div className={item.user_id === user.id ? "body body_user" : "body"}>
                           <div
                              className={
                                 item.user_id === user.id ?
                                    "body-message body-message_user" :
                                    "body-message"
                              }>
                              {
                                 user.id !== item.user_id ?
                                    <div className="user-avatar">
                                       <img src={item.user.avatar ?? ''} onError={onErrorImg} alt="" />
                                    </div>
                                    :
                                    <div style={{ backgroundColor: 'transparent' }} className="user-avatar"></div>
                              }
                              <div className="message-item-right">
                                 {user.id !== item.user_id && <p className="user-name">{item.user?.fullname}</p>}
                                 <p
                                    className={
                                       item.user_id === user.id ?
                                          "body-text body-text_user" :
                                          "body-text"
                                    }
                                    dangerouslySetInnerHTML={{ __html: linkify(item.msg) }}
                                 />
                                 <p className="message-item-create">
                                    {dayjs(item.created_at).format('HH:mm DD/MM/YY')}
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>
                  ))
               }
               <div className="bottom-ref bottom-ref-2" />
            </InfiniteScroll>
         </div>
         <InputChat topic_id={params.id ?? ''} onScrollBottom={onScrollBottom} setMessages={setMessages} />
      </>
   );
}

interface InputChatProps {
   topic_id: string;
   onScrollBottom?: () => void;
   setMessages?: React.Dispatch<React.SetStateAction<IMessage[]>>
}
const InputChat = (props: InputChatProps) => {
   const { topic_id, onScrollBottom, setMessages } = props
   const { echo, user } = useContext(AppContext) as AppContextType
   const [message, setMessage] = useState('')
   const onEmitTyping = (isTyping: boolean) => {
      let chat: any = echo?.join(`ci.chat.demo.${topic_id}`)
      chat?.whisper('typing', {
         user: {
            id: user.id,
            fullname: user.fullname,
            avatar: user.avatar,
            isTyping: isTyping
         }, socketId: echo?.socketId()
      })
   }
   const { mutate, isLoading } = useMutation({
      mutationKey: ['CHAT', topic_id],
      mutationFn: (body: MessageBody) => apis.postMessage(body),
      onSuccess: (result: any, variables, context) => {
         setMessage('')
         onEmitTyping(false)
         // queryClient.setQueryData(['CHAT', topic_id], (old: any) => {
         //    const res = { ...result, context: { data: [result.context] } }
         //    // setMessage(initial)
         //    return { ...old, pages: [res, ...old.pages] }
         // })
      },
   })
   const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      setMessage(e.target.value)
   }
   const onSubmit = (e: ChangeEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (onScrollBottom) onScrollBottom()
      if (setMessages) {
         const newMessage = {
            _id: dayjs().format('HHmmss'),
            created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            msg: message,
            topic_id: topic_id,
            user: user,
            user_id: user.id,
            reply_id: null
         }
         setMessages(prev => [newMessage, ...prev])
      }
      setMessage('')
      mutate({ topic_id: topic_id, msg: message })
   }
   return (
      <div className='page-right-foot'>
         <div className='list-icon'>
            <button type="button" className="btn btn-link"><i className="fa fa-plus" aria-hidden="true"></i></button>
            <button type="button" className="btn btn-link"><i className="fa fa-file-image-o" aria-hidden="true"></i></button>
         </div>
         <div className='content'>
            <form onSubmit={onSubmit} className="input-group">
               <input
                  onFocus={() => onEmitTyping(true)}
                  onBlur={() => onEmitTyping(false)}
                  value={message}
                  onChange={onInputChange}
                  type="text"
                  className="form-control" placeholder="Aa"
               />
               <button
                  type="submit" className="btn btn-link"
               >
                  {
                     isLoading ?
                        <i className="fa fa-spinner spinner-rote" aria-hidden="true"></i>
                        :
                        <i className="fa fa-paper-plane" aria-hidden="true"></i>
                  }
               </button>
            </form>
         </div>
         <div className='icon-like'>
            <button type="button" className="btn btn-link"><i className="fa fa-thumbs-up" aria-hidden="true"></i></button>
         </div>
      </div>
   )
}
export const LoadMessage = () => {
   let items: React.ReactNode[] = []
   for (var i = 0; i < 10; i++) {
      const item = <li key={i} className="load-mes-item" >
         <div className="load-mes-item_avt">
            <Skeleton />
         </div>
         <div className="load-mes-item_txt">
            <div className="load-mes-item_txt-name">
               <Skeleton />
            </div>
            <div className="load-mes-item_txt-mes">
               <Skeleton />
            </div>
            <div className="load-mes-item_txt-name">
               <Skeleton />
            </div>
         </div>
      </li>
      items.push(item)
   }
   return (
      <ul>
         {items}
      </ul>
   )
}

interface ScrollBottomBtnProps {
   show: boolean;
   onClick?: () => void
}

const ScrollBottomBtn = (props: ScrollBottomBtnProps) => {
   return (
      <button
         onClick={props.onClick && props.onClick}
         className={props.show ? "scroll-btn" : "scroll-btn scroll-btn-act"}
      >
         <i className="fa fa-arrow-down" aria-hidden="true"></i>
      </button>
   )
}
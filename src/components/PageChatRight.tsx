import { Link, useParams } from "react-router-dom";
import moment from "moment";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apis from "src/apis";
import React, { ChangeEvent, useRef, useState } from "react";
import { MessageBody } from "src/interfaces";
import { Skeleton } from "src/components/Skeleton";
import InfiniteScroll from "react-infinite-scroll-component";

export function PageChatRight() {
   const params = useParams()
   const bottomRef = useRef<HTMLDivElement>(null)
   const user_id = 112
   const { data, isLoading, fetchNextPage } = useInfiniteQuery({
      queryKey: [params.id],
      queryFn: ({ pageParam = 1 }) => apis.getMessages({
         p: pageParam,
         topic_id: params.id ?? '',
         l: 15,
         sort: '-created_at'
      }),
      enabled: (params.id) ? true : false,
      getNextPageParam: (page: any) => {
         if (page.context?.current_page <= page.context?.last_page) {
            return page?.context?.current_page + 1
         }
         return null
      }
   })
   const messagesT = data?.pages.map(i => i.context.data).flat() ?? []
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
                  <img src="https://devapi.myspa.vn/media/10084/277763215_543969187157980_5261600049025341561_n.jpeg?v=1678373000" alt="" />
               </div>
               <div>
                  <div className='head-username'>
                     <span className='head-name'>Sói cô đơn Sói cô đơn Sói cô đơn Sói cô đơn Sói cô đơn</span>
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
               hasMore={true}
               loader={<></>}
               next={fetchNextPage}
               inverse={true}
               scrollableTarget="scrollableDiv"
               className="page-right-message message-list"
               style={{ display: 'flex', flexDirection: 'column-reverse', padding: '0px 12px' }}
            >
               {isLoading && <LoadMessage />}
               <div ref={bottomRef} className="bottom-ref" />
               {
                  messagesT?.map((item) => (
                     <div key={item._id} className="message-item-cnt">
                        <div className={item.user_id === user_id ? "body body_user" : "body"}>
                           <div
                              className={
                                 item.user_id === user_id ?
                                    "body-message body-message_user" :
                                    "body-message"
                              }>
                              {
                                 user_id !== item.user_id ?
                                    <div className="user-avatar">
                                       <img src="https://devapi.myspa.vn/media/10084/277763215_543969187157980_5261600049025341561_n.jpeg?v=1678373000" alt="" />
                                    </div>
                                    :
                                    <div style={{ backgroundColor: 'transparent' }} className="user-avatar"></div>
                              }
                              <div className="message-item-right">
                                 {user_id !== item.user_id && <p className="user-name">Gấu chó</p>}
                                 <p
                                    className={
                                       item.user_id === user_id ?
                                          "body-text body-text_user" :
                                          "body-text"
                                    }
                                 >
                                    {item.msg}
                                 </p>
                                 <p className="message-item-create">
                                    {moment(item.created_at).format('HH:mm DD/MM/YY')}
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
         <InputChat topic_id={params.id ?? ''} onScrollBottom={onScrollBottom} />
      </>
   );
}

interface InputChatProps {
   topic_id: string;
   onScrollBottom?: () => void
}

const InputChat = (props: InputChatProps) => {
   const { topic_id, onScrollBottom } = props
   const initial = { msg: '', topic_id: topic_id }
   const [message, setMessage] = useState<MessageBody>(initial)
   const queryClient = useQueryClient()
   const { mutate, isLoading } = useMutation({
      mutationKey: [topic_id],
      mutationFn: () => apis.postMessage(message),
      onSuccess: (result, variables, context) => {
         queryClient.setQueryData([topic_id], (old: any) => {
            const res = { ...result, context: { data: [result.context] } }
            setMessage(initial)
            return { ...old, pages: [res, ...old.pages] }
         })
      },
   })
   const onSubmit = (e: ChangeEvent<HTMLFormElement>) => {
      e.preventDefault()
      mutate()
      if (onScrollBottom) onScrollBottom()
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
                  value={message.msg}
                  onChange={(e) => setMessage({ ...message, msg: e.target.value })}
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
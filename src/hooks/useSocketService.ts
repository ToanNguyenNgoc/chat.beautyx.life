/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useRef } from "react"
import { AppContext, AppContextType } from "src/context/AppProvider"
import { io, Socket } from "socket.io-client";
import { MessageBody } from "src/interfaces";
import { uniqueArray } from "src/utils";
import { useGetTopicIds } from "./useGetTopicIds";
import { useGetSocketConfig } from "./useGetSocketConfig";

const Events = {
  SUB: 'SUB',
  SUB_TOPIC: 'SUB_TOPIC',
  SEND_MSG: 'SEND_MSG',
  LISTENER_MSG: 'LISTENER_MSG',
  LISTENER_MSG_ORG: 'LISTENER_MSG_ORG',
  TYPING: 'TYPING'
}

export type DoTypingType = { typing: boolean, topic_id: string }
export type TypingType = { topic_id: string, typing: boolean, user: any }


export function useSocketService() {
  const { user, org } = useContext(AppContext) as AppContextType;
  const {config} = useGetSocketConfig();
  const { topic_ids, isFetched } = useGetTopicIds();
  const socketRef = useRef<Socket | null>(null);
  const connect = async () => {
    if(!config?.ws_host) return;
    if (socketRef.current) return socketRef.current;
    return new Promise<Socket>((resolve, reject) => {
      try {
        socketRef.current = io(String(config.ws_host), {
          // socketRef.current = io('http://localhost:3004', {
          extraHeaders: {
            Authorization: `Bearer`,
          },
          reconnection: true,
          reconnectionAttempts: 100,
          reconnectionDelay: 2000,
        });
        socketRef.current.on("connect", () => {
          console.log("Connected to WebSocket");
          socketRef.current!.emit(Events.SUB, { user: { ...user, org_id: org?.id }, topic_ids });
          resolve(socketRef.current!);
        });

        socketRef.current.on("connect_error", (err) => {
          console.error("WebSocket Connection Error:", err);
          reject(err);
        });
      } catch (error) {
        console.error("WebSocket Exception:", error);
        reject(error);
      }
    });
  };
  useEffect(() => {
    if (config?.ws_host && user?.id && isFetched && org?.id)
      connect()
  }, [config?.ws_host, user?.id, isFetched, topic_ids.length, org])


  const onListenerMessage = (cb: (data: any) => void) => {
    if (!socketRef.current) return;
    socketRef.current.on(Events.LISTENER_MSG, cb);
    return () => socketRef.current?.off(Events.LISTENER_MSG, cb);
  }
  const onListenerMessageOrg = (cb: (data: any) => void) => {
    if (!socketRef.current) return;
    socketRef.current.on(Events.LISTENER_MSG_ORG, cb);
    return () => socketRef.current?.off(Events.LISTENER_MSG_ORG, cb);
  }
  const onListenerTyping = (cb: (data: TypingType) => void) => {
    if (!socketRef.current) return;
    socketRef.current.on(Events.TYPING, cb);
    return () => socketRef.current?.off(Events.TYPING, cb);
  }
  //
  const doManualSubscribeTopic = (topic_id: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit(Events.SUB_TOPIC, { user, topic_id })
  }
  const doMessage = (data: MessageBody, topic_users?: number[]) => {
    if (!socketRef.current) return;
    socketRef.current.emit(Events.SEND_MSG, {
      user,
      message: { msg: data.msg, topic_id: data.topic_id, media_ids: data.media_ids, media_urls: data.media_urls },
      user_ids: uniqueArray(topic_users?.filter(i => i !== user?.id)).filter(Boolean) || []
    });
  };
  const doTyping = (data: DoTypingType) => {
    if (!socketRef.current) return;
    socketRef.current.emit(Events.TYPING, {
      user,
      typing: data
    })
  }
  return {
    config,
    user, topic_ids,
    connect,
    doMessage,
    onListenerMessage,
    onListenerMessageOrg,
    doManualSubscribeTopic,
    doTyping,
    onListenerTyping
  }
}
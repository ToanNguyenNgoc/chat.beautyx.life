/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useRef } from "react"
import { AppContext, AppContextType } from "src/context/AppProvider"
import { io, Socket } from "socket.io-client";
import { useGetAllTopic } from "./useGetAllTopic";
import { MessageBody } from "src/interfaces";

const Events = {
  SUB: 'SUB',
  SEND_MSG: 'SEND_MSG',
  LISTENER_MSG: 'LISTENER_MSG',
  TYPING: 'TYPING'
}

export type DoTypingType = { typing: boolean, topic_id: string }
export type TypingType = { topic_id: string, typing: boolean, user: any }

export function useSocketService() {
  const { user } = useContext(AppContext) as AppContextType;
  const { topic_ids, isFetched } = useGetAllTopic();
  const socketRef = useRef<Socket | null>(null);
  const connect = async () => {
    if (socketRef.current) return socketRef.current;
    return new Promise<Socket>((resolve, reject) => {
      try {
        socketRef.current = io(String(process.env.REACT_APP_SOCKET_URL), {
        // socketRef.current = io('ws://localhost:3004', {
          extraHeaders: {
            Authorization: `Bearer`,
          },
          reconnection: true,
          reconnectionAttempts: 100,
          reconnectionDelay: 2000,
        });
        socketRef.current.on("connect", () => {
          console.log("Connected to WebSocket");
          socketRef.current!.emit(Events.SUB, { user, topic_ids });
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
    if (user && isFetched && topic_ids.length > 0)
      connect()
  }, [user, isFetched, topic_ids.length])


  const onListenerMessage = (cb: (data: any) => void) => {
    if (!socketRef.current) return;
    socketRef.current.on(Events.LISTENER_MSG, cb)
  }
  const onListenerTyping = (cb: (data: TypingType) => void) => {
    if (!socketRef.current) return;
    socketRef.current.on(Events.TYPING, cb)
  }
  const doMessage = (data: MessageBody) => {
    if (!socketRef.current) return;
    socketRef.current.emit(Events.SEND_MSG, {
      user,
      message: { msg: data.msg, topic_id: data.topic_id, media_ids: data.media_ids, media_urls: data.media_urls }
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
    user, topic_ids,
    connect,
    doMessage,
    onListenerMessage,
    doTyping,
    onListenerTyping
  }
}
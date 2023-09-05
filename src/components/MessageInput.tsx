import { Button, CircularProgress, useMediaQuery } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { useFormik } from "formik";
import { ChangeEvent, FC, useContext, useEffect, useRef } from "react";
import apis from "src/apis";
import icon from "src/assets/icon";
import "src/assets/message.css"
import { AppContext, AppContextType } from "src/context/AppProvider";
import { useMedia, useNotification } from "src/hooks";
import { IMessage, Media, MessageBody, StoreAllMessageBody } from "src/interfaces";
import { Snack } from "./Snack";

interface MessageInputProps {
  topic_id: string;
  topic_ids?: string[];
  type?: 'SINGLE' | 'MULTI';
  input_media_id: string;
  onScrollBottom?: () => void;
  setMessages?: React.Dispatch<React.SetStateAction<IMessage[]>>
}

export const MessageInput: FC<MessageInputProps> = ({
  topic_id, setMessages, onScrollBottom, type = 'SINGLE', input_media_id, topic_ids = []
}) => {
  const { resultLoad, notification, onCloseNotification } = useNotification()
  const { echo, user, subdomain } = useContext(AppContext) as AppContextType
  const mb = useMediaQuery('(max-width:767px)')
  const { handlePostMedia } = useMedia()
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
  const { mutateAsync: mutateAllStore, isLoading: isLoadingAllStore } = useMutation({
    mutationKey: ['CHAT', topic_ids],
    mutationFn: (body: StoreAllMessageBody) => apis.postStoreAllMessage(body),
    onSuccess: (result: any, variables, context) => {
      onEmitTyping(false);
      resultLoad({
        message: 'Đã gửi tin nhắn thành công',
        color: 'success',
      })
    },
  })
  let formik = useFormik({
    initialValues: { body: '', media: [] },
    onSubmit: (values) => handleSubmit(values)
  })
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const emojiCntRef = useRef<HTMLDivElement>(null)
  const onTriggerEmoji = (trigger: 'show' | 'hide') => {
    if (emojiCntRef.current) {
      if (trigger === 'show') emojiCntRef.current.classList.add('emoji-cnt-act')
      if (trigger === 'hide') emojiCntRef.current.classList.remove('emoji-cnt-act')
    }
  }
  window.addEventListener('click', () => onTriggerEmoji('hide'))
  const onChangeMedia = (e: ChangeEvent<HTMLInputElement>) => {
    const oldMedia = formik.values.media as Media[]
    handlePostMedia({
      e,
      callBack: (data) => formik.setFieldValue('media', [...oldMedia, ...data]),
      resetOriginalUrl: true,
      onError: () => resultLoad({
        message: 'Có lỗi xảy ra trong quá trình upload hình/video',
        color: 'error'
      }),
      onWaring: () => resultLoad({
        message: 'Dung lượng upload tối đa 10MB',
        color: 'warning'
      }),
    })
  }
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
    if (values.body.trim() !== "" || values.media.length > 0) {
      if (type === 'SINGLE') {
        if (setMessages) {
          const newMessage = {
            _id: dayjs().format('HHmmss'),
            created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            msg: values.body,
            topic_id: topic_id,
            user: user,
            user_id: user.id,
            reply_id: null,
            media_urls: values.media.map((i: Media) => i.original_url)
          }
          setMessages(prev => [newMessage, ...prev])
        }
        mutate({ topic_id: topic_id, msg: values.body, media_ids: values.media.map((i: Media) => i.model_id) })
        formik.resetForm()
        if (onScrollBottom) onScrollBottom()
      }
      if (type === "MULTI") {
        topic_ids.forEach(async (topic_id) => {
          await mutateAllStore({
            msg: values.body,
            topic_ids: [topic_id],
            media_ids: values.media.map((i: Media) => i.model_id)
          })
        })
        formik.resetForm()
      }
    }
  }
  return (
    <div className="mess-input-cnt">
      <Snack
        open={notification.openAlert}
        message={notification.message}
        severity={notification.color}
        onClose={onCloseNotification}
      />
      {
        formik.values.media.length > 0 &&
        <div className="mess-images">
          <div className="mess-images-list">
            {
              formik.values.media.map((item: Media, i) => (
                <div key={i} className="mess-images-item">
                  {
                    item.mine_type === "video/mp4" ?
                      <video controls ><source src={item.original_url} /></video> :
                      <img src={item.original_url} alt="" />
                  }
                  {
                    item.model_id <= 0 ?
                      <div className="mess-images-item_load"><CircularProgress size={20} /></div>
                      :
                      <div
                        onClick={() => formik.setFieldValue('media', formik.values.media.filter((child: Media) => child.model_id !== item.model_id))}
                        className="mess-images-item_btn"><i className="fa fa-times"></i>
                      </div>
                  }
                </div>
              ))
            }
          </div>
        </div>
      }
      <div className="mess-ctl">
        <div className="mess-ctl_cnt">
          <div>
            <input onChange={onChangeMedia} multiple type="file" id={input_media_id} hidden />
            <label className="mess-ctl_cnt-btn" htmlFor={input_media_id}>
              <i className="fa fa-solid fa-image"></i>
            </label>
          </div>
          {
            (!mb && type === 'SINGLE') &&
            <div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onTriggerEmoji('show');
                }}
                className="mess-ctl_cnt-btn mess-ctl_cnt-btn-emoji"
              >
                <img style={{ width: '17px', height: '17px' }} src={icon.smileWhite} alt="" />
                <div ref={emojiCntRef} className="emoji-cnt">
                  <EmojiPicker
                    height={400}
                    width={340}
                    onEmojiClick={(emoji, e) => {
                      e.stopPropagation();
                      formik.setFieldValue('body', formik.values.body + emoji.emoji)
                    }}
                    emojiStyle={EmojiStyle.APPLE}
                  />
                </div>
              </div>
            </div>
          }
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
          <Button disabled={isLoadingAllStore} variant="contained" style={{ backgroundColor: 'var(--purple)' }} type='submit' >
            {
              !isLoadingAllStore ?
                <i className="fa fa-solid fa-paper-plane"></i> :
                <i className="fa fa-circle-o-notch fa-spinner-anm" aria-hidden="true"></i>
            }
          </Button>
        </form>
      </div>
    </div>
  )
}
import { Checkbox, Dialog, Slide, TextField, useMediaQuery } from "@mui/material";
import { ChangeEvent, FC, forwardRef, useCallback, useContext, useState } from "react";
import 'src/assets/message-many.css'
import { MessageInput } from "./MessageInput";
import { useInfiniteQuery } from "@tanstack/react-query";
import apis from "src/apis";
import { AppContext, AppContextType } from "src/context/AppProvider";
import { ITopic } from "src/interfaces";
import { AvatarTopic } from "./AvatarTopic";
import { onRenderTopicName } from "src/utils";
import { XCircularProgress } from "./XCircularProgress";
import { TransitionProps } from "@mui/material/transitions";

interface SendManyMessageProps {
  open?: boolean;
  onClose?: () => void
}
const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="right" ref={ref} {...props} />;
});

export const SendManyMessage: FC<SendManyMessageProps> = ({
  open = false,
  onClose = () => { }
}) => {
  const mb = useMediaQuery('(max-width:767px)')
  const { subdomain } = useContext(AppContext) as AppContextType
  const [search, setSearch] = useState('')
  const [topicIds, setTopicIds] = useState<string[]>([])
  const onChangeSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTimeout(() => setSearch(e.target.value), 800)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])
  const { data, isLoading } = useInfiniteQuery({
    queryKey: ['TOPICS', search],
    queryFn: ({ pageParam = 1 }) => apis.getTopics({
      p: pageParam,
      l: 15,
      s: search,
      sort: '-updated_at',
      org: subdomain ?? ''
    }),
    onSuccess: (data) => { },
    getNextPageParam: (page: any) => page?.context?.current_page + 1
  })
  const topics: ITopic[] = data?.pages?.map(i => i.context.data).flat() ?? []
  const onChangeTopic = (topic_id: string) => {
    setTopicIds(prev => {
      if (prev.includes(topic_id)) {
        return prev.filter(i => i !== topic_id)
      } else {
        return [topic_id, ...prev]
      }
    })
  }
  return (
    <Dialog
      fullScreen={mb} open={open} onClose={onClose}
      TransitionComponent={mb ? Transition : undefined}
    >
      <div className="message-multi">
        <div className="message-multi_head">
          <div className="message-multi_head-nav">
            <button onClick={onClose} className="btn-back">
              <i className="fa fa-chevron-left" aria-hidden="true"></i>
            </button>
            <span className="message-multi_head-title">Gửi đến</span>
            <div></div>
          </div>
          <div className="message-multi_head-search">
            <TextField
              color='success'
              hiddenLabel fullWidth
              id="filled-hidden-label-small"
              placeholder='Tìm kiếm...'
              variant="filled"
              size="small"
              onChange={onChangeSearch}
            />
          </div>
        </div>
      </div>
      <div className="message-multi_body">
        {isLoading && <XCircularProgress label='Đang tải...' />}
        <ul className="message-multi_body-list">
          {
            topics.map(i => (
              <li key={i._id} className="message-multi_body-list-item">
                <div className="multi-topic-item-checkbox">
                  <Checkbox readOnly onClick={() => onChangeTopic(i._id)} size="small" />
                </div>
                <div className="multi-topic-item">
                  <div className="multi-topic-item_avatar">
                    <AvatarTopic topic={i} />
                  </div>
                  <span className="multi-topic-item_name">
                    {onRenderTopicName(i).name}
                  </span>
                </div>
              </li>
            ))
          }
        </ul>
      </div>
      <div className="message-multi_input">
        <MessageInput topic_ids={topicIds} input_media_id="multi_mess_media" type="MULTI" topic_id="1" />
      </div>
    </Dialog>
  )
}
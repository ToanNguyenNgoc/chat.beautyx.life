import {
  ChangeEvent,
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useLocation } from "react-router-dom";
import apis from "src/apis";
import { XButton, XButtonFile } from "src/components";
import { Media, usePostMedia } from "src/hooks/usePostMedia";
import { BodyComment, IComment } from "src/interfaces";
import style from "./style.module.css";
import CommentParItem from "./CommentParItem";
import { Avatar, CircularProgress, Container } from "@mui/material";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import icon from "src/assets/icon";
import { clst } from "src/utils";
import { formatLinkDetail } from "src/utils/formatLinkDetail";

export interface CommentProps {
  commentable_type: any;
  commentable_id?: number;
  org_id?: number;
  commentsMixed?: IComment[];
  layout?: "column" | "row";
  fixed_input?: boolean;
  classNameCnt?: string;
  classNameInputCnt?: string;
  all?: boolean;
  hiddenInput?: boolean;
  user?: any;
}
export interface InitialValue {
  body?: string;
  media_ids?: Media[];
}

export const Comment = ({
  commentable_type,
  commentable_id,
  org_id,
  commentsMixed = [],
  layout = "row",
  classNameCnt = "",
  classNameInputCnt = "",
  all,
  hiddenInput = true,
  user,
}: CommentProps) => {
  const location = useLocation();
  const { handlePostMedia } = usePostMedia();
  const [value, setValue] = useState<InitialValue>({ body: "" });
  const cntRef = useRef<HTMLDivElement>(null);
  const client = useQueryClient();
  const QR_KEY = ["COMMENT", commentable_type, commentable_id, org_id, all];

  const { data } = useInfiniteQuery({
    queryKey: QR_KEY,
    queryFn: ({ pageParam = 1 }) =>
      apis.getAllComment({
        "filter[organization_id]":
          commentable_type === "ORGANIZATION" ? (all ? org_id : "") : org_id,
        "filter[commentable_type]": all ? "" : commentable_type,
        "filter[commentable_id]": all ? "" : commentable_id,
        page: pageParam,
        limit: 20,
      }),
    enabled: !!org_id,
    onSuccess: () => {
      if (location.hash === "#cmt" && cntRef.current) {
        cntRef.current.scrollIntoView({ behavior: "auto" });
      }
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: (body: BodyComment) => apis.createComment(body),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: QR_KEY });
      setValue({ body: "" });
    },
  });
  const bodyComment = {
    body: `${value?.body}`,
    commentable_id: commentable_id || org_id,
    commentable_type:
      commentable_type === "COMBO" ? "TREATMENT_COMBO" : commentable_type,
    organization_id: org_id,
    media_ids: value?.media_ids?.map((i) => i.model_id) || [],
  };
  const handlePostCmt = async () => {
    if (bodyComment.body.length > 0 || bodyComment.media_ids?.length > 0) {
      mutate(bodyComment);
    }
  };

  const onChangeMedia = (e: ChangeEvent<HTMLInputElement>) => {
    handlePostMedia({
      e,
      callBack: (data: any) => {
        const media_ids = value?.media_ids
          ? [...data, ...value.media_ids]
          : data;
        setValue((prev) => {
          return { ...prev, media_ids: media_ids };
        });
      },
    });
  };
  const comments = data?.pages.map((i:any) => i.context.data).flat() || [];

  const onRemoveMedia = (model_id: number) => {
    setValue((prev) => {
      return {
        ...prev,
        media_ids: prev?.media_ids?.filter((i) => i.model_id !== model_id),
      };
    });
  };
  return (
    <Container>
      <div ref={cntRef} className={clst([style.container_right, classNameCnt])}>
        <div className={classNameInputCnt}>
          {!hiddenInput && (
            <div className={style.input_cnt}>
              <div className={style.input_avatar}>
                <Avatar src={user?.avatar} alt={user?.fullname} />
              </div>
              <div className={style.input}>
                <div className={style.input_body}>
                  <Textarea
                    onKeyDown={handlePostCmt}
                    text={value?.body}
                    onChange={(e) =>
                      setValue((prev) => {
                        return { ...prev, body: e.target.value };
                      })
                    }
                  />
                  <div className={style.input_btn}>
                    <XButtonFile
                      onChange={onChangeMedia}
                      multiple
                      iconSize={18}
                      icon={icon.addFileWhite}
                    />
                    <XButton
                      onClick={handlePostCmt}
                      loading={isLoading}
                      iconSize={18}
                      icon={icon.planPaperWhite}
                    />
                  </div>
                </div>
                <div className={style.input_image}>
                  <div className={style.media_cnt}>
                    {value?.media_ids?.map((media) => (
                      <div key={media.model_id} className={style.media}>
                        <img src={media.original_url} alt="" />
                        {media.model_id > 0 ? (
                          <XButton
                            onClick={() => onRemoveMedia(media.model_id)}
                            className={style.media_rm}
                            icon={icon.closeCircle}
                            iconSize={18}
                          />
                        ) : (
                          <div className={style.media_load}>
                            <CircularProgress size={32} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className={style.body}>
          <ul className={style.cmt_list}>
            {comments.map((item: IComment, index: number) => (
              <li key={index} className={style.cmt_list_li}>
                <CommentParItem
                  layout={layout}
                  comment={item}
                  org_id={org_id}
                  USER_PAR_NAME={item.user?.fullname}
                  all={all}
                  user={user}
                />
              </li>
            ))}
            {commentsMixed.map((item: IComment, index: number) => (
              <li key={index} className={style.cmt_list_li}>
                <CommentParItem
                  layout={layout}
                  comment={item}
                  USER_PAR_NAME={item.user?.fullname}
                  mixed
                  user={user}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  );
};

interface TextareaProps {
  text?: string;
  onKeyDown?: (e: any) => void;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const Textarea: FC<TextareaProps> = ({
  text = "",
  onChange = () => {},
  onKeyDown = () => {},
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const resizeTextArea = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      if (text?.length > 0) {
        textAreaRef.current.style.height =
          textAreaRef.current.scrollHeight + "px";
      }
    }
  };
  useEffect(resizeTextArea, [text]);
  return (
    <textarea
      ref={textAreaRef}
      value={text}
      onChange={onChange}
      onKeyDown={(e) => {
        if (e.code === "Enter") {
          e.preventDefault();
          onKeyDown(e);
        }
      }}
      className={style.input_txt}
      rows={1}
      placeholder="Bình luận"
    />
  );
};

export const RedirectOrigin: FC<{ comment: IComment }> = ({ comment }) => {
  return (
    <Link
      to={formatLinkDetail(
        comment.commentable_id,
        Number(comment.organization_id),
        "",
        comment.commentable_type
      )}
      target="_blank"
      className={style.comment_body_origin_btn}
    >
      Từ dịch vụ
      <img src={icon.arrowDown} alt="" />
    </Link>
  );
};

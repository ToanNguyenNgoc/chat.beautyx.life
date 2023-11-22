import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import apis from "src/apis";
import icon from "src/assets/icon";
import { InitialValue, RedirectOrigin, RenderStar, XButton } from "src/components";
import { BodyComment, IComment, ICommentChild } from "src/interfaces";
import { clst, dateFromNow } from "src/utils";
import style from "./style.module.css";


interface CommentParItemProps {
  QR_KEY?: any;
  comment: IComment;
  org_id?: number;
  USER_PAR_NAME: string;
  mixed?: boolean;
  layout?: "column" | "row";
  all?: boolean;
  user: any,
}

function CommentParItem(props: CommentParItemProps) {
  const { org_id, comment, mixed = false, QR_KEY, layout, all, user } = props;
  let body = comment.body;
  try {
    body = JSON.parse(comment.body).text;
  } catch (error) {
    body = comment.body;
  }
  const USER = user
  const [value, setValue] = useState<InitialValue>({ body: "" });
  const replyCount = comment.children?.length;
  const bodyComment = {
    body: `${value?.body}`,
    commentable_id: comment.id,
    commentable_type: "REPLY_COMMENT",
    organization_id: org_id,
  };
  const client = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: (body: BodyComment) => apis.createComment(body),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: QR_KEY });
      setValue({ body: "" });
    },
  });
  const handlePostCmtReply = async () => {
    if (USER && bodyComment.body.length > 0 && bodyComment.body !== "‭") {
      mutate(bodyComment);
    }
  };
  const starElement = [];
  const rate: number = comment.rate?.point ?? 0;
  for (var i = 0; i < rate; i++) {
    starElement.push(
      <img key={i} src={icon.star} width={14} height={14} alt="" />
    );
  }
  let replyBtnDis = false;
  if (!mixed) replyBtnDis = true;
  if (mixed && replyCount > 0) replyBtnDis = true;

  return (
    <div
      className={clst([
        style.comment_item_cnt,
        style.comment_item_cnt_par,
        layout === "column" ? style.comment_item_cnt_ch : "",
      ])}
    >
      <div className={style.comment_item_head}>
        <div className={style.user}>
          <Avatar
            src={comment?.user?.avatar ? comment?.user?.avatar : ""}
            alt=""
          />
          <span className={style.user_fullname}>{comment.user?.fullname}</span>
        </div>
        {body?.includes("‭") && (
          <div className={style.bought_cnt}>
            <img src={icon.checkFlowGreen} alt="" /> Đã mua hàng
          </div>
        )}
      </div>
      <div className={style.comment_body}>
        <div className={style.comment_body_start_origin_cnt}>
          {comment.rate && body?.includes("‭") ? (
            <RenderStar point={comment.rate.point} />
          ) : (
            <div></div>
          )}
          {all && <RedirectOrigin comment={comment} />}
        </div>
        {(body || comment.media_url.length > 0) && (
          <div className={style.comment_body_txt}>
            {body}
            <div className={style.comment_body_media_list}>
              {comment.media_url?.map((i: any) => (
                <div key={i} className={style.comment_body_media}>
                  <img src={i} alt="" />
                </div>
              ))}
            </div>
          </div>
        )}
        <span className={style.created_at}>
          {dateFromNow(comment.created_at)}
        </span>
        <div
          className={clst([
            style.reply_cnt,
            layout === "column" ? style.reply_cnt_ch : "",
          ])}
        >
          <Accordion defaultExpanded>
            {replyBtnDis && (
              <AccordionSummary
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <span className={style.cmt_reply_open}>
                  {replyCount > 0 && replyCount} Phản hồi
                </span>
              </AccordionSummary>
            )}
            <AccordionDetails>
              {comment.children.map((child: ICommentChild, i: number) => (
                <div
                  key={i}
                  style={{ marginBottom: "6px" }}
                  className={clst([
                    style.comment_item_cnt,
                    layout === "column" ? style.comment_item_cnt_ch : "",
                  ])}
                >
                  <div className={style.comment_item_head}>
                    <div className={style.user}>
                      <Avatar
                        src={child?.user?.avatar ? child?.user?.avatar : ""}
                        alt=""
                      />
                      <span className={style.user_fullname}>
                        {child.user?.fullname}
                      </span>
                    </div>
                    {child.body?.includes("‭") && (
                      <div className={style.bought_cnt}>
                        <img src={icon.checkFlowGreen} alt="" /> Đã mua hàng
                      </div>
                    )}
                  </div>
                  <div className={style.comment_body}>
                    <div
                      style={{ backgroundColor: "#c1dbe9" }}
                      className={style.comment_body_txt}
                    >
                      {child.body}
                      <div className={style.comment_body_media_list}>
                        {child.media_url?.map((i: any) => (
                          <div key={i} className={style.comment_body_media}>
                            <img src={i} alt="" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <span className={style.created_at}>
                      {dateFromNow(
                        mixed ? comment.created_at : child.created_at || ""
                      )}
                    </span>
                  </div>
                </div>
              ))}
              {!mixed && (
                <div className={style.reply_input_cnt}>
                  <div className={style.user}>
                    <Avatar src={USER?.avatar} alt={USER?.fullname} />
                  </div>
                  <div className={style.reply_input}>
                    <input
                      value={value.body}
                      onChange={(e) =>
                        setValue((prev: any) => {
                          return { ...prev, body: e.target.value };
                        })
                      }
                      type="text"
                      placeholder="Trả lời"
                      onKeyDown={(e) => {
                        e.code === "Enter" && handlePostCmtReply();
                      }}
                    />
                    <XButton
                      onClick={handlePostCmtReply}
                      loading={isLoading}
                      icon={icon.planPaperWhite}
                      iconSize={18}
                    />
                  </div>
                </div>
              )}
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
export default CommentParItem;

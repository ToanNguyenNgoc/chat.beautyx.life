import { Container } from "@mui/material";
import { FC, useContext, useState } from "react";
import { Comment } from "src/components/Comment/index";
import { AppContext, AppContextType } from "src/context/AppProvider";
import style from "./style.module.css";

export const ManageComment: FC = () => {
  const { org, user } = useContext(AppContext) as AppContextType;
  const [check, setCheck] = useState<boolean>(true);

  return (
    <div className={style.comment_page}>
      <Container>
        <div className={style.comment_page_wrap}>
          <div className={style.comment_left}>
            <div
              onClick={() => setCheck(true)}
              className={`${check ? style.activeTab : ""} ${
                style.comment_left_item
              }`}
            >
              <p>Doanh nghiệp</p>
            </div>
            <div
              onClick={() => setCheck(false)}
              className={`${check ? "" : style.activeTab} ${
                style.comment_left_item
              }`}
            >
              <p>Dịch vụ, sản phẩm</p>
            </div>
          </div>
          <div className={style.comment_right}>
            <Comment
              user={user}
              org_id={org?.id}
              commentable_id={org?.id}
              commentable_type="ORGANIZATION"
              all={check ? false : true}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

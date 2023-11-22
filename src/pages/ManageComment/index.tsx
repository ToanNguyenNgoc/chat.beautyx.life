import { FC, useContext, useEffect, useState } from "react";
import { AppContext, AppContextType } from "src/context/AppProvider";
import { Comment } from "src/components/Comment/index";
import style from "./style.module.css";
import { Container } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export const ManageComment: FC = () => {
  const { org, user } = useContext(AppContext) as AppContextType;
  const [check, setCheck] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.search && user) {
      navigate("/ManageComment");
    }
  }, [location, navigate, user]);

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

import { FC, useContext } from "react";
import { AppContext, AppContextType } from "src/context/AppProvider";

export const ManageComment: FC = () => {
  const {org, user} = useContext(AppContext) as AppContextType
  console.log(org, user)
  return (
    <div>
      ManageComment
    </div>
  )
}
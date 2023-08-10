import { FC } from "react";
import { ITopic } from "src/interfaces";
import 'src/assets/main.css'
import { Avatar } from "@mui/material";
import { XStyledBadge } from "./XStyleBadge";
import { onRenderTopicName } from "src/utils";

interface AvatarTopicProps {
  topic: ITopic
}

export const AvatarTopic: FC<AvatarTopicProps> = ({ topic }) => {
  let isGroup = false
  const { name, uniqueUser } = onRenderTopicName(topic)
  if (uniqueUser.length > 1 || uniqueUser.length === 0) isGroup = true
  return (
    <div className="avatar">
      {
        isGroup ?
          <div className='avatar-group'>
            {
              uniqueUser.length > 0 ?
                uniqueUser.slice(0, 2).map((u) => (
                  <div key={u.user_id} className="avatar-group_item">
                    <Avatar
                      alt={u?.user?.fullname} src={u?.user?.avatar || u?.user?.fullname}
                      sx={{ width: 26, height: 26 }}
                    />
                  </div>
                ))
                :
                <Avatar alt={name} src={name} />
            }
          </div>
          :
          <XStyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="standard"
          >
            <Avatar alt={uniqueUser[0]?.user?.fullname} src={uniqueUser[0]?.user?.avatar || uniqueUser[0]?.user?.fullname} />
          </XStyledBadge>
      }
    </div>
  )
}
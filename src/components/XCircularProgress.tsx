import { CircularProgress } from "@mui/material";
import { FC } from "react";
import "src/assets/skeleton.css"

interface Props {
  label?: string;
  size?: number
}

export const XCircularProgress: FC<Props> = ({ label = 'Đang tải...', size = 14 }) => {
  return (
    <div className="x-process">
      <span>{label}</span>
      <CircularProgress size={size} />
    </div>
  )
}
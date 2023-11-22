import { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import icon from "src/assets/icon";

interface RenderStarProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  point?: number;
}

export const RenderStar: FC<RenderStarProps> = (props) => {
  const { point = 5 } = props;
  return (
    <div {...props}>
      <div style={{ display: "flex" }}>
        {Array(point)
          .fill(null)
          .map((_, index) => (
            <img
              style={{ width: 14, height: 14, marginRight: 3 }}
              key={index}
              src={icon.starFill}
              alt=""
            />
          ))}
      </div>
    </div>
  );
};

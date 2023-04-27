import 'src/assets/skeleton.css'

interface SkeletonProps {
  style?: React.CSSProperties,
  className?: string
}

export function Skeleton(props: SkeletonProps) {
  return (
    <div style={props.style} className={`placeholder title ${props.className ?? ''}`}></div>
  );
}
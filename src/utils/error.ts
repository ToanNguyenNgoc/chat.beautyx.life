import icon from 'src/assets/icon'

export const onErrorImg = (e: any) => {
  e.target.src = icon.user
  e.target.style.objectFit = 'contain'
  //e.target.style.transform = "scale(0.5)";
}
export const onLoadImg = (e: any) => {
  e.target.src = icon.user
  e.target.style.objectFit = 'contain'
  //e.target.style.transform = "scale(0.5)";
}

import dayjs from "dayjs";
import locale from "dayjs/locale/vi";
import relativeTime from "dayjs/plugin/relativeTime";

export const dateFromNow = (date: string) => {
  dayjs.extend(relativeTime);
  return dayjs(date).locale(locale.name).fromNow();
};
export const linkify = (text: string) => {
  // eslint-disable-next-line no-useless-escape
  const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  const urlImgRegex = /\.(jpeg|jpg|gif|png)$/
  let element = text
  if (text.match(urlRegex)) {
    element = text.replace(urlRegex, function (url) {
      return '<a class="linkify-chat" target="blank" href="' + url + '">' + url + "</a>";
    });
  }
  if (text.match(urlImgRegex)) {
    element = '<image class="msg-img" src=" ' + text + ' " alt="" />'
  }
  return element
}
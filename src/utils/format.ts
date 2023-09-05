/* eslint-disable no-useless-escape */
import dayjs from "dayjs";
import locale from "dayjs/locale/vi";
import relativeTime from "dayjs/plugin/relativeTime";
import { ITopic, TopicUser } from "src/interfaces";

export const dateFromNow = (date: string) => {
  dayjs.extend(relativeTime);
  return dayjs(date).locale(locale.name).fromNow();
};
export const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
export const urlImgRegex = /\.(jpeg|jpg|gif|png|svg)$/;
export const urlVideoRegex = /\.(mp4|avi|mov|flv|wmv|mkv)$/i;
export const linkify = (text: string) => {
  // eslint-disable-next-line no-useless-escape
  let element = text
  if (text.split('?')[0].match(urlImgRegex)) {
    return element = '<image class="message-img" src=" ' + text + ' " alt="" />'
  }
  if (text.split("?")[0].match(urlVideoRegex)) {
    return '<video controls class="message-video"><source src=" ' + text + ' " /></video>'
  }
  if (text.match(urlRegex)) {
    element = text.replace(urlRegex, function (url) {
      return '<a class="linkify-chat" target="blank" href="' + url + '">' + url + "</a>";
    });
  }
  return element
}
export const fileType = (media_url: string) => {
  let type = 'IMAGE'
  if (media_url.split("?")[0].match(urlVideoRegex)) {
    type = 'VIDEO'
  }
  return type
}
export const unique = (arr: any[]) => {
  const result: any[] = []
  for (var i = 0; i < arr.length; i++) {
    if (result.indexOf(arr[i]) < 0) {
      result.push(arr[i])
    }
  }
  return result
}
export const onRenderTopicName = (topic: ITopic) => {
  let name = topic.name || ''
  const uniqueUser = topic.topic_user.reduce((acc: TopicUser[], curr) => {
    const existingUser = acc.find(user => user.user_id === curr.user_id);
    if (!existingUser) {
      acc.push(curr);
    }
    return acc;
  }, []);
  if (uniqueUser.length > 0) {
    name = uniqueUser.map(i => i.user.fullname).join(',')
  }
  return {
    name,
    uniqueUser
  }
}
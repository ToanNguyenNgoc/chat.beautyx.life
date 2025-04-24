export interface LoginBody {
  subdomain: string;
  username: string;
  password: string;
  code?:string;
  verification_id?:string
}

export interface TopicBody {
  org: number | string;
  recipient_id?: number | string;
  group_name?: string
}
export interface MessageBody {
  msg: string;
  topic_id: string;
  reply_id?: string|null;
  media_ids?: number[];
  media_urls?:string[];
}
export interface StoreAllMessageBody {
  msg: string;
  topic_ids: string[];
  reply_id?: string;
  media_ids?: number[];
}
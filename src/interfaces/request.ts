export interface TopicBody {
  org: number | string;
  recipient_id?: number | string;
  group_name?: string
}
export interface MessageBody {
  msg: string;
  topic_id: string;
  reply_id?: string
}
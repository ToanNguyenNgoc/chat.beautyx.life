export interface Response<Context> {
  context: Context;
  message?: string;
  status?: number;
}
export interface ContextData<DataArray> {
  current_page: number;
  data: DataArray;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: [{
    active: boolean;
    label: string;
    url?: string
  }];
  next_page_url?: string;
  path: string;
  per_page: number;
  prev_page_url?: string;
  to: number;
  total: number;
}
export interface ITopic {
  _id: string,
  type: string,
  organization_id: number,
  created_by: number,
  name: string | null,
  updated_at: string,
  created_at: string,
  messages: IMessage[]
}
export interface IMessage {
  _id: string,
  msg: string,
  user_id: number,
  topic_id: string,
  reply_id: null | string,
  updated_at: string,
  created_at: string
}
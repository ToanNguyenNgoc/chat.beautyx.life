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
  organization:{
    name:string;
    subdomain:string;
    id:string|number;
    image:string;
    image_url:string;
  }
  created_by: number,
  name: string | null,
  updated_at: string,
  created_at: string,
  messages: IMessage[],
  topic_user: TopicUser[]
}
export interface TopicUser {
  joined_at: string;
  topic_id: string;
  user: {
    avatar: string | null;
    current_platform: string | null;
    fullname: string;
    id: string;
  },
  user_id: number;
  _id: string;
}
export interface IMessage {
  _id: string,
  msg: string,
  user_id: number,
  topic_id: string,
  reply_id: null | string,
  updated_at?: string,
  created_at: string,
  user:IUser,
}
export interface IUser {
  id: number,
  fullname: string,
  email: string,
  telephone: string | null,
  birthday: string | null,
  gender: string | null,
  token: string,
  token_expired_at: string,
  refresh_token: string,
  avatar: string | null,
  current_platform: string | null,
  ci_api_token: string,
  ci_user: any,
  platform: string,
  roles: string,
  permissions: string
}
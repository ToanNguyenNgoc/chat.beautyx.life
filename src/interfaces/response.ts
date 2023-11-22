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
export interface Organization {
  id: number;
  name: string;
  subdomain: string;
  latitude: number;
  longitude: number;
  address: string;
  min_price: number;
  max_price: number;
  image: string;
  is_momo_ecommerce_enable: boolean;
  created_at: string;
  updated_at: string;
  province_code: number;
  district_code: number;
  ward_code: number;
  full_address: string;
  image_url: string;
  opening_time: any;
  description: string;
  content: string;
  favorites_count: number;
  is_favorite: boolean;
  distance: number | undefined;
  tags: [];
  telephone: [];
  organization_content?: {
    content: string
  }
}
export interface ITopic {
  _id: string,
  type: string,
  organization_id: number,
  organization: {
    name: string;
    subdomain: string;
    id: string | number;
    image: string;
    image_url: string;
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
  media_urls:string[],
  user_id: number,
  topic_id: string,
  reply_id: null | string,
  updated_at?: string,
  created_at: string,
  user: IUser,
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
export interface Media {
  model_id: number;
  original_url: string;
  mine_type: string
}

export interface ICommentChildMedia {
  original_url: string;
}

export interface ICommentChild {
  id?: number;
  body: string;
  user_id: number;
  user: IUser;
  organization_id?: number;
  rate_id?: number;
  commentable_type?: string;
  commentable_id: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: null;
  media_url: string[];
  media: ICommentChildMedia[];
}

export interface Rate {
  id: number;
  point: number;
  user_id: number;
  organization_id: number;
  rateable_type: string; //App\\Models\\CI\\Service,
  rateable_id: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface IComment {
  id: number;
  body: string;
  user_id: number;
  organization_id: null | number;
  rate_id: null | number;
  commentable_type: any;
  commentable_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  rate: Rate;
  user: IUser;
  children: ICommentChild[];
  media_url: string[];
}
export interface BodyComment {
  commentable_type: string;
  commentable_id?: number | string;
  organization_id?: number | string;
  media_ids?: string[] | number[];
  rate?: number;
  body?: string;
}
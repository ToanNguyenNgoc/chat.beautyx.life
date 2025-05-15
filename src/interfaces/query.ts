interface Query {
  p?: number | string;
  l?: number | string;
}
export interface QueryTopic extends Query {
  s?: string;
  sort?: 'updated_at' | '-updated_at',
  org?:string,
  is_only_id?:boolean
}
export interface QueryMessage extends Query {
  topic_id: string;
  sort?: 'created_at' | '-created_at'
}
export interface ParamComment {
  page?: number | string;
  limit?: number | string;
  "filter[commentable_type]"?:
    | "ORGANIZATION"
    | "SERVICE"
    | "PRODUCT"
    | "REPLY_COMMENT";
  "filter[commentable_id]"?: number | string;
  "filter[organization_id]"?: number | string;
  include?: string;
  sort?: string;
  append?: string;
}
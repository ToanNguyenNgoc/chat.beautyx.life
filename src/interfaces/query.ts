interface Query {
  p?: number | string;
  l?: number | string;
}
export interface QueryTopic extends Query {
  s?: string;
  sort?: 'updated_at' | '-updated_at',
  org?:string
}
export interface QueryMessage extends Query {
  topic_id: string;
  sort?: 'created_at' | '-created_at'
}
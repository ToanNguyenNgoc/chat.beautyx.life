import { axiosConfig } from "src/configs"
import {
  BodyComment,
  ContextData,
  IComment,
  IMessage,
  ITopic,
  IUser,
  LoginBody,
  Media,
  MessageBody,
  Organization,
  ParamComment,
  QueryMessage,
  QueryTopic,
  Response,
  StoreAllMessageBody,
  TopicBody
} from "src/interfaces"
import { identity, pickBy } from "lodash";


const apis = {
  postLogin: (body: LoginBody) => {
    return axiosConfig.post(`auth/${body.subdomain}/login`,
      { username: body.username, password: body.password })
      .then<Response<IUser>>(res => res.data)
  },
  getProfile: () => {
    return axiosConfig.get('/users/profile').then(res => res.data)
  },
  getOrganization: (subdomain: string) => {
    return axiosConfig.get(`/organizations/${subdomain}`).then<Response<Organization>>(res => res.data)
  },
  getTopics: (params?: QueryTopic) => {
    return axiosConfig
      .get('/topics', { params })
      .then<Response<ContextData<ITopic[]>>>(res => res.data)
  },
  postTopic: (data: TopicBody) => {
    return axiosConfig
      .post('/topics', data)
      .then<Response<ITopic>>(res => res.data)
  },
  getMessages: (params: QueryMessage) => {
    return axiosConfig
      .get('/messages', { params })
      .then<Response<ContextData<IMessage[]>>>(res => res.data)
  },
  postMessage: (data: MessageBody) => {
    return axiosConfig
      .post('/messages', data)
      .then<Response<IMessage>>(res => res.data)
  },
  postMedia: (formData: FormData) => {
    return axiosConfig.post('/media', formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }).then<Response<Media>>(res => res.data)
  },
  postStoreAllMessage: (body: StoreAllMessageBody) => {
    return axiosConfig
      .post('/messages/storeAllTopic', body)
      .then<Response<IMessage>>(res => res.data)
  },
  getAllComment: (qr: ParamComment) => {
    return axiosConfig
      .get("/comments", {
        params: pickBy(
          {
            ...qr,
            include: "rate|children|children.media",
            append: "media_url",
            sort: "-created_at",
          },
          identity
        ),
      })
      .then<Response<IComment[]>>((res) => res.data);
  },
  createComment : (body: BodyComment) => {
      return axiosConfig
        .post("/comments", pickBy(body, identity))
        .then<Response<IComment>>((res) => res.data);
  }
}
export default apis
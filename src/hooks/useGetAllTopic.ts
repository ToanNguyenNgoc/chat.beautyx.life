import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useContext } from "react"
import apis from "src/apis"
import { AppContext, AppContextType } from "src/context/AppProvider"
import { ContextData, ITopic, Response } from "src/interfaces"
import { CONST } from "src/utils"

type ResponseType = Response<ContextData<ITopic[]>>

export function useGetAllTopic(options?: UseQueryOptions<ResponseType>) {
  const { org } = useContext(AppContext) as AppContextType;
  const query = useQuery({
    queryKey: [CONST.query_key.all_topic],
    queryFn: () => apis.getTopics({ l: 100, org: String(org?.subdomain) }),
    enabled: !!org?.subdomain,
    staleTime:0,
    ...options
  })
  const topics = query.data?.context.data || [];
  const topic_ids = topics.map(item => item._id);
  return Object.assign(query, {
    topics,
    topic_ids
  })
}
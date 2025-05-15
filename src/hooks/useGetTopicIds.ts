import { useQuery } from "@tanstack/react-query"
import { useContext } from "react";
import apis from "src/apis"
import { AppContext, AppContextType } from "src/context/AppProvider";
import { CONST } from "src/utils"

export function useGetTopicIds() {
  const { org } = useContext(AppContext) as AppContextType;
  const query = useQuery({
    queryKey: [CONST.query_key.all_topic_ids],
    queryFn: () => apis.getTopics({ l: 1000, org: org?.subdomain, is_only_id:true }),
    enabled: !!org?.subdomain,
    staleTime: 0
  })
  const topic_ids = query.data?.context.data.map(i => i.id) || [];
  return Object.assign(query, {
    topic_ids
  })
}
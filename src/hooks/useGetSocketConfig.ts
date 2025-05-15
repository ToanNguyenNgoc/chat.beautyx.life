import { useQuery } from "@tanstack/react-query"
import apis from "src/apis"
import { CONST } from "src/utils"

export function useGetSocketConfig() {
  const query = useQuery({
    queryKey: [CONST.query_key.socket_config],
    queryFn: () => apis.getSocketConfig(),
    staleTime: 0
  })
  const config = query.data?.context
  return Object.assign(query, {
    config
  })
}
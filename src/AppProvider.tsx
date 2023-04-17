import Echo from "laravel-echo";
import queryString from "query-string";
import { ReactNode, createContext, useEffect, useState } from "react";
import { echoConfig } from "src/apis";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Pusher = require('pusher-js')

export type AppContextType = {
  echo: Echo | null
}
interface QueryParams {
  token?: string
}
export const AppContext = createContext<AppContextType | null>(null);
export default function AppProvider({ children }: { children: ReactNode }) {
  const query = queryString.parse(window.location.search) as QueryParams;
  const [echo, setEcho] = useState<Echo | null>(null)
  useEffect(() => {
    if (query.token) { setEcho(echoConfig(query.token)) }
    else {
      echoConfig().disconnect()
    }
  }, [query.token])
  const value = { echo };
  return <AppContext.Provider value={value} > {children} </AppContext.Provider>;
}
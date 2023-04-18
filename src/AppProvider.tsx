import Echo from "laravel-echo";
import queryString from "query-string";
import { ReactNode, createContext, useEffect, useState } from "react";
import { echoConfig } from "src/apis";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Pusher = require('pusher-js')

export interface QueryParams {
  token?: string
}
export type AppContextType = {
  echo: Echo | null,
  queryParams: QueryParams
}
export const AppContext = createContext<AppContextType | null>(null);
export default function AppProvider({ children }: { children: ReactNode }) {
  const queryParams = queryString.parse(window.location.search) as QueryParams;
  const [echo, setEcho] = useState<Echo | null>(null)
  const token = queryParams.token ?? window.sessionStorage.getItem('token')
  useEffect(() => {
    if (token) {
      setEcho(echoConfig(token))
      window.sessionStorage.setItem('token', token)
    }
    else {
      echoConfig().disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])
  const value = { echo, queryParams };
  return <AppContext.Provider value={value} > {children} </AppContext.Provider>;
}
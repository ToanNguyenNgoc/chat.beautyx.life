import Echo from "laravel-echo";
import queryString from "query-string";
import { ReactNode, createContext, useEffect, useState } from "react";
import apis from "src/apis";
import { echoConfig } from "src/configs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Pusher = require('pusher-js')

export interface QueryParams {
  token?: string
}
export type AppContextType = {
  echo: Echo | null,
  queryParams: QueryParams,
  user:any
}
export const AppContext = createContext<AppContextType | null>(null);
export default function AppProvider({ children }: { children: ReactNode }) {
  const queryParams = queryString.parse(window.location.search) as QueryParams;
  const [echo, setEcho] = useState<Echo | null>(null)
  const [user, setUser] = useState<any>({})
  const token = queryParams.token ?? window.sessionStorage.getItem('token')
  const getUser = async () => {
    const response = await apis.getProfile()
    setUser(response?.context)
  }
  useEffect(() => {
    if (token) {
      getUser()
      setEcho(echoConfig(token))
      window.sessionStorage.setItem('token', token)
    }
    else {
      echoConfig().disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])
  const value = { echo, queryParams, user };
  return <AppContext.Provider value={value} > {children} </AppContext.Provider>;
}
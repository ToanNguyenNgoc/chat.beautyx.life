
import Echo from "laravel-echo";
import queryString from "query-string";
import { ReactNode, createContext, useEffect, useState } from "react";
import apis from "src/apis";
import { echoConfig } from "src/configs";
import { Organization } from "src/interfaces";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Pusher = require('pusher-js')

export interface QueryParams {
  token?: string;
  subdomain?: string;
}
export type AppContextType = {
  echo: Echo | null,
  queryParams: QueryParams,
  user: any,
  subdomain: string,
  setUser: React.Dispatch<any>,
  setEcho: React.Dispatch<React.SetStateAction<Echo | null>>,
  loadUser: boolean,
  token: any,
  org: Organization | undefined,
  logout: () => void
}
export const AppContext = createContext<AppContextType | null>(null);
export default function AppProvider({ children }: { children: ReactNode }) {
  const queryParams = queryString.parse(window.location.search) as QueryParams;
  const [echo, setEcho] = useState<Echo | null>(null)
  const [user, setUser] = useState<any>({})
  const [org, setOrg] = useState<Organization>()
  const [loadUser, setLoadUser] = useState(true)
  const token = queryParams.token || localStorage.getItem('token')
  const subdomain = queryParams.subdomain || localStorage.getItem('subdomain') || ''
  const getUser = async () => {
    try {
      const response = await apis.getProfile()
      setUser(response?.context)
      setLoadUser(false)
    } catch (error) { setLoadUser(false) }
  }
  useEffect(() => {
    if (subdomain) {
      localStorage.setItem('subdomain', subdomain)
      apis.getOrganization(subdomain).then(res => {
        setOrg(res.context);
        document.title = `${res.context.name} messenger`
      }).catch(err => console.log(err))
    }
    if (token && subdomain) {
      getUser()
      setEcho(echoConfig(token))
      localStorage.setItem('token', token)
    }
    else {
      echoConfig().disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subdomain])
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('subdomain')
    setUser({})
  }
  const value = { echo, queryParams, user, subdomain, setUser, setEcho, loadUser, token, org, logout };
  return <AppContext.Provider value={value} > {children} </AppContext.Provider>;
}
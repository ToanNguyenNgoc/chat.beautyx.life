import Echo from "laravel-echo";
import { ENV } from "./axiosConfig";

export const echoConfig = (token?: string) => {
  const config = new Echo({
    broadcaster: 'pusher',
    key: Number(ENV.e) === 1 ? process.env.REACT_APP_ECHO_KEY : process.env.REACT_APP_ECHO_KEY_DEV,
    cluster: Number(ENV.e) === 1 ? process.env.REACT_APP_ECHO_CLUSTER : process.env.REACT_APP_ECHO_CLUSTER_DEV,
    disableStats: true,
    forceTLS: false,
    wsHost: Number(ENV.e) === 1 ? process.env.REACT_APP_ECHO_WSHOST : process.env.REACT_APP_ECHO_WSHOST_DEV,
    wsPort: Number(ENV.e) === 1 ? process.env.REACT_APP_ECHO_WSPORT : process.env.REACT_APP_ECHO_WSPORT_DEV,
    wssPort: Number(ENV.e) === 1 ? process.env.REACT_APP_ECHO_WSSPORT : process.env.REACT_APP_ECHO_WSSPORT_DEV,
    encrypted: true,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: Number(ENV.e) === 1 ? process.env.REACT_APP_ECHO_AUTH_ENDPOINT : process.env.REACT_APP_ECHO_AUTH_ENDPOINT_DEV,
    auth: {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": ''
      },
    }
  })
  return config
}
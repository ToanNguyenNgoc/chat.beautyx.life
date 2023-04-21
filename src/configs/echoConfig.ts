import Echo from "laravel-echo";

export const echoConfig = (token?: string) => {
  const config = new Echo({
    broadcaster: 'pusher',
    key: process.env.REACT_APP_ECHO_KEY,
    cluster: process.env.REACT_APP_ECHO_CLUSTER,
    disableStats: true,
    forceTLS: false,
    wsHost: process.env.REACT_APP_ECHO_WSHOST,
    wsPort: process.env.REACT_APP_ECHO_WSPORT,
    wssPort: process.env.REACT_APP_ECHO_WSSPORT,
    encrypted: true,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: process.env.REACT_APP_ECHO_AUTH_ENDPOINT,
    auth: {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": ''
      },
    }
  })
  return config
}
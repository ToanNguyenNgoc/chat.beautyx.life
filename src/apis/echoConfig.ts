import Echo from "laravel-echo";

export const echoConfig = (token?: string) => {
  const config = new Echo({
    broadcaster: 'pusher',
    key: 'doelMSn29xZaWDstRtb6',
    cluster: 'DevMyspaAPIs',
    disableStats: true,
    forceTLS: false,
    wsHost: 'devapi.myspa.vn',
    wsPort: 443,
    wssPort: 443,
    encrypted: true,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: 'https://devapi.myspa.vn/broadcasting/auth',
    auth: {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": ''
      },
    }
  })
  return config
}
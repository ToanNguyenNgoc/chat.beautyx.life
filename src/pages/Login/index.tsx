import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { FormEvent, useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apis from 'src/apis'
import 'src/assets/login.css'
import { echoConfig } from 'src/configs'
import { AppContext, AppContextType } from 'src/context/AppProvider'
import { LoginBody } from 'src/interfaces'

interface Error {
  error_email: string | null;
  error_password: string | null
}

export function Login() {
  const { setUser, setEcho } = useContext(AppContext) as AppContextType
  const [error, setError] = useState<Error>({ error_email: null, error_password: null })
  const emailRef = useRef<HTMLInputElement>(null)
  const passRef = useRef<HTMLInputElement>(null)
  const subdomainRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { mutate, isLoading } = useMutation({
    mutationKey: ['LOGIN'],
    mutationFn: (body: LoginBody) => apis.postLogin(subdomainRef.current?.value ?? '', body),
    onSuccess: (res) => {
      setUser(res.context)
      setEcho(echoConfig(res.context.token))
      localStorage.setItem('token', res.context.token)
      localStorage.setItem('subdomain', subdomainRef.current?.value ?? '')
      navigate('/chats')
    },
    onError: (er) => {
      const err = er as AxiosError
      if (err.response?.status === 404) {
        setError({ ...error, error_email: 'Email không đúng' })
      }
      if (err.request?.status === 401) {
        setError({ ...error, error_password: 'Mật khẩu không đúng' })
      }
    },
  })
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (emailRef.current?.value !== '' || passRef.current?.value !== '' || subdomainRef.current?.value) {
      mutate({
        username: emailRef.current?.value ?? '',
        password: passRef.current?.value ?? ''
      })
    } else {
      setError({ ...error, error_password: 'Vui lòng nhập đủ thông tin' })
    }
  }
  const cleanError = () => setError({ error_email: null, error_password: null })
  return (
    <div className='login'>
      <div className="login-card">
        <p className="login-card_title">Myspa Messenger</p>
        <form autoComplete="off" onSubmit={onSubmit} className="login-card_form">
          <div className="input-group mb-3 form-row form-row-subdomain">
            <input
              onFocus={cleanError}
              ref={subdomainRef}
              type="text" className="form-control form-control-subdomain"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
              placeholder='subdomain'
            />
            <div className="domain-display">.myspa.vn</div>
            {error.error_email && <span className="form-row-error">{error.error_email}</span>}
          </div>
          <div className="input-group mb-3 form-row">
            <input
              onFocus={cleanError}
              ref={emailRef}
              type="text" className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
              placeholder='Email'
            />
            {error.error_email && <span className="form-row-error">{error.error_email}</span>}
          </div>
          <div className="input-group mb-3 form-row">
            <input
              onFocus={cleanError}
              ref={passRef}
              type="password" className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
              placeholder='Mật khẩu'
            />
            {error.error_password && <span className="form-row-error">{error.error_password}</span>}
          </div>
          <div className="d-grid login-card_form-bot">
            <div className="form-btn">
              <button className="btn btn-primary" type="submit">Đăng nhập</button>
              <div style={isLoading ? { display: 'flex' } : { display: 'none' }} className="form-btn-load">
                <i className="fa fa-spinner spinner-rote" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
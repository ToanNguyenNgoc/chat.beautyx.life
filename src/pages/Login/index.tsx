import { Button, InputAdornment, TextField } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useFormik } from 'formik'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import apis from 'src/apis'
import icon from 'src/assets/icon'
import 'src/assets/login.css'
import { echoConfig } from 'src/configs'
import { AppContext, AppContextType } from 'src/context/AppProvider'
import { LoginBody } from 'src/interfaces'
import * as Yup from "yup"

export function Login() {
  const { setUser, setEcho } = useContext(AppContext) as AppContextType
  const navigate = useNavigate()
  const { mutateAsync, isLoading } = useMutation({
    mutationKey: ['LOGIN'],
    mutationFn: (body: LoginBody) => apis.postLogin(body),
  })
  const formik = useFormik({
    initialValues: {
      subdomain: '',
      username: '',
      password: ''
    },
    validationSchema: Yup.object({
      subdomain: Yup.string().required('Vui lòng nhập subdomain'),
      username: Yup.string().required('Vui lòng nhập email'),
      password: Yup.string().required('Vui lòng nhập mật khẩu'),
    }),
    onSubmit: async (values, { setErrors, resetForm }) => {
      try {
        const res = await mutateAsync(values)
        setUser(res.context)
        setEcho(echoConfig(res.context.token))
        localStorage.setItem('token', res.context.token)
        localStorage.setItem('subdomain', values.subdomain)
        navigate('/chats')
      } catch (error) {
        const err = error as AxiosError
        if (err.response?.status === 404) return setErrors({ 'username': 'Email không đúng' })
        if (err.request?.status === 401) return setErrors({ 'password': 'Mật khẩu không đúng' })
        return setErrors({ 'password': 'Thông tin đăng nhập không chính xác' })
      }
    }
  })
  return (
    <div className='login'>
      <div className="login-card">
        <img src={icon.myspaIcon} alt="" className="login-card_icon" />
        <p className="login-card_label">Myspa messenger</p>
        <form onSubmit={formik.handleSubmit} className="login-form">
          <div className="login-form_row">
            <TextField
              color='success'
              fullWidth
              name="subdomain"
              onChange={formik.handleChange}
              label='subdomain'
              variant="filled"
              size="small"
              InputProps={{
                endAdornment: <InputAdornment position="start">.myspa.vn</InputAdornment>,
              }}
            />
            {
              formik.touched.subdomain && formik.errors.subdomain &&
              <span className='login-form_row-error'>{formik.errors.subdomain}</span>
            }
          </div>
          <div className="login-form_row">
            <TextField
              name='username' onChange={formik.handleChange}
              color='success'
              fullWidth
              label='Email'
              variant="filled"
              size="small"
            />
            {
              formik.touched.username && formik.errors.username &&
              <span className='login-form_row-error'>{formik.errors.username}</span>
            }
          </div>
          <div className="login-form_row">
            <TextField
              name="password" onChange={formik.handleChange}
              color='success'
              fullWidth
              label='Mật khẩu'
              variant="filled"
              size="small"
              type="password"
            />
            {
              formik.touched.password && formik.errors.password &&
              <span className='login-form_row-error'>{formik.errors.password}</span>
            }
          </div>
          <div className="login-form_bot">
            <div className="login-form_bot-btn">
              <Button
                variant="contained"
                style={{ backgroundColor: "var(--purple)" }}
                type="submit"
                disabled={isLoading}
              >
                {!isLoading ? "Đăng nhập" : "Đang đăng nhập..."}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
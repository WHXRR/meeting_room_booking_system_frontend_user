import type { RegisterUser } from '../views/register/Register'
import api from './config'

export async function login(username: string, password: string) {
  return await api.post('/user/login', {
    username,
    password,
  })
}

export async function register(registerUser: RegisterUser) {
  return await api.post('/user/register', registerUser)
}

export async function registerCaptcha(email: string) {
  return await api.get('/user/register-captcha', {
    params: {
      address: email,
    },
  })
}

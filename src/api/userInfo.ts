import type { UpdateUserInfo } from '../views/update_info/UpdateInfo'
import type { UpdatePassword } from '../views/update_password/UpdatePassword'
import api from './config'

export async function updatePasswordCaptcha(address: string) {
  return await api.get('/user/update_password/captcha', {
    params: { address },
  })
}
export async function updatePassword(updatePassword: UpdatePassword) {
  return await api.post('/user/update_password', updatePassword)
}

export async function getUserInfo() {
  return await api.get('/user/info')
}

export async function updateUserInfo(userInfo: UpdateUserInfo) {
  return await api.post('/user/update', userInfo)
}

export async function updateUserInfoCaptcha() {
  return await api.get('/user/update/captcha')
}

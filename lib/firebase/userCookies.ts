import cookies from 'js-cookie'

export const getUserFromCookie = () => {
  const cookie = cookies.get('auth')
  if (!cookie) {
    return
  }
  return JSON.parse(cookie)
}

export const setUserCookie = (user: any) => {

  cookies.set(
    'auth',
    JSON.stringify(user),
    { expires: 1 / 24 }, //firebase id tokens expire in one hour
  )
}

export const removeUserCookie = () => cookies.remove('auth')
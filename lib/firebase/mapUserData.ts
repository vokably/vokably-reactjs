export type UserData = {
  id: string
  email: string
  token: string
  name: string
  profilePic: string
}

export const mapUserData = (user: any): UserData => {
  const { uid, email, xa, displayName, photoUrl } = user
  return {
    id: uid,
    email,
    token: xa,
    name: displayName,
    profilePic: photoUrl
  }
}
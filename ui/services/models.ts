export type ServiceResult<T> = {
  message?: string
  error: boolean
  data?: T
  IsUnauthorized?: boolean
}

export type User = {
  fullname: string
  email: string
  role: string
}

export type Post = {
  id: string
  userId: string
  content: string
  likes: number
}
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

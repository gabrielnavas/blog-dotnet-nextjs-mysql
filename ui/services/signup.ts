import { ServiceResult } from "./models"

type SignUpParams = {
  fullname: string
  email: string
  password: string
  confirmPassword: string
}


export const signup = async (payload: SignUpParams): Promise<ServiceResult<void>> => {
  const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/signup`
  const response = await fetch(url, {
    method: "POST",
    headers: {
      'Content-Type': "application/json",
      'Accept': "application/json",
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const body = await response.json()
    return {
      message: body.message,
      error: true
    }
  }

  return {
    error: false
  }
}
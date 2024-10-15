import { ServiceResult, User } from "./models"

type SignInParams = {
  email: string
  password: string
}

type SignInResult = {
  token: string
  user: User
}

export const signin = async (payload: SignInParams): Promise<ServiceResult<SignInResult>> => {
  const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/signin`
  const response = await fetch(url, {
    method: "POST",
    headers: {
      'Content-Type': "application/json",
      'Accept': "application/json",
    },
    body: JSON.stringify(payload)
  });

  const body = await response.json()
  if (!response.ok) {
    return {
      message: body.message,
      error: true
    }
  }

  return {
    data: {
      token: body.token as string,
      user: body.user as User
    },
    error: false
  }
}
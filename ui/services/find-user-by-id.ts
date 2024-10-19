import { NotFoundException } from "@/lib/exceptions"
import { ServiceResult, User } from "./models"

type FindUserByIdParams = {
  userId: string
}

type FindUserByIdResult = {
  user: User
}

export const findUserById = (token: string | null) => async (params: FindUserByIdParams): Promise<ServiceResult<FindUserByIdResult>> => {
  const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/user/${params.userId}`

  const headers = new Headers();
  headers.set('Accept', 'application/json')
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(url, {
    method: "GET",
    headers: headers,
  });

  if (response.status === 404) {
    throw new NotFoundException('Usuário não encontrado');
  } else if (response.status === 401 || response.status === 403) {
    return {
      IsUnauthorized: true,
      error: true
    }
  } else if (!response.ok) {
    const body = await response.json()
    return {
      message: body.message,
      error: true
    }
  }

  const body = await response.json();

  return {
    error: false,
    data: {
      user: body.user as User,
    }
  }
}
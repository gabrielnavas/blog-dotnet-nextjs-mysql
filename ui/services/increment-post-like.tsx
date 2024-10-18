import { ServiceResult } from "./models"

type IncrementPostLikeParams = {
  postId: string
}

export const incrementPostLike = (token: string) => async (params: IncrementPostLikeParams): Promise<ServiceResult<void>> => {
  const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/post/${params.postId}/like/increment`
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.status === 401 || response.status === 403) {
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

  return {
    error: false,
  }
}
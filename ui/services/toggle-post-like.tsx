import { ServiceResult } from "./models"

type TogglePostLikeParams = {
  postId: string
}

export const togglePostLike = (token: string) => async (params: TogglePostLikeParams): Promise<ServiceResult<void>> => {
  const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/post/${params.postId}/like`
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
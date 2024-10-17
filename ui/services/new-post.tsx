import { Post, ServiceResult } from "./models"

type NewPostParams = {
  content: string
}

type PostResult = {
  post: Post
}

export const newPost = (token: string) => async (params: NewPostParams): Promise<ServiceResult<PostResult>> => {
  const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/post`
  const response = await fetch(url, {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': "application/json",
      'Accept': "application/json",
    },
    body: JSON.stringify(params)
  });

  const body = await response.json()
  if (response.status === 401 || response.status === 403) {
    return {
      IsUnauthorized: true,
      error: true,
      message: 'Você não está autorizado a criar um novo post.'
    }
  } else if (!response.ok) {
    return {
      message: body.message,
      error: true
    }
  }

  return {
    data: {
      post: body.post,
    },
    error: false
  }
}

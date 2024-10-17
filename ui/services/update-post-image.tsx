import { ServiceResult } from "./models"

type UpdatePostImageParams = {
  postId: string
  image: File
}

export const updatePostImage = (token: string) => async (params: UpdatePostImageParams): Promise<ServiceResult<void>> => {
  const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/post/${params.postId}/image`

  const formData = new FormData()
  formData.set('image', params.image)

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData
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
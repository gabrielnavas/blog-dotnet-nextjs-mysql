import { ServiceResult } from "./models"

type DownloadPostImageParams = {
  postId: string
}

type DownloadPostImageResult = {
  imageUrl: string
}


export const downloadPostImage = (token: string) => async (params: DownloadPostImageParams): Promise<ServiceResult<DownloadPostImageResult>> => {
  const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/post/${params.postId}/image`

  const response = await fetch(url, {
    method: "GET",
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

  const blob: Blob = await response.blob();

  return {
    error: false,
    data: {
      imageUrl: URL.createObjectURL(blob)
    }
  }
}
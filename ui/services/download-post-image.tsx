import { isValidUrl } from "@/lib/utils"
import { ServiceResult } from "./models"

type DownloadPostImageParams = {
  postId: string
}

type DownloadPostImageResult = {
  imageUrl: string
}


export const downloadPostImage = (token: string | null) => async (params: DownloadPostImageParams): Promise<ServiceResult<DownloadPostImageResult | undefined>> => {
  const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/post/${params.postId}/image`

  const headers = new Headers();
  if(token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
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

  const imageUrl = URL.createObjectURL(blob);
  if (isValidUrl(imageUrl) || imageUrl.includes("image")) {
    return {
      error: false,
      data: {
        imageUrl,
      }
    }
  }

  return {
    error: false,
    data: undefined
  }
}
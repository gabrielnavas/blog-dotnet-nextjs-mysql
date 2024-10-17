import { Post, ServiceResult } from "./models"

type FindPostsResult = {
  posts: Post[]
}

export const findPosts = (token: string) => async (): Promise<ServiceResult<FindPostsResult>> => {
  const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/post`
  const response = await fetch(url, {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
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

  const body = await response.json();

  return {
    error: false,
    data: {
      posts: body.posts,
    }
  }
}
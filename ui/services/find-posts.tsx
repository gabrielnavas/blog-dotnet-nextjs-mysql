import { Post, ServiceResult } from "./models"

type FindPostsResult = {
  posts: Post[]
}

export const findPosts = (token: string | null) => async (): Promise<ServiceResult<FindPostsResult>> => {
  const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/post`
  const headers = new Headers();
  headers.set('Accept', 'application/json')
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
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

  const body = await response.json();
  return {
    error: false,
    data: {
      posts: body.posts,
    }
  }
}

type RemovePostParams = {
  postId: string
}
export const removePost = (token: string) =>
  async (params: RemovePostParams) => {
    const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/post/${params.postId}`

    const response = await fetch(url, {
      method: "DELETE",
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
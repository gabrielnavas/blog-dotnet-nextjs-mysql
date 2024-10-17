'use client'

import { Post } from "@/services/models";
import { newPost } from "@/services/new-post";
import React, { useCallback, useContext, useEffect } from "react";
import { AuthContext, AuthContextType } from "./auth-context";
import { BadRequestException, UnauthorizedException } from "@/lib/exceptions";
import { updatePostImage } from "@/services/update-post-image";
import { findPosts } from "@/services/find-posts";

export type FeedContextType = {
  posts: Post[]
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  handleNewPost: (content: string, image?: File) => Promise<void>
}

const inititalData = {
  posts: [],
  isLoading: false,
  setIsLoading: () => { },
  handleNewPost: () => Promise.resolve()
} as FeedContextType

export const FeedContext = React.createContext<FeedContextType | null>(null)

type Props = {
  children: React.ReactNode
}

export const FeedProvider: React.FC<Props> = ({ children }) => {
  const [data, setData] = React.useState<FeedContextType>(inititalData)

  const { token } = useContext(AuthContext) as AuthContextType

  useEffect(() => {
    if (!token) {
      return;
    }
    (async () => {
      const result = await findPosts(token)()
      if (result.IsUnauthorized) {
        throw new UnauthorizedException();
      }
      else if (result.error) {
        throw new BadRequestException(result.message || 'Algo aconteceu!');
      } else if (!result.data) {
        throw new BadRequestException('Algo aconteceu!');
      } else {
        setData(prev => ({
          ...prev,
          posts: result.data!.posts,
        }))
      }
    })()
  }, [token])

  const setIsLoading = useCallback((isLoading: boolean) => {
    setData(prev => ({
      ...prev,
      isLoading,
    }))
  }, [])

  const handleNewPost = useCallback(async (content: string, image?: File) => {
    if (!token) {
      return
    }
    const resultNewPost = await newPost(token)({
      content,
    })
    if (resultNewPost.error) {
      if (resultNewPost.IsUnauthorized) {
        throw new UnauthorizedException()
      } else {
        throw new BadRequestException(resultNewPost.message || 'Algo aconteceu. Tente novamente mais tarde');
      }
    } else if (image) {
      if (!resultNewPost.data) {
        throw new BadRequestException('Algo aconteceu. Tente novamente mais tarde');
      }
      const updatePostImageResult = await updatePostImage(token)({
        postId: resultNewPost.data?.post.id,
        image,
      })
      if (updatePostImageResult.error) {
        if (updatePostImageResult.IsUnauthorized) {
          throw new UnauthorizedException()
        }
      } else {
        const newPost = { ...resultNewPost.data.post }
        setData(prev => ({
          ...prev,
          posts: [newPost]
        }))
      }
    }
  }, [token])


  return (
    <FeedContext.Provider value={{
      posts: data.posts,
      isLoading: data.isLoading,
      handleNewPost: handleNewPost,
      setIsLoading: setIsLoading,
    }}>
      {children}
    </FeedContext.Provider>
  )
} 
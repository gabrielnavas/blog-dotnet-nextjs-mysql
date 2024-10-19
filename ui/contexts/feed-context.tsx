'use client'

import React, { useCallback, useContext, useEffect } from "react";

import { Post } from "@/services/models";
import { newPost } from "@/services/new-post";
import { updatePostImage } from "@/services/update-post-image";
import { findPosts } from "@/services/find-posts";
import { togglePostLike } from "@/services/toggle-post-like";

import { BadRequestException, UnauthorizedException } from "@/lib/exceptions";

import { AuthContext, AuthContextType } from "./auth-context";
import { removePost } from "@/services/remove-post";

export type FeedContextType = {
  posts: Post[]

  isLoadingNewPost: boolean
  isLoadingFindPosts: boolean
  setIsLoadingNewPost: (isLoading: boolean) => void,
  setIsLoadingFindPosts: (isLoading: boolean) => void,

  handleLoadPosts: () => Promise<void>
  handleNewPost: (content: string, image?: File) => Promise<void>
  handleLike: (postId: string) => Promise<void>
  handleRemovePost: (postId: string) => Promise<void>
}

const inititalData = {
  posts: [],
  isLoadingNewPost: false,
  isLoadingFindPosts: false,
  setIsLoadingNewPost: () => Promise.resolve(),
  setIsLoadingFindPosts: () => Promise.resolve(),
  handleLoadPosts: () => Promise.resolve(),
  handleNewPost: () => Promise.resolve(),
  handleLike: () => Promise.resolve(),
  handleRemovePost: () => Promise.resolve(),
} as FeedContextType

export const FeedContext = React.createContext<FeedContextType | null>(null)

type Props = {
  children: React.ReactNode
}

export const FeedProvider: React.FC<Props> = ({ children }) => {
  const [data, setData] = React.useState<FeedContextType>(inititalData)

  const { token, isAuth } = useContext(AuthContext) as AuthContextType

  const setIsLoadingNewPost = useCallback((isLoading: boolean) => {
    setData(prev => ({ ...prev, isLoadingNewPost: isLoading }))
  }, [])


  const setIsLoadingFindPosts = useCallback((isLoading: boolean) => {
    setData(prev => ({ ...prev, isLoadingFindPosts: isLoading }))
  }, [])

  useEffect(() => {
    const changeStateBySignOut = () => {
      if (!isAuth) {
        setData(prev => ({
          ...prev,
          posts: prev.posts.map(post => ({ ...post, loggedUserLiked: false })),
        }))
      }
    }

    changeStateBySignOut();
  }, [isAuth])


  const handleLoadPosts = useCallback(async () => {
    if (typeof token !== 'string') {
      return
    }
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
  }, [token])

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
          posts: [newPost, ...prev.posts]
        }))
      }
    }
  }, [token])

  const handleLike = useCallback(async (postId: string): Promise<void> => {
    if (typeof token !== 'string' || token.length === 0) {
      return;
    }
    const result = await togglePostLike(token)({ postId });
    if (result.error) {
      if (result.IsUnauthorized) {
        throw new UnauthorizedException()
      } else {
        throw new BadRequestException(result.message || 'Algo aconteceu. Tente novamente mais tarde');
      }
    } else {
      const postIndex = data.posts.findIndex(post => post.id === postId);
      const newPosts = [...data.posts];
      if (postIndex >= 0) {
        if (newPosts[postIndex].loggedUserLiked) {
          newPosts[postIndex].likes--
          newPosts[postIndex].loggedUserLiked = false;
        } else {
          newPosts[postIndex].likes++
          newPosts[postIndex].loggedUserLiked = true;
        }
      }
      setData(prev => ({
        ...prev,
        posts: newPosts
      }));
    }
  }, [token, data.posts])

  const handleRemovePost = useCallback(async (postId: string) => {
    if(token) {
      await removePost(token)({postId})
      setData(prev => ({
        ...prev,
        posts: prev.posts.filter(post => post.id !== postId)
      }))
    }
  }, [token])

  return (
    <FeedContext.Provider value={{
      posts: data.posts,

      isLoadingNewPost: data.isLoadingNewPost,
      isLoadingFindPosts: data.isLoadingFindPosts,

      setIsLoadingNewPost,
      setIsLoadingFindPosts,

      handleLoadPosts,
      handleNewPost,
      handleLike,
      handleRemovePost,
    }}>
      {children}
    </FeedContext.Provider>
  )
} 
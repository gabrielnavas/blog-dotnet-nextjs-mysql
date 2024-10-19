import React, { useCallback, useState } from "react"

import Image from "next/image"

import { AuthContext, AuthContextType } from "@/contexts/auth-context"
import { FeedContext, FeedContextType } from "@/contexts/feed-context"

import { Post as PostModel } from "@/services/models"


import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loading } from "@/components/loading"
import { ThumbsUp } from "lucide-react"
import { AuthModal } from "../auth/auth-modal"
import { usePostImage } from "./use-post-image"
import { useFindOwner } from "./use-find-owner"

type Props = {
  post: PostModel
}

export const Post: React.FC<Props> = ({ post }) => {

  const [showSignInModal, setShowSignModal] = useState(false)

  const { isAuth } = React.useContext(AuthContext) as AuthContextType
  const { handleLike } = React.useContext(FeedContext) as FeedContextType

  const [isLoadingLike, setIsLoadingLike] = useState(false)

  const { imageUrl, isLoadingImage } = usePostImage(post.id);
  const { isLoadingOwner, ownerPost } = useFindOwner(post.userId);

  const onClickLike = useCallback(async () => {
    if (!isAuth) {
      setShowSignModal(true)
      return;
    }
    try {
      setIsLoadingLike(true)
      await handleLike(post.id)
    } catch {

    } finally {
      setIsLoadingLike(false)
    }
  }, [handleLike, post.id, isAuth])

  return (
    <Card className="w-[550px]">
      <CardContent className="flex flex-col gap-4 p-5">
        <AuthModal
          isOpen={showSignInModal}
          onOpenChange={open => setShowSignModal(open)} />
        {
          isLoadingOwner
            ? (
              <Loading />
            ) : (
              <h4 className="text-zinc-400">- {ownerPost?.fullname}</h4>
            )
        }
        <div>{post.content}</div>
        <div>
          {
            imageUrl && imageUrl.length > 0 && (
              isLoadingImage
                ? (
                  <Loading />
                ) : (
                  <Image
                    src={imageUrl}         // URL da imagem
                    alt="imagem"           // Texto alternativo
                    width="0"
                    height="0"
                    sizes="100vw"
                    className="w-full h-auto"
                  />
                )
            )
          }
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          disabled={isLoadingLike}
          className="flex ps-5 pe-5 gap-3"
          variant='outline'
          onClick={onClickLike}>
          {
            post.loggedUserLiked
              ? (
                <ThumbsUp size={15} className="stroke-red-500" />
              ) : (
                <ThumbsUp size={15} className="stroke-slate-700" />
              )
          }
          <span>{post.likes}</span>
        </Button>
      </CardFooter>
    </Card>
  )
}

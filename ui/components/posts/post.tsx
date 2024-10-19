import React, { useCallback, useContext } from "react"

import Image from "next/image"

import { AuthContext, AuthContextType } from "@/contexts/auth-context"

import { Post as PostModel } from "@/services/models"


import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loading } from "@/components/loading"
import { Menu, ThumbsUp, Trash2 } from "lucide-react"
import { AuthModal } from "../auth/auth-modal"
import { usePostImage } from "./use-post-image"
import { useFindOwner } from "./use-find-owner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useLike } from "./use-like"
import { FeedContext, FeedContextType } from "@/contexts/feed-context"

type Props = {
  post: PostModel
}

export const Post: React.FC<Props> = ({ post }) => {

  const { isAuth } = React.useContext(AuthContext) as AuthContextType

  const { handleRemovePost } = useContext(FeedContext) as FeedContextType

  const { imageUrl, isLoadingImage } = usePostImage(post.id);
  const { isLoadingOwner, ownerPost } = useFindOwner(post.userId);

  const {
    isLoadingLike,
    onClickLike,
    showSignInModal,
    setShowSignModal
  } = useLike(post.id)

  const removePostOnClick = useCallback(async () => {
    await handleRemovePost(post.id)
  }, [handleRemovePost, post.id])

  return (
    <>
      <AuthModal
        isOpen={showSignInModal}
        onOpenChange={open => setShowSignModal(open)} />


      <Card className="w-[550px]">
        <CardHeader>
          <div className="flex justify-between">
            {isLoadingOwner
              ? (
                <Loading />
              ) : (
                <div>
                  <h4 className="text-zinc-400">- {ownerPost?.fullname}</h4>
                </div>
              )}

            {isAuth && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Menu />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuLabel>Opções</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={removePostOnClick}
                      className="flex gap-3 cursor-pointer">
                      <Trash2 className="stroke-red-600" size={19} />
                      <span>Remover</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-5">
          <div>{post.content}</div>
          <div>
            {imageUrl && imageUrl.length > 0 && (
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
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            disabled={isLoadingLike}
            className="flex ps-5 pe-5 gap-3"
            variant='outline'
            onClick={onClickLike}>
            {post.loggedUserLiked
              ? (
                <ThumbsUp size={15} className="stroke-red-500" />
              ) : (
                <ThumbsUp size={15} className="stroke-slate-700" />
              )}
            <span>{post.likes}</span>
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}

import React from "react"

import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { AuthContext, AuthContextType } from "@/contexts/auth-context"
import { FeedContext, FeedContextType } from "@/contexts/feed-context"
import { BadRequestException, UnauthorizedException } from "@/lib/exceptions"

export const useRemovePost = (postId: string) => {

  const { signInRoute } = React.useContext(AuthContext) as AuthContextType
  const { handleRemovePost } = React.useContext(FeedContext) as FeedContextType

  const [isLoadingRemovePost, setIsLoadingRemovePost] = React.useState(false)

  const router = useRouter()

  const removePostOnClick = React.useCallback(async () => {
    try {
      setIsLoadingRemovePost(true)
      await handleRemovePost(postId)
      toast({
        title: 'Post removido!',
      })
    } catch (ex) {
      if (ex instanceof UnauthorizedException) {
        toast({
          title: 'Ooops!',
          description: ex.message,
        })
        // TODO: fazer um handler pra  isso dentro de AuthContext
        router.replace(signInRoute);

      } else if (ex instanceof BadRequestException) {
        toast({
          title: 'Ooops!',
          description: ex.message,
        })
      }
    } finally {
      setIsLoadingRemovePost(false)
    }
  }, [
    handleRemovePost,
    router,
    signInRoute,
    postId,
  ])

  return {
    removePostOnClick, isLoadingRemovePost
  }
}

import React, { useContext } from "react";

import { FeedContext, FeedContextType } from "@/contexts/feed-context";
import { AuthContext, AuthContextType } from "@/contexts/auth-context";

export const useLike = (postId: string) => {
  const [showSignInModal, setShowSignModal] = React.useState(false)

  const [isLoadingLike, setIsLoadingLike] = React.useState(false)

  const { isAuth } = useContext(AuthContext) as AuthContextType
  const { handleLike } = React.useContext(FeedContext) as FeedContextType

  const onClickLike = React.useCallback(async () => {
    if (!isAuth) {
      setShowSignModal(true)
      return;
    }
    try {
      setIsLoadingLike(true)
      await handleLike(postId)
    } catch {

    } finally {
      setIsLoadingLike(false)
    }
  }, [handleLike, postId, isAuth])

  return { isLoadingLike, onClickLike, showSignInModal, setShowSignModal }
}

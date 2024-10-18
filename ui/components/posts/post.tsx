import React, { useCallback, useEffect, useState } from "react"

import Image from "next/image"

import { AuthContext, AuthContextType } from "@/contexts/auth-context"
import { FeedContext, FeedContextType } from "@/contexts/feed-context"

import { downloadPostImage } from "@/services/download-post-image"
import { Post as PostModel, User } from "@/services/models"
import { findUserById } from "@/services/find-user-by-id"


import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loading } from "@/components/loading"
import { ThumbsUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

type Props = {
  post: PostModel
}

export const Post: React.FC<Props> = ({ post }) => {

  const [imageUrl, setImageUrl] = React.useState<string>('')

  const { token } = React.useContext(AuthContext) as AuthContextType
  const { handleLike } = React.useContext(FeedContext) as FeedContextType

  const [isLoadingImage, setIsLoadingImage] = useState(false)
  const [isLoadingOwner, setIsLoadingOwner] = useState(false)
  const [isLoadingLike, setIsLoadingLike] = useState(false)

  const [ownerPost, setOwnerPost] = useState<User | null>(null)

  const route = useRouter()
  const { toast } = useToast()

  React.useEffect(() => {
    const loadPostImage = async () => {
      if (typeof token !== 'string' || token.length === 0) {
        return
      }

      try {
        setIsLoadingImage(true)
        const result = await downloadPostImage(token)({ postId: post.id })
        if (result.IsUnauthorized) {
          toast({
            title: 'Oops!',
            description: result.message || 'Sem autorização.',
          })
          route.replace('/signin')
        } else if (result.error) {
          console.log(result.error)
        } else if (result.data) {
          setImageUrl(result.data!.imageUrl)
        }
      } catch {
        toast({
          title: 'Oops!',
          description: 'Algo aconteceu. Tente novamente mais tarde!',
        })
      }
      finally {
        setIsLoadingImage(false)
      }
    }

    loadPostImage()
  }, [token, post.id, route, toast])

  useEffect(() => {
    const findOwner = async () => {
      if (typeof token !== 'string' || token.length === 0) {
        return
      }

      try {
        setIsLoadingOwner(true)
        const result = await findUserById(token)({ userId: post.userId })

        if (result.IsUnauthorized) {
          toast({
            title: 'Oops!',
            description: result.message || 'Sem autorização.',
          })
          route.replace('/signin')
        } else if (result.error) {
          console.log(result.error)
          toast({
            title: 'Oops!',
            description: result.message || 'Algo aconteceu!',
          })
        } else if (!result.data) {
          toast({
            title: 'Oops!',
            description: result.message || 'Algo aconteceu. Tente novamente mais tarde!',
          })
        } else {
          setOwnerPost(result.data!.user)
          setIsLoadingOwner(false)
        }
      } catch {
        toast({
          title: 'Oops!',
          description: 'Algo aconteceu. Tente novamente mais tarde!',
        })
      }
      finally {

      }
    }

    findOwner()
  }, [post.userId, token, route, toast])

  const onClickLike = useCallback(async () => {
    try {
      setIsLoadingLike(true)
      await handleLike(post.id)
    } catch {

    } finally {
      setIsLoadingLike(false)
    }
  }, [handleLike, post.id])


  return (
    <Card className="w-[550px]">
      <CardContent className="flex flex-col gap-4 p-5">
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
                    layout="responsive"    // A imagem ajustará a largura ao contêiner pai
                    width={100}            // Largura base usada para cálculo da proporção
                    height={50}            // Altura base usada para cálculo da proporção (2:1 neste caso)
                    alt="imagem"           // Texto alternativo
                    loading="lazy"         // Carregamento preguiçoso (lazy loading)
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
              <ThumbsUp size={15} className="stroke-red-500"  />
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

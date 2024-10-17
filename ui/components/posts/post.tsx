import React, { useEffect, useState } from "react";

import { AuthContext, AuthContextType } from "@/contexts/auth-context";
import { downloadPostImage } from "@/services/download-post-image";

import { Card, CardContent } from "../ui/card";
import { Post as PostModel, User } from "@/services/models";
import Image from "next/image";
import { LoaderCircle } from "lucide-react";
import { findUserById } from "@/services/find-user-by-id";

type Props = {
  post: PostModel
}

export const Post: React.FC<Props> = ({ post }) => {

  const [imageUrl, setImageUrl] = React.useState<string>('');
  const { token } = React.useContext(AuthContext) as AuthContextType

  const [isLoadingImage, setIsLoadingImage] = useState(false)
  const [isLoadingOwner, setIsLoadingOwner] = useState(false)


  const [ownerPost, setOwnerPost] = useState<User | null>(null);

  React.useEffect(() => {


    const loadPostImage = async () => {
      if (typeof token !== 'string' || token.length === 0) {
        return
      }

      try {
        setIsLoadingImage(true)
        const result = await downloadPostImage(token)({ postId: post.id });
        if (result.IsUnauthorized) {

        } else if (result.error) {

        } else if (!result.data) {

        } else {
          setImageUrl(result.data!.imageUrl)
        }
      } catch {

      }
      finally {
        setIsLoadingImage(false)
      }
    };


    loadPostImage();
  }, [token, post.id])

  useEffect(() => {
    const findOwner = async () => {
      if (typeof token !== 'string' || token.length === 0) {
        return
      }


      try {
        setIsLoadingOwner(true)
        const result = await findUserById(token)({ userId: post.userId });
        if (result.IsUnauthorized) {

        } else if (result.error) {

        } else if (!result.data) {

        } else {
          setOwnerPost(result.data!.user)
          setIsLoadingOwner(false)
        }
      } catch {

      }
      finally {

      }
    };

    findOwner();
  }, [post.userId, token])


  return (
    <Card className="w-[550px]">
      <CardContent className="flex flex-col gap-4 p-5">
        {
          isLoadingOwner
            ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <h4 className="text-zinc-400">- {ownerPost?.fullname}</h4>
            )
        }
        <div>{post.content}</div>
        <div >
          {
            isLoadingImage
              ? (
                <LoaderCircle className="animate-spin" />
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
          }
        </div>
      </CardContent>
    </Card>
  )
}

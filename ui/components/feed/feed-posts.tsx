import React, { FC } from "react";

import { useRouter } from "next/navigation";

import { useToast } from "@/hooks/use-toast";


import { Post } from "@/components/posts/post";

import { FeedContext, FeedContextType } from "@/contexts/feed-context";
import { BadRequestException, UnauthorizedException } from "@/lib/exceptions";

import { Loading } from "@/components/loading";

export const FeedPosts: FC = () => {
  const {
    posts,
    handleLoadPosts,
    setIsLoadingFindPosts,
    isLoadingFindPosts
  } = React.useContext(FeedContext) as FeedContextType

  const { toast } = useToast();
  const route = useRouter();

  React.useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoadingFindPosts(true);
        await handleLoadPosts();
      }
      catch (ex) {
        if (ex instanceof BadRequestException) {
          toast({
            title: 'Ooops!',
            description: ex.message || 'Algo aconteceu. Tente novamente mais tarde'
          })
        } else if (ex instanceof UnauthorizedException) {
          toast({
            title: 'Ooops!',
            description: ex.message || 'Algo aconteceu. Tente novamente mais tarde'
          })
          route.replace('/signin')
        } else {
          toast({
            title: 'Ooops!',
            description: 'Algo aconteceu. Tente novamente mais tarde'
          })
        }
      } finally {
        setIsLoadingFindPosts(false);
      }
    }

    loadPosts();
  }, [handleLoadPosts, setIsLoadingFindPosts, route, toast])

  return (
    <div className="flex flex-col mt-10 gap-5">
      {
        isLoadingFindPosts ? (
          <Loading description="Carregando posts..." />
        ) : (
          posts.map(post => <Post key={post.id} post={post} />)
        )
      }
    </div>
  );
}

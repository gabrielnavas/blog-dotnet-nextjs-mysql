import { FC } from "react";

import { Post } from "@/components/posts/post";
import { FeedContext, FeedContextType } from "@/contexts/feed-context";
import { useContext } from "react";

export const FeedPosts: FC = () => {
  const { posts } = useContext(FeedContext) as FeedContextType

  return (
    <div className="flex flex-col mt-10 gap-5">
      {
        posts.map(post => <Post key={post.id} post={post} />)
      }
    </div>
  );
}

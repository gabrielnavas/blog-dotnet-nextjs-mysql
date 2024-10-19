'use client'

import { FeedPosts } from "@/components/feed/feed-posts";
import { NewPostForm } from "@/components/feed/new-post-form";
import { AuthContext, AuthContextType } from "@/contexts/auth-context";
import { useContext } from "react";

export default function Page() {

  const { isAuth } = useContext(AuthContext) as AuthContextType

  return (
    <div className="flex flex-col items-center p-10">
      {isAuth && (
        <NewPostForm />
      )}
      <FeedPosts />
    </div>
  );
}

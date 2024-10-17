'use client'

import { FeedPosts } from "@/components/feed/feed-posts";
import { NewPostForm } from "@/components/feed/new-post-form";

export default function Page() {

  return (
    <div className="flex flex-col items-center p-10">
      <NewPostForm />
      <FeedPosts />
    </div>
  );
}

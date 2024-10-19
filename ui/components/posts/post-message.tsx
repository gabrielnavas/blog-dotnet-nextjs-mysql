import { FC } from "react";
import { PostContainer } from "./post-container";
import { CardContent } from "../ui/card";

type Props = {
  message: string
}

export const PostMessage: FC<Props> = ({ message }) => {
  return (
    <PostContainer>
      <CardContent className="flex justify-center items-center p-5">
        <h3 className="font-semibold">{message}</h3>
      </CardContent>
    </PostContainer>
  );
}

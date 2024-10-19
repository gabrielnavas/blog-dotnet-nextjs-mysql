import React, { FC } from "react";
import { Card } from "../ui/card";

interface IPostContainerProps {
  children: React.ReactNode
};

export const PostContainer: FC<IPostContainerProps> = ({
  children
}) => {
  return (
    <Card className="w-[550px]">
      {children}
    </Card>
  );
}

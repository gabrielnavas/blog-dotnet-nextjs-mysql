import { LoaderCircle } from "lucide-react";
import { FC } from "react";

interface ILoadingProps {
  description?: string
};

export const Loading: FC<ILoadingProps> = ({ description }) => {
  return (
    <div className="flex gap-2">
      {
        description && (
          <div>{description}</div>
        )
      }
      <LoaderCircle className="animate-spin" />
    </div>
  );
}

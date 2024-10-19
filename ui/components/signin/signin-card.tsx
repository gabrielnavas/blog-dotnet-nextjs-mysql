import { FC } from "react";

import {
  Card,
  CardContent,
  CardHeader
} from "@/components/ui/card";

import { SignInForm } from "@/components/signin/signin-form";

type Props = {
  showButtonNotHaveAccountYet?: boolean
}

export const SignInCard: FC<Props> = ({ showButtonNotHaveAccountYet }) => {
  return (
    <Card className="p-3">
      <CardHeader>
        <div className="text-lg font-bold">Entre com suas credenciais</div>
      </CardHeader>
      <CardContent>
        <SignInForm showButtonNotHaveAccountYet={
          showButtonNotHaveAccountYet
            ? showButtonNotHaveAccountYet
            : false
        } />
      </CardContent>
    </Card>
  );
}

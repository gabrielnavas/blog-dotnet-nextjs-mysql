import { FC } from "react";

import {
  Card,
  CardContent,
  CardHeader
} from "@/components/ui/card";
import { SignUpForm } from "./signup-form";

type Props = {
  showButtonAlreadyHasAccount?: boolean
}

export const SignUpCard: FC<Props> = ({ showButtonAlreadyHasAccount }) => {
  return (
    <Card className="p-3">
      <CardHeader>
        <div className="text-lg font-bold">Criar conta</div>
        <div className="text-sm">Forneça alguns dados para criar a sua conta</div>
      </CardHeader>
      <CardContent>
        <SignUpForm showButtonAlreadyHasAccount={
          showButtonAlreadyHasAccount
            ? showButtonAlreadyHasAccount
            : false
        } />
      </CardContent>
    </Card>
  );
}

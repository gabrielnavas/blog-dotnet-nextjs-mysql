import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { SignInCard } from "../signin/signin-card"
import { SignUpCard } from "../signup/signup-card"
import { LogIn, UserRoundPlus } from "lucide-react"

export function AuthTabs() {
  return (
    <Tabs defaultValue="signin" className="px-5 py-10">
      <TabsList className="grid w-full grid-cols-2 gap-1">
        <TabsTrigger value="signin" className="flex gap-3  hover:dark:bg-white hover:bg-slate-900  hover:dark:text-slate-900 hover:text-white">
          <UserRoundPlus size={18} />
          Entrar
        </TabsTrigger>
        <TabsTrigger value="signup" className="flex gap-3  hover:dark:bg-white hover:bg-slate-900  hover:dark:text-slate-900 hover:text-white">
          <LogIn size={18} />
          Criar conta
        </TabsTrigger>
      </TabsList>
      <TabsContent value="signin">
        <SignInCard showButtonNotHaveAccountYet={false} />
      </TabsContent>
      <TabsContent value="signup">
        <SignUpCard showButtonAlreadyHasAccount={false} />
      </TabsContent>
    </Tabs>
  )
}

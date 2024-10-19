"use client"

import { useCallback, useContext } from "react"
import { LogOutIcon, Moon, Rss, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "./ui/card"
import { useRouter } from "next/navigation"
import { AuthContext, AuthContextType } from "@/contexts/auth-context"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import { AvatarFallback } from "./ui/avatar"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"



export const Header: React.FC = () => {
  const { setTheme } = useTheme()

  const { isLoading, isAuth, handleSignOut, user } = useContext(AuthContext) as AuthContextType

  const route = useRouter()
  const { toast } = useToast()

  const onClickSignOut = useCallback(() => {
    handleSignOut()
    route.replace("/signin")
    toast({
      title: 'Até mais 👋👋'
    })
  }, [handleSignOut, route, toast])


  return (
    <Card>
      <CardContent className="flex justify-between items-center ps-5 pe-5 pt-3 pb-3">
        <div className="flex">
          <h2 className="flex gap-2 items-center scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0">
            <Rss />
            <Link href='/'>Fofoca News</Link>
          </h2>
        </div>
        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div>
            {
              isAuth ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>

                    <Avatar className="cursor-pointer">
                      <AvatarImage src="#" alt="@shadcn" />
                      <AvatarFallback className="p-2">{`${user!.fullname[0]}${user!.fullname[1]}`}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Opções</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={onClickSignOut} className="cursor-pointer">
                        <LogOutIcon className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={() => route.push('/signin')} disabled={isLoading}>
                  Entrar
                </Button>
              )
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

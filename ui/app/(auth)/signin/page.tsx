'use client'

import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'

import {
  Card,
  CardContent
} from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCallback, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext, AuthContextType } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

type FormSchema = z.infer<typeof formSchema>

export default function Page() {

  const { handleSignIn, setIsLoading } = useContext(AuthContext) as AuthContextType

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema)
  })

  const { toast } = useToast()
  const route = useRouter()

  const onSubmit = useCallback(async ({ email, password }: FormSchema) => {
    try {
      setIsLoading(true)
      await handleSignIn(email, password)
      route.push('/')
      toast({
        title: "Seja bem-vindo(a)",
      })
    } catch (ex) {
      if (ex instanceof Error) {
        toast({
          title: "Ooops!",
          description: ex.message,
          variant: 'destructive'
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [handleSignIn, toast, route, setIsLoading])

  return (
    <Card>
      <CardContent className="p-6">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="batman@email.com" {...field} />
                  </FormControl>
                  <FormDescription>O e-mail da sua conta.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormDescription>A senha da sua conta.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-5">
              <Button>Entrar</Button>
              <Button
                onClick={() => route.push('/signup')}
                type="button"
                variant='outline'>
                Ainda não tenho uma conta
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}

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
import { signup } from "@/services/signup";

const formSchema = z.object({
  fullname: z.string(),
  email: z.string().email(),
  password: z.string(),
  confirmPassword: z.string(),
})

type FormSchema = z.infer<typeof formSchema>

export default function Page() {

  const { setIsLoading } = useContext(AuthContext) as AuthContextType

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema)
  })

  const { toast } = useToast()
  const route = useRouter()

  const onSubmit = useCallback(async ({ fullname, email, password, confirmPassword }: FormSchema) => {
    try {
      setIsLoading(true)
      await signup({ fullname, email, password, confirmPassword })
      route.push('/signin')
      toast({
        title: "Conta criada",
        description: "Agora entre com sua conta!",
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
  }, [toast, route, setIsLoading])

  return (
    <Card>
      <CardContent className="p-6">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="John Way" {...field} />
                  </FormControl>
                  <FormDescription>Nome completo para melhor atender.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="batman@email.com" {...field} />
                  </FormControl>
                  <FormDescription>O e-mail para manter o contato e usar como autenticação.</FormDescription>
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
                  <FormDescription>Digite uma senha difícil.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>Confirmação de senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormDescription>Confirme a mesma senha digitada.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-5">
              <Button>Entrar</Button>
              <Button
                onClick={() => route.push('/signin')}
                type="button"
                variant='outline'>
                Já tenho uma conta
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}

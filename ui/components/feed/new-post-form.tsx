'use client'

import React, { useCallback, useContext } from "react";
import { z } from 'zod'
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";


import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { 
  FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage 
} from "../ui/form";
import { FeedContext, FeedContextType } from "@/contexts/feed-context";
import { BadRequestException, UnauthorizedException } from "@/lib/exceptions";

const formSchema = z.object({
  content: z.string({ message: 'Digite o que está pensando.' })
    .min(1, 'Digite o que está pensando.')
    .max(255, 'Pensamento máximo de 255 caracteres.'),
})

type FormSchema = z.infer<typeof formSchema>

type ImageForm = {
  image: File | undefined
  localImageUrl: string
}

export const NewPostForm: React.FC = () => {
  const [imageForm, setImageForm] = React.useState<ImageForm>({
    image: undefined,
    localImageUrl: ''
  })
  const ref = React.useRef<HTMLInputElement>(null)

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema)
  })

  const {
    handleNewPost,
    isLoadingNewPost,
    setIsLoadingNewPost
  } = useContext(FeedContext) as FeedContextType

  const { toast } = useToast();
  const route = useRouter()

  const content = form.watch('content')

  // TODO: quando eu digito esta atualizando a imagem também. Verifica o motivo.
  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageForm({
        image: file,
        localImageUrl: URL.createObjectURL(file)
      })
    }
  }, [])

  const onSubmit = useCallback(async ({ content }: FormSchema) => {
    try {
      setIsLoadingNewPost(true);
      await handleNewPost(content, imageForm.image);
      setImageForm({
        image: undefined,
        localImageUrl: '',
      });
      form.reset({
        content: '',
      });
      toast({
        title: 'Postado!'
      })
    } catch (err) {
      if (err instanceof BadRequestException) {
        toast({
          title: 'Ooops!',
          description: err.message
        })
      } else if (err instanceof UnauthorizedException) {
        toast({
          title: 'Ooops!',
          description: err.message
        })
        route.replace('/signin')
      } else {
        toast({
          title: 'Ooops!',
          description: 'Algo aconteceu!'
        })
      }
    } finally {
      setIsLoadingNewPost(false);
    }
  }, [imageForm, toast, handleNewPost, form, route, setIsLoadingNewPost])

  return (
    <Card className="w-[550px]">
      <CardContent className="flex flex-col p-4">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel />
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[120px] max-h-[120px]"
                      placeholder="O que você está pensando?" />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4 pt-2">
              <input
                disabled={isLoadingNewPost}
                hidden
                ref={ref}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <Button variant='outline' disabled={isLoadingNewPost}
                type="button" onClick={() => ref.current?.click()}>
                <ImageIcon />
              </Button>
              <Button
                disabled={
                  isLoadingNewPost
                  || (content !== undefined && content.length === 0)
                }
                className="font-semibold">Postar</Button>
            </div>
          </form>
        </FormProvider>

        {imageForm.image && (
          <div className="pt-5">
            <Image
              src={imageForm.localImageUrl}
              alt="Imagem selecionada"
              className="w-[100%] h-auto" // Using tailwindcss
              width={0}
              height={0}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

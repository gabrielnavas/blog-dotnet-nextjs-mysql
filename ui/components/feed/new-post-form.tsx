'use client'

import React, { useCallback, useContext } from "react";
import { Card, CardContent } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Image } from "lucide-react";

import { z } from 'zod'
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { FeedContext, FeedContextType } from "@/contexts/feed-context";
import { BadRequestException, UnauthorizedException } from "@/lib/exceptions";

const formSchema = z.object({
  content: z.string({ message: 'Digite o que está pensando.' })
    .min(1, 'Digite o que está pensando.')
    .max(255, 'Pensamento máximo de 255 caracteres.'),
})

type FormSchema = z.infer<typeof formSchema>

export const NewPostForm: React.FC = () => {
  const [image, setImage] = React.useState<File | undefined>()
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImage(file)
  };

  const onSubmit = useCallback(async ({ content }: FormSchema) => {
    try {
      setIsLoadingNewPost(true);
      await handleNewPost(content, image);
      setImage(undefined);
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
  }, [image, toast, handleNewPost, form, route, setIsLoadingNewPost])

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
              <Button disabled={isLoadingNewPost}
                type="button" onClick={() => ref.current?.click()}>
                <Image />
              </Button>
              <Button
                disabled={isLoadingNewPost || content.length === 0}
                className="font-semibold">Postar</Button>
            </div>
          </form>
        </FormProvider>

        {image && (
          <div className="pt-5">
            <img src={URL.createObjectURL(image)} alt="Imagem selecionada" className="max-w-full h-auto" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

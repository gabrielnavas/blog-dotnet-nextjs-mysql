import { AuthContext, AuthContextType } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { findUserById } from "@/services/find-user-by-id";
import { User } from "@/services/models";
import { useRouter } from "next/navigation";
import React from "react";

export const useFindOwner = (userId: string) => {

  const { token } = React.useContext(AuthContext) as AuthContextType

  const router = useRouter()
  const { toast } = useToast()


  const [isLoadingOwner, setIsLoadingOwner] = React.useState(false)
  const [ownerPost, setOwnerPost] = React.useState<User | null>(null)

  React.useEffect(() => {
    const findOwner = async () => {
      try {
        setIsLoadingOwner(true)
        const result = await findUserById(token)({ userId: userId })

        if (result.IsUnauthorized) {
          toast({
            title: 'Oops!',
            description: result.message || 'Sem autorização.',
          })
          router.replace('/signin')
        } else if (result.error) {
          console.log(result.error)
          toast({
            title: 'Oops!',
            description: result.message || 'Algo aconteceu!',
          })
        } else if (!result.data) {
          toast({
            title: 'Oops!',
            description: result.message || 'Algo aconteceu. Tente novamente mais tarde!',
          })
        } else {
          setOwnerPost(result.data!.user)
          setIsLoadingOwner(false)
        }
      } catch {
        toast({
          title: 'Oops!',
          description: 'Algo aconteceu. Tente novamente mais tarde!',
        })
      }
      finally {

      }
    }

    findOwner()
  }, [userId, token, router, toast])

  return { isLoadingOwner, ownerPost }
}

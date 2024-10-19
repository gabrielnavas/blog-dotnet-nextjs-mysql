import { useState, useEffect, useContext } from 'react';

import { downloadPostImage } from '@/services/download-post-image';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { AuthContext, AuthContextType } from '@/contexts/auth-context';

export const useLoadPostImage = (postId: string) => {

  const { token } = useContext(AuthContext) as AuthContextType

  const [imageUrl, setImageUrl] = useState('');
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const loadImage = async () => {
      try {
        setIsLoadingImage(true);
        const result = await downloadPostImage(token)({ postId });
        if (result.IsUnauthorized) {
          toast({
            title: 'Oops!',
            description: result.message || 'Sem autorização.',
          });
          router.replace('/signin');
        } else if (result.data) {
          setImageUrl(result.data!.imageUrl);
        }
      } catch {
        toast({
          title: 'Oops!',
          description: 'Erro ao carregar imagem.',
        });
      } finally {
        setIsLoadingImage(false);
      }
    };
    loadImage();
  }, [token, postId, toast, router]);

  return { imageUrl, isLoadingImage };
};

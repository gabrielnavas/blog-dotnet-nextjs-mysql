import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { AuthTabs } from "./auth-tab"

type Props = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export const AuthModal: React.FC<Props> = ({ isOpen, onOpenChange }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <AuthTabs />
      </DialogContent>
    </Dialog>
  )
}

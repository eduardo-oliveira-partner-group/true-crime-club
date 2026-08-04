import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog'
import { Spinner } from '@/src/components/ui/spinner'
import {
  dossierCardSurface,
  fontHeading,
  warmShadowClass,
} from '@/src/lib/design/classes'
import { cn } from '@/src/lib/utils'

export function CheckoutProcessingDialog({
  open,
  message,
}: {
  open: boolean
  message: string
}) {
  return (
    <Dialog open={open}>
      <DialogContent
        className={cn(
          dossierCardSurface,
          warmShadowClass,
          'max-w-sm gap-0 p-6 text-center sm:p-7',
        )}
        overlayClassName="bg-foreground/30"
        showCloseButton={false}
      >
        <DialogHeader className="items-center gap-3 text-center">
          <Spinner aria-hidden className="size-8 text-(--red)" />
          <DialogTitle className={cn(fontHeading, 'text-lg text-(--ink)')}>
            Processamento em curso
          </DialogTitle>
          <DialogDescription className="text-sm/6 text-(--ink-mute)">
            {message}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

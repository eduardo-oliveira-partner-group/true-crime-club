import { cn } from '@/src/lib/utils'

interface ProductDetailIncludedPreviewProps {
  items: string[]
  className?: string
}

export function ProductDetailIncludedPreview({
  items,
  className,
}: ProductDetailIncludedPreviewProps) {
  if (!items.length) return null

  return (
    <div
      className={cn('border-t border-[rgba(33,28,24,0.15)] pt-6', className)}
    >
      <p className="text-xs font-semibold tracking-[0.2em] text-(--red) uppercase">
        Conteúdo do arquivo
      </p>
      <ul className="mt-4 grid gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--paper)/72 px-4 py-3 text-sm/6 text-(--ink-soft)"
          >
            <span className="mt-2 size-1.5 shrink-0 bg-[#d84132]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

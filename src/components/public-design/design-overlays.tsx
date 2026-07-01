import { grainNoiseUrl } from '@/src/lib/design/tokens'

/** Fixed grain + grid overlays for paper-first pages. */
export function DesignOverlays() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-3 bg-size-[160px_160px] opacity-[0.07] mix-blend-multiply"
        style={{ backgroundImage: grainNoiseUrl }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-3 bg-[linear-gradient(rgba(94,72,48,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(94,72,48,0.05)_1px,transparent_1px),radial-gradient(rgba(94,72,48,0.07)_0.6px,transparent_0.6px)] bg-size-[34px_34px,34px_34px,6px_6px] bg-position-[-1px_-1px,-1px_-1px,0_0] opacity-55 mix-blend-multiply"
      />
    </>
  )
}

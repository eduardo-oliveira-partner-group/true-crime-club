import Link from "next/link"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4 py-10">
      <Link
        href="/"
        className="mb-8 font-heading text-lg font-semibold tracking-tight"
      >
        True Crime Club
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}

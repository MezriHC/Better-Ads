"use client"

import { useRouter } from "next/navigation"

interface CreateButtonProps {
  children: React.ReactNode
  className?: string
}

export function CreateButton({ children, className }: CreateButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push('/dashboard/create')
  }

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  )
}
"use client"

import type { ComponentProps } from "react"

export function AutoSubmitSelect({ onChange, ...props }: ComponentProps<"select">) {
  return (
    <select
      {...props}
      onChange={(e) => {
        onChange?.(e)
        e.target.form?.requestSubmit()
      }}
    />
  )
}

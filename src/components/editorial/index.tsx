import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface SectionLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  number?: string
  label: string
}

export function SectionLabel({ number, label, className, ...props }: SectionLabelProps) {
  return (
    <div
      className={cn("flex items-center gap-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#6f6f6a]", className)}
      {...props}
    >
      {number && <span>{number} /</span>}
      <span className="text-[#e8e6df]">{label}</span>
    </div>
  )
}

export interface SpecimenLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
}

export function SpecimenLabel({ children, className, ...props }: SpecimenLabelProps) {
  return (
    <span
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.18em] text-[#6f6f6a] border border-[#f3f1eb]/[0.1] px-2 py-0.5 inline-block",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export interface EditorialDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
}

export function EditorialDivider({ label, className, ...props }: EditorialDividerProps) {
  return (
    <div className={cn("relative py-6 flex items-center", className)} {...props}>
      <div className="flex-grow border-t border-[#f3f1eb]/[0.08]" />
      {label && (
        <span className="shrink-0 px-4 font-mono text-[9px] uppercase tracking-[0.24em] text-[#6f6f6a]">
          {label}
        </span>
      )}
      <div className="flex-grow border-t border-[#f3f1eb]/[0.08]" />
    </div>
  )
}

export interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toLowerCase()
  let style = "border-[#f3f1eb]/[0.15] text-[#e8e6df] bg-[#171717]"

  if (normalized === "confirmed" || normalized === "published" || normalized === "active" || normalized === "paid") {
    style = "border-[#f3f1eb]/[0.3] text-[#f3f1eb] bg-[#141414]"
  } else if (normalized === "pending" || normalized === "awaiting_payment") {
    style = "border-[#6f6f6a]/[0.4] text-[#e8e6df] bg-[#111111]"
  } else if (normalized === "cancelled" || normalized === "expired" || normalized === "rejected") {
    style = "border-[#6b1e1e] text-[#e88] bg-[#1f0d0d]"
  }

  return (
    <span
      className={cn(
        "font-mono text-[9px] uppercase tracking-[0.16em] px-2 py-0.5 border inline-flex items-center",
        style,
        className
      )}
    >
      {status}
    </span>
  )
}

export interface CatalogRowProps {
  index: string | number
  title: string
  category: string
  description?: string | null
  metadata?: string
  priceText?: string
  href: string
  ctaText?: string
}

export function CatalogRow({
  index,
  title,
  category,
  description,
  metadata,
  priceText,
  href,
  ctaText = "Lihat Detail",
}: CatalogRowProps) {
  const indexFormatted = typeof index === "number" ? String(index).padStart(2, "0") : index

  return (
    <article className="group border-b border-[#f3f1eb]/[0.08] py-8 transition-colors hover:bg-[#111111]/40 px-4 -mx-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline">
        <div className="md:col-span-1 font-mono text-xs text-[#6f6f6a] group-hover:text-[#f3f1eb] transition-colors">
          {indexFormatted} /
        </div>
        <div className="md:col-span-5 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6f6f6a]">
            {category}
          </span>
          <h3 className="font-display text-xl sm:text-2xl text-[#f3f1eb] font-normal leading-tight group-hover:text-[#ffffff] transition-colors">
            <Link href={href} className="hover:underline">
              {title}
            </Link>
          </h3>
          {description && (
            <p className="text-xs text-[#6f6f6a] line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        <div className="md:col-span-3 space-y-1">
          {metadata && (
            <p className="font-mono text-[11px] text-[#e8e6df] tracking-wider">
              {metadata}
            </p>
          )}
          {priceText && (
            <p className="font-mono text-xs text-[#f3f1eb] tracking-tight">
              {priceText}
            </p>
          )}
        </div>
        <div className="md:col-span-3 text-left md:text-right">
          <Link
            href={href}
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#e8e6df] hover:text-[#f3f1eb] border border-[#f3f1eb]/[0.15] px-4 py-2 hover:border-[#f3f1eb]/[0.4] transition-all"
          >
            <span>{ctaText}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  )
}

"use client"

import { useState } from "react"
import Image from "next/image"

interface StudioGalleryProps {
  images?: string[]
  productName: string
}

const DEFAULT_STUDIO_PHOTOS = [
  {
    url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop",
    caption: "Main Cyclorama Bay & Overhead Lighting Grid",
    tag: "STUDIO SPACE",
  },
  {
    url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop",
    caption: "Industrial Grade Strobe & Continuous Lighting Gear",
    tag: "LIGHTING RIG",
  },
  {
    url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1200&auto=format&fit=crop",
    caption: "Client Monitoring Deck & Styling Lounge",
    tag: "CLIENT AREA",
  },
]

export function StudioGallery({ images, productName }: StudioGalleryProps) {
  const photoList =
    images && images.length > 0
      ? images.map((url, i) => ({
          url,
          caption: `${productName} — Sudut ${i + 1}`,
          tag: `AREA ${i + 1}`,
        }))
      : DEFAULT_STUDIO_PHOTOS

  const [activeIdx, setActiveIdx] = useState(0)
  const currentPhoto = photoList[activeIdx] || photoList[0]

  return (
    <div className="space-y-4">
      {/* Featured Big Stage Frame */}
      <div className="relative aspect-[16/9] w-full overflow-hidden border border-[#f3f1eb]/[0.1] bg-[#111111] group">
        <Image
          src={currentPhoto.url}
          alt={currentPhoto.caption}
          fill
          unoptimized
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover object-center grayscale contrast-105 group-hover:grayscale-0 transition-all duration-700"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-transparent to-transparent pointer-events-none" />

        {/* Specimen Tag */}
        <div className="absolute top-4 left-4 font-mono text-[9px] uppercase tracking-[0.2em] text-[#e8e6df] px-2.5 py-1 bg-[#0a0a0a]/80 border border-[#f3f1eb]/[0.15]">
          <span>{currentPhoto.tag}</span>
        </div>

        {/* Bottom caption */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="space-y-0.5">
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#6f6f6a]">
              SPECIMEN PREVIEW
            </p>
            <p className="font-mono text-xs text-[#f3f1eb]">
              {currentPhoto.caption}
            </p>
          </div>
          <div className="font-mono text-[10px] text-[#6f6f6a] tracking-widest">
            {String(activeIdx + 1).padStart(2, "0")} / {String(photoList.length).padStart(2, "0")}
          </div>
        </div>
      </div>

      {/* Thumbnail row */}
      <div className="grid grid-cols-3 gap-3">
        {photoList.map((photo, idx) => {
          const isActive = idx === activeIdx
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`relative aspect-[16/10] overflow-hidden border text-left transition-all ${
                isActive
                  ? "border-[#f3f1eb] opacity-100 ring-1 ring-[#f3f1eb]"
                  : "border-[#f3f1eb]/[0.08] opacity-50 hover:opacity-100 hover:border-[#f3f1eb]/[0.3]"
              }`}
            >
              <Image
                src={photo.url}
                alt={photo.caption}
                fill
                unoptimized
                sizes="33vw"
                className="object-cover"
              />
              <span className="absolute bottom-1.5 left-2 font-mono text-[8px] uppercase tracking-wider text-[#f3f1eb] bg-[#0a0a0a]/80 px-1">
                {photo.tag}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

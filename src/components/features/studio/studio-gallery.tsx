"use client"

import { useState } from "react"
import { Camera } from "lucide-react"

interface StudioGalleryProps {
  images?: string[]
  productName: string
}

const DEFAULT_STUDIO_PHOTOS = [
  {
    url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop",
    caption: "Main Cyclorama Bay & Overhead Lighting Grid",
    tag: "Studio Space",
  },
  {
    url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop",
    caption: "Industrial Grade Strobe & Continuous Lighting Gear",
    tag: "Lighting Rig",
  },
  {
    url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1200&auto=format&fit=crop",
    caption: "Client Monitoring Deck & Styling Lounge",
    tag: "Client Area",
  },
]

export function StudioGallery({ images, productName }: StudioGalleryProps) {
  const photoList =
    images && images.length > 0
      ? images.map((url, i) => ({
          url,
          caption: `${productName} — Sudut ${i + 1}`,
          tag: `Area ${i + 1}`,
        }))
      : DEFAULT_STUDIO_PHOTOS

  const [activeIdx, setActiveIdx] = useState(0)
  const currentPhoto = photoList[activeIdx] || photoList[0]

  return (
    <div className="space-y-3">
      {/* Featured Big Stage Frame */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/[0.1] bg-[#121217] group">
        <img
          src={currentPhoto.url}
          alt={currentPhoto.caption}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

        {/* Floating badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-black/60 backdrop-blur-md text-[11px] font-semibold text-white">
          <Camera className="h-3.5 w-3.5 text-amber-400" />
          <span>{currentPhoto.tag}</span>
        </div>

        {/* Bottom caption */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-400 font-bold">Studio Preview</p>
            <p className="text-sm font-semibold text-white">{currentPhoto.caption}</p>
          </div>
          <div className="text-[11px] text-neutral-400 font-mono">
            {activeIdx + 1} / {photoList.length}
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
              className={`relative aspect-[16/10] overflow-hidden rounded-lg border text-left transition-all ${
                isActive
                  ? "border-amber-400 ring-2 ring-amber-400/40 opacity-100"
                  : "border-white/[0.08] opacity-60 hover:opacity-100 hover:border-white/30"
              }`}
            >
              <img
                src={photo.url}
                alt={photo.caption}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30" />
              <span className="absolute bottom-1.5 left-2 text-[10px] font-medium text-white drop-shadow">
                {photo.tag}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, MapPin, ShieldCheck, Handshake, History, X } from 'lucide-react';

export function HeritageSpotlightSection() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <section className="relative w-full bg-surface-container-high py-space-xl px-margin-mobile md:px-margin-tablet lg:px-margin overflow-hidden border-y border-surface-container-highest">
      {/* Background Watermark */}
      <div className="absolute -top-12 -right-8 select-none pointer-events-none opacity-5 font-headline-lg text-[16rem] leading-none font-bold text-on-surface">
        1976
      </div>

      <div className="max-w-7xl mx-auto space-y-space-lg relative z-10">
        {/* Section Header & Provenance Anchor */}
        <div className="max-w-3xl space-y-2">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-container-highest text-primary font-label-sm text-label-sm uppercase tracking-widest font-bold border border-surface-container-highest">
            <History className="w-4 h-4 text-primary" />
            <span>ESTABLISHED 1976 • 50 YEARS AT THE SAME HISTORIC SHOP</span>
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface leading-tight">
            Half a Century of Preserving Pakistan's Living Craft
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            From our original flagship shop in Lahore to master artisan workshops across Swat, Multan, and Sillanwali.
          </p>
        </div>

        {/* Split Cinematic Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
          {/* Left Column: Narrative & Metrics (Cols 1-6) */}
          <div className="lg:col-span-6 space-y-space-md">
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              In 1976, Ghazali Handicrafts opened its doors with a simple pledge: to provide an enduring sanctuary for master Pakistani Ustads whose craft was being eclipsed by factory reproductions. Fifty uninterrupted years later, operating from the very same historic shop address in Lahore, we continue our lifelong guardianship of genuine Sheesham joinery, Kashigari tile glazes, and hand-beaten Peshawar brassware.
            </p>

            {/* Founder's Pull-Quote Callout */}
            <blockquote className="p-space-md rounded-xl bg-surface-container-lowest/90 backdrop-blur-xs shadow-xs border-l-4 border-[#00405C]">
              <p className="font-body-lg text-body-lg italic text-on-surface mb-2">
                “For 50 years, this shop has not just sold decorative pieces; we have guarded the dignity and generational survival of our country's master craftsmen.”
              </p>
              <cite className="font-label-md text-label-md text-primary font-bold uppercase tracking-widest block not-italic">
                — Founder & Senior Conservator, Ghazali Handicrafts
              </cite>
            </blockquote>

            {/* 3 Metric Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm pt-space-xs">
              <div className="p-3 rounded-lg bg-surface-container-lowest shadow-xs flex flex-col border border-surface-container-high">
                <MapPin className="w-5 h-5 text-primary mb-1" />
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface font-bold">
                  Flagship Hub
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant text-[12px] leading-tight">
                  Same Lahore shop since 1976
                </span>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-lowest shadow-xs flex flex-col border border-surface-container-high">
                <ShieldCheck className="w-5 h-5 text-[#1E4B3E] mb-1" />
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface font-bold">
                  2nd Gen Trust
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant text-[12px] leading-tight">
                  Family craft custodians
                </span>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-lowest shadow-xs flex flex-col border border-surface-container-high">
                <Handshake className="w-5 h-5 text-brass mb-1" />
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface font-bold">
                  Direct Ustad Guild
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant text-[12px] leading-tight">
                  Zero middleman dilution
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Cinematic Interview & Video Player (Cols 7-12) */}
          <div className="lg:col-span-6">
            <div
              onClick={() => setIsVideoModalOpen(true)}
              className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-[#141A1F] group cursor-pointer border border-surface-container-highest"
            >
              {/* Master Artisan Image Poster Frame */}
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC65WkVwjoGLadBch5OQnK0sPTgrGeLcosT20XchCD4TyEkHWfRV24BZsMzAgG5Xjzg5S17XLuePnUZbNvpH8Y9TRV50YuXFjuYaRkiPPMBrAufS6QWj2K2cU3u-7EwIuPHPA3hWWo8a14H5WJtRYfqLDBfmOU3MK6wRPmMViFSRlhvkQohSqbaQXIKlg-jAFLx1IWKwN6pO-kNynwX2eZEoF1UndwQzkY24pNswMPvi4REjvHp5Gpq"
                alt="Elderly Pakistani master artisan craftsman at vintage studio surrounded by brass artifacts and carved walnut woodwork"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {/* Vignette Scrim */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors"></div>

              {/* Pulsating Play Button & Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-space-xs text-center p-4">
                <div className="w-20 h-20 rounded-full bg-[#00405C] text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform border border-white/20">
                  <Play className="w-9 h-9 fill-white ml-1" />
                </div>
                <span className="px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white font-label-md text-label-md uppercase tracking-widest shadow-lg mt-2 border border-white/10">
                  Watch Founder's Story (3 Mins)
                </span>
              </div>

              {/* Corner Pill Tag */}
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md font-label-sm text-label-sm text-white flex items-center gap-2 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span>4K Cinematic Mini-Doc • An Interview with the Founder</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-[#141A1F] rounded-2xl overflow-hidden shadow-2xl border border-brass/30">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Video Player Frame */}
            <div className="relative w-full aspect-video flex items-center justify-center bg-black">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC65WkVwjoGLadBch5OQnK0sPTgrGeLcosT20XchCD4TyEkHWfRV24BZsMzAgG5Xjzg5S17XLuePnUZbNvpH8Y9TRV50YuXFjuYaRkiPPMBrAufS6QWj2K2cU3u-7EwIuPHPA3hWWo8a14H5WJtRYfqLDBfmOU3MK6wRPmMViFSRlhvkQohSqbaQXIKlg-jAFLx1IWKwN6pO-kNynwX2eZEoF1UndwQzkY24pNswMPvi4REjvHp5Gpq"
                alt="Founder documentary interview playback"
                fill
                className="object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#00405C] text-white flex items-center justify-center shadow-lg animate-pulse border border-white/20">
                  <Play className="w-8 h-8 fill-white ml-1" />
                </div>
                <div className="max-w-md">
                  <h3 className="font-headline-sm text-headline-sm text-white">
                    "Fifty Years Guarding the Chisel"
                  </h3>
                  <p className="font-body-sm text-body-sm text-white/80 mt-1">
                    Archival interview filmed at 94-B/II Gulberg III, Lahore flagship archive.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export { HeritageSpotlightSection as HeritageStorySection };

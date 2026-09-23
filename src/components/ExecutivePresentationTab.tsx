import React, { useState } from 'react';
import {
  Presentation,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  FileText,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { EXECUTIVE_DECK_SLIDES } from '../data/foresightData';

export const ExecutivePresentationTab: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [showNotes, setShowNotes] = useState<boolean>(true);

  const slide = EXECUTIVE_DECK_SLIDES[currentSlideIndex];

  return (
    <div className="space-y-6">
      {/* Top Slide Control Bar */}
      <div className="bg-[#1E293B] rounded-xl p-4 border border-slate-700/50 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Presentation className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">
              Executive Presentation Readout (Deliverable D7)
            </h2>
            <p className="text-xs text-slate-400">
              Client: NorthBay Living • Slide {currentSlideIndex + 1} of {EXECUTIVE_DECK_SLIDES.length}
            </p>
          </div>
        </div>

        {/* Slide Navigation Controls */}
        <div className="flex items-center space-x-2">
          <button
            disabled={currentSlideIndex === 0}
            onClick={() => setCurrentSlideIndex((p) => Math.max(0, p - 1))}
            className="p-2 rounded-xl border border-slate-700/50 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent text-slate-300 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-semibold text-slate-300 px-3">
            {currentSlideIndex + 1} / {EXECUTIVE_DECK_SLIDES.length}
          </span>

          <button
            disabled={currentSlideIndex === EXECUTIVE_DECK_SLIDES.length - 1}
            onClick={() => setCurrentSlideIndex((p) => Math.min(EXECUTIVE_DECK_SLIDES.length - 1, p + 1))}
            className="p-2 rounded-xl border border-slate-700/50 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent text-slate-300 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              showNotes ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' : 'bg-slate-800 text-slate-300 border-slate-700/50'
            }`}
          >
            {showNotes ? 'Hide Speaker Notes' : 'Show Speaker Notes'}
          </button>
        </div>
      </div>

      {/* Main Slide Canvas */}
      <div className="bg-[#1E293B] rounded-xl p-8 sm:p-12 text-white border border-slate-700/50 shadow-2xl relative min-h-[440px] flex flex-col justify-between overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div>
          {/* Header Tag */}
          <div className="flex items-center justify-between border-b border-slate-700/50 pb-4 mb-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
              NorthBay Living • Project FORESIGHT
            </span>
            <span className="text-xs text-slate-400 font-mono">
              SLIDE {slide.id < 10 ? `0${slide.id}` : slide.id}
            </span>
          </div>

          {/* Slide Main Content */}
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
            {slide.title}
          </h2>
          <p className="text-sm text-indigo-300 font-medium mt-1">
            {slide.subtitle}
          </p>

          {/* Key Metric Callout if applicable */}
          {slide.key_metric_label && (
            <div className="my-6 p-5 rounded-2xl bg-gradient-to-r from-indigo-950/80 to-slate-900 border border-indigo-500/30 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-indigo-300">{slide.key_metric_label}</p>
                <p className="text-3xl font-extrabold text-white mt-1">{slide.key_metric_value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{slide.key_metric_subtext}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-indigo-400 opacity-60 hidden sm:block" />
            </div>
          )}

          {/* Bullet points */}
          <div className="mt-6 space-y-3">
            {slide.summary_bullets.map((bullet, idx) => (
              <div key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <span className="w-2 h-2 rounded-full bg-indigo-400 mt-2 shrink-0"></span>
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-8 border-t border-slate-700/50 text-xs text-slate-400 flex justify-between items-center">
          <span>Prepared for Head of Operations & Finance Lead</span>
          <span>Zidio Data Science Engagement</span>
        </div>
      </div>

      {/* Speaker Notes Drawer */}
      {showNotes && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 text-amber-200 text-xs shadow-sm">
          <div className="flex items-center space-x-2 font-bold text-amber-400 uppercase tracking-wider text-[10px] mb-1.5">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Speaker Notes & Presenter Guide</span>
          </div>
          <p className="leading-relaxed font-medium">{slide.speaker_notes}</p>
        </div>
      )}

      {/* Slide Thumbnails Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
        {EXECUTIVE_DECK_SLIDES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlideIndex(idx)}
            className={`p-3 rounded-xl border text-left text-xs transition ${
              idx === currentSlideIndex
                ? 'bg-indigo-600 text-white border-indigo-500 font-bold shadow-md'
                : 'bg-[#1E293B] text-slate-300 border-slate-700/50 hover:bg-slate-800'
            }`}
          >
            <span className="block text-[10px] opacity-75 uppercase">Slide {s.id}</span>
            <span className="truncate block font-semibold mt-0.5">{s.title.split('–')[0]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

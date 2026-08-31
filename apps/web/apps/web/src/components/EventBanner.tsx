import React from 'react';

interface EventBannerProps {
  bannerUrl?: string;
  title: string;
}

export const EventBanner: React.FC<EventBannerProps> = ({ bannerUrl, title }) => {
  const fallbackImage = `https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80`;

  return (
    <div className="relative w-full h-36 sm:h-44 overflow-hidden rounded-t-2xl bg-slate-100">
      <img
        src={bannerUrl || fallbackImage}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        onError={(e) => {
          (e.target as HTMLImageElement).src = fallbackImage;
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
    </div>
  );
};
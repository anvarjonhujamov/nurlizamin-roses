export function YouTubeEmbed({ videoId, title, aspect = '16/9', className = '' }) {
  if (!videoId) return null;

  const aspectClass =
    aspect === '9/16' ? 'aspect-[9/16]' : 'aspect-video';

  return (
    <div
      className={`overflow-hidden rounded-xl bg-slate-900 shadow-md ring-1 ring-slate-200 ${aspectClass} ${className}`}
    >
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title || 'YouTube video'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        className="h-full w-full border-0"
      />
    </div>
  );
}

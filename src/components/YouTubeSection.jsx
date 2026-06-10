import { FaYoutube } from 'react-icons/fa';
import { YOUTUBE_VIDEOS, YOUTUBE_SHORTS, YOUTUBE_CHANNEL_URL } from '@/data/youtube';
import { YouTubeEmbed } from './YouTubeEmbed';

export function YouTubeSection() {
  return (
    <section id="videos" className="scroll-mt-20 bg-cream-50 py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <div className="mb-2 inline-flex items-center gap-2 text-red-600">
            <FaYoutube className="h-6 w-6" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-widest">YouTube</span>
          </div>
          <h2 className="font-display text-2xl font-semibold text-nursery-900 sm:text-3xl">
            Видео и Shorts
          </h2>
          {YOUTUBE_CHANNEL_URL && (
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:underline"
            >
              <FaYoutube className="h-4 w-4" />
              Перейти на канал
            </a>
          )}
        </div>

        <div className="mb-10">
          <h3 className="mb-4 font-display text-lg text-nursery-800">Видео</h3>
          <div className="grid gap-4 md:grid-cols-2 md:gap-6">
            {YOUTUBE_VIDEOS.map((video) => (
              <YouTubeEmbed
                key={video.id}
                videoId={video.id}
                title={video.title}
                aspect="16/9"
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-display text-lg text-nursery-800">Shorts</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {YOUTUBE_SHORTS.map((short) => (
              <YouTubeEmbed
                key={short.id}
                videoId={short.id}
                title={short.title}
                aspect="9/16"
                className="mx-auto w-full max-w-[220px] sm:max-w-none"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

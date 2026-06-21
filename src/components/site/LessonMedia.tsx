import React from 'react'

/** Turn a YouTube/Vimeo watch URL into an embeddable URL, else return null. */
function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const id = u.searchParams.get('v')
      if (id) return `https://www.youtube.com/embed/${id}`
      if (u.pathname.startsWith('/embed/')) return url
    }
    if (host === 'youtu.be') {
      const id = u.pathname.slice(1)
      if (id) return `https://www.youtube.com/embed/${id}`
    }
    if (host === 'vimeo.com') {
      const id = u.pathname.split('/').filter(Boolean)[0]
      if (id) return `https://player.vimeo.com/video/${id}`
    }
    if (host === 'player.vimeo.com') return url
  } catch {
    return null
  }
  return null
}

function isDirectVideo(url: string): boolean {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url)
}

export const LessonMedia: React.FC<{ url: string; title: string }> = ({ url, title }) => {
  const embed = toEmbedUrl(url)

  if (embed) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-black">
        <iframe
          src={embed}
          title={title}
          className="size-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  if (isDirectVideo(url)) {
    return (
      <video controls className="w-full overflow-hidden rounded-xl border border-border bg-black">
        <source src={url} />
        Your browser does not support the video tag.
      </video>
    )
  }

  // Unknown provider — offer a safe outbound link rather than embedding.
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
    >
      Open lesson video
    </a>
  )
}

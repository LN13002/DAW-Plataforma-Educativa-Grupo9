import { Icon } from './Icon'
import { Button } from './Button'

function getYouTubeEmbedUrl(videoUrl) {
  if (!videoUrl) return ''

  try {
    const url = new URL(videoUrl)
    if (url.hostname.includes('youtube.com') && url.pathname.startsWith('/embed/')) {
      return videoUrl
    }
    if (url.hostname.includes('youtube.com')) {
      const videoId = url.searchParams.get('v')
      return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
    }
    if (url.hostname === 'youtu.be') {
      const videoId = url.pathname.replace('/', '')
      return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
    }
  } catch {
    return ''
  }

  return ''
}

export function VideoPlayerCard({ title = 'Lección del curso', courseTitle, videoUrl, onComplete }) {
  const embedUrl = getYouTubeEmbedUrl(videoUrl)

  return (
    <section className="player-card">
      <div className="video-frame">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="video-placeholder">
            <Icon name="play_lesson" />
            <strong>Contenido de la lección</strong>
            <span>Esta lección aún no tiene un video enlazado.</span>
          </div>
        )}
      </div>

      <div className="player-info">
        <div>
          <span className="eyebrow">{courseTitle || 'Lección del curso'}</span>
          <h2>{title}</h2>
          <p>
            {courseTitle ? `${courseTitle}. ` : ''}
            Video y avance de la lección en una sola vista.
          </p>
        </div>
        <Button onClick={onComplete}>
          <Icon name="check_circle" />
          Marcar completada
        </Button>
      </div>
    </section>
  )
}

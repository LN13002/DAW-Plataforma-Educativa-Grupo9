import { Icon } from './Icon'
import { Button } from './Button'

export function VideoPlayerCard({ title = 'Implementacion de API Gateway con NestJS', courseTitle, onComplete }) {
  return (
    <section className="player-card">
      <div className="video-frame">
        <img
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
          alt=""
        />
        <button className="play-button" type="button" aria-label="Reproducir leccion">
          <Icon name="play_arrow" filled />
        </button>
        <div className="video-controls">
          <Icon name="pause" />
          <div className="video-progress">
            <span />
          </div>
          <small>12:45 / 18:30</small>
          <Icon name="fullscreen" />
        </div>
      </div>

      <div className="player-info">
        <div>
          <span className="eyebrow">Modulo 4 • Microservicios</span>
          <h2>{title}</h2>
          <p>
            {courseTitle ? `${courseTitle}. ` : ''}
            Video, descripcion, recursos, discusion y avance de la leccion en una sola vista.
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

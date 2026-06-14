import { Button } from '../components/Button'
import { Icon } from '../components/Icon'

export function CertificatesView({ certificates, onNavigate }) {
  const hasCertificates = certificates.length > 0

  return (
    <main className="page">
      <section className="page-header">
        <span className="eyebrow">Diplomas</span>
        <h1>Mis diplomas</h1>
        <p>Consulta y descarga los certificados obtenidos al finalizar tus cursos.</p>
      </section>

      <section className="certificate-grid">
        {hasCertificates ? (
          certificates.map((certificate) => (
            <article className="certificate-card" key={certificate.id}>
              <Icon name="verified_user" />
              <h2>{certificate.title}</h2>
              {certificate.studentName ? <p>Otorgado a {certificate.studentName}</p> : null}
              <p>Expedido el {certificate.issuedAt}</p>
              <span>Código: {certificate.code ?? certificate.id}</span>
              <a className="btn btn-secondary certificate-download" href={certificate.downloadUrl} download>
                <Icon name="download" />
                Descargar
              </a>
            </article>
          ))
        ) : (
          <article className="certificate-empty-state">
            <Icon name="workspace_premium" />
            <span className="eyebrow">Aún sin diplomas</span>
            <h2>Aún no has completado ningún curso</h2>
            <p>Cuando finalices un curso y se emita tu certificado, aparecerá aquí listo para descargar.</p>
            <Button onClick={() => onNavigate('explore')}>
              <Icon name="explore" />
              Explorar cursos
            </Button>
          </article>
        )}
      </section>
    </main>
  )
}

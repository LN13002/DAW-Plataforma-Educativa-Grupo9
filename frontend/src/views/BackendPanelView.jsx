import { Button } from '../components/Button'
import { Icon } from '../components/Icon'
import { DEDICATED_RESOURCE_VIEWS } from '../constants/app'

export function BackendPanelView({ resources, activeResourceKey, setActiveResourceKey, onNavigate }) {
  const activeResource = resources.find((resource) => resource.key === activeResourceKey) ?? resources[0]
  const hasDedicatedView = DEDICATED_RESOURCE_VIEWS.has(activeResource.key)

  return (
    <main className="page">
      <section className="page-header">
        <span className="eyebrow">Administración</span>
        <h1>Áreas de gestión</h1>
        <p>
          Revisa qué áreas de gestión están conectadas y abre la pantalla correspondiente para administrarlas.
        </p>
      </section>

      <section className="backend-resource-grid">
        {resources.map((resource) => (
          <button
            className={resource.key === activeResource.key ? 'backend-resource-card active' : 'backend-resource-card'}
            type="button"
            key={resource.key}
            onClick={() => {
              setActiveResourceKey(resource.key)
              if (resource.key === 'users' || resource.key === 'categories') {
                onNavigate(resource.key)
              }
            }}
          >
            <Icon name={resource.icon} />
            <strong>{resource.title}</strong>
            <span>{resource.subtitle}</span>
          </button>
        ))}
      </section>

      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <span className="eyebrow">{activeResource.title}</span>
            <h2>{activeResource.title}</h2>
            <p>Gestiona esta información desde su pantalla dedicada en el menú lateral.</p>
          </div>
          {hasDedicatedView ? (
            <Button onClick={() => onNavigate(activeResource.key)}>
              <Icon name="open_in_new" />
              Abrir gestión
            </Button>
          ) : null}
        </div>
      </section>

      <section className="endpoint-map">
        <h2>Áreas conectadas</h2>
        <div>
          {resources.map((resource) => (
            <p key={resource.key}>
              <Icon name="check_circle" />
              <strong>{resource.title}</strong>
              <span>{resource.subtitle}</span>
            </p>
          ))}
        </div>
      </section>
    </main>
  )
}

const learnerNavItems = [
  ['home', 'Inicio', 'home'],
  ['explore', 'Explorar', 'explore'],
  ['account_tree', 'Mi Ruta', 'player'],
  ['local_library', 'Biblioteca', 'library'],
  ['workspace_premium', 'Diplomas', 'certificates'],
  ['track_changes', 'Progreso', 'progress'],
  ['settings', 'Ajustes', 'profile'],
]

const adminNavItems = [
  ['home', 'Inicio', 'home'],
  ['view_module', 'Módulos', 'modules'],
  ['forum', 'Comentarios', 'comments'],
  ['how_to_reg', 'Inscripciones', 'enrollments'],
  ['play_lesson', 'Lecciones', 'lessons'],
  ['settings', 'Ajustes', 'profile'],
]

import { useState } from 'react'
import { Icon } from './Icon'

export function AppShell({ user, personas = [], activeView, onNavigate, onLogout, onPersonaSwitch, children }) {
  const [accountOpen, setAccountOpen] = useState(false)
  const isAdmin = user.plan === 'admin'
  const navItems = isAdmin ? adminNavItems : learnerNavItems
  const topbarItems = isAdmin
    ? [
        ['Panel', 'modules'],
        ['Inscripciones', 'enrollments'],
        ['Lecciones', 'lessons'],
      ]
    : [
        ['Mis Cursos', 'library'],
        ['Explorar', 'explore'],
        ['Comunidad', 'profile'],
      ]

  const handleNavigate = (view) => {
    setAccountOpen(false)
    onNavigate(view)
  }

  const handlePersonaSwitch = (personaId) => {
    setAccountOpen(false)
    onPersonaSwitch?.(personaId)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand brand-button" type="button" onClick={() => handleNavigate('home')}>
          <div className="brand-mark">UES</div>
          <div>
            <strong>AprendeUes</strong>
            <span>Hacia la libertad por la cultura</span>
          </div>
        </button>

        <nav className="sidebar-nav" aria-label="Principal">
          {navItems.map(([icon, label, view]) => (
            <button
              className={activeView === view ? 'active' : ''}
              type="button"
              key={label}
              onClick={() => handleNavigate(view)}
            >
              <Icon name={icon} />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <button className="mobile-brand" type="button" onClick={() => handleNavigate('home')}>
            <span className="brand-mark">UES</span>
            <span>AprendeUes</span>
          </button>

          <label className="search">
            <Icon name="search" />
            <input placeholder="Que quieres aprender hoy?" type="search" />
          </label>

          <nav className="topbar-nav" aria-label="Secciones">
            {topbarItems.map(([label, target]) => (
              <button type="button" key={target} onClick={() => handleNavigate(target)}>
                {label}
              </button>
            ))}
          </nav>

          <div className="topbar-actions">
            <button className="icon-button" type="button" aria-label="Notificaciones">
              <Icon name="notifications" />
            </button>
            <button className="icon-button" type="button" aria-label="Carrito">
              <Icon name="shopping_cart" />
            </button>
            <div className="account-menu">
              <button
                className="avatar avatar-button"
                type="button"
                aria-label="Abrir menu de cuenta"
                aria-expanded={accountOpen}
                onClick={() => setAccountOpen((open) => !open)}
              >
                {user.initials}
              </button>

              {accountOpen ? (
                <div className="account-popover">
                  <div className="account-summary">
                    <div className="avatar">{user.initials}</div>
                    <div>
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                      <small>Vista actual: {user.plan === 'admin' ? 'Admin' : user.plan === 'instructor' ? 'Instructor' : 'User'}</small>
                    </div>
                  </div>
                  {personas.length > 0 ? (
                    <div className="persona-switcher">
                      <span>Ver como</span>
                      {personas.map((persona) => (
                        <button
                          className={persona.id === user.id ? 'active' : ''}
                          type="button"
                          key={persona.id}
                          onClick={() => handlePersonaSwitch(persona.id)}
                        >
                          <div className="avatar mini">{persona.initials}</div>
                          <div>
                            <strong>{persona.roleLabel}</strong>
                            <small>{persona.name}</small>
                          </div>
                          {persona.id === user.id ? <Icon name="check" /> : null}
                        </button>
                      ))}
                    </div>
                  ) : null}
                  <button type="button" onClick={() => handleNavigate('profile')}>
                    <Icon name="person" />
                    Ver perfil
                  </button>
                  <button type="button" onClick={() => handleNavigate('library')}>
                    <Icon name="local_library" />
                    Mi aprendizaje
                  </button>
                  <button className="danger" type="button" onClick={onLogout}>
                    <Icon name="logout" />
                    Cerrar sesion
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <nav className="mobile-nav" aria-label="Navegacion movil">
          {navItems.map(([icon, label, view]) => (
            <button
              className={activeView === view ? 'active' : ''}
              type="button"
              key={label}
              onClick={() => handleNavigate(view)}
            >
              <Icon name={icon} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {children}
      </div>
    </div>
  )
}

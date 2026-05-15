const navItems = [
  ['home', 'Inicio', 'home'],
  ['explore', 'Explorar', 'explore'],
  ['account_tree', 'Mi Ruta', 'player'],
  ['local_library', 'Biblioteca', 'library'],
  ['workspace_premium', 'Diplomas', 'certificates'],
  ['view_module', 'Módulos', 'modules'],
  ['forum', 'Comentarios', 'comments'],
  ['settings', 'Ajustes', 'profile'],
]

import { useState } from 'react'
import { Icon } from './Icon'

export function AppShell({ user, activeView, onNavigate, onLogout, children }) {
  const [accountOpen, setAccountOpen] = useState(false)

  const handleNavigate = (view) => {
    setAccountOpen(false)
    onNavigate(view)
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
            <button type="button" onClick={() => handleNavigate('library')}>
              Mis Cursos
            </button>
            <button type="button" onClick={() => handleNavigate('explore')}>
              Explorar
            </button>
            <button type="button" onClick={() => handleNavigate('profile')}>
              Comunidad
            </button>
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
                    </div>
                  </div>
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

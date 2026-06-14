import { Button } from '../components/Button'
import { Icon } from '../components/Icon'

export function AuthView({ mode, onModeChange, onSubmit }) {
  const isCreate = mode === 'create'

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="auth-brand">
          <span className="brand-mark">UES</span>
          <div>
            <strong>AprendeUes</strong>
            <span>Hacia la libertad por la cultura</span>
          </div>
        </div>
        <div className="auth-copy">
          <span className="eyebrow">Plataforma educativa</span>
          <h1>{isCreate ? 'Comienza tu ruta academica' : 'Continua aprendiendo'}</h1>
          <p>
            Accede a tus cursos, progreso, certificados y contenido de aprendizaje desde una experiencia diseñada para
            estudiantes de la Universidad de El Salvador.
          </p>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <span className="eyebrow">{isCreate ? 'Crear cuenta' : 'Iniciar sesión'}</span>
            <h2>{isCreate ? 'Regístrate en AprendeUes' : 'Bienvenido de nuevo'}</h2>
            <p>
              {isCreate
                ? 'Usa tus datos académicos para preparar tu perfil.'
                : 'Ingresa con tu correo institucional o cuenta registrada.'}
            </p>
          </div>

          <form className="auth-form" onSubmit={onSubmit}>
            {isCreate ? (
              <div className="auth-field-row">
                <label>
                  Nombre
                  <input name="firstName" placeholder="Mateo" type="text" required />
                </label>
                <label>
                  Apellido
                  <input name="lastName" placeholder="Rivas" type="text" required />
                </label>
              </div>
            ) : null}

            <label>
              Correo
              <input name="email" placeholder="usuario@ues.edu.sv" type="email" required />
            </label>

            <label>
              Contraseña
              <input name="password" placeholder="Mínimo 8 caracteres" type="password" required />
            </label>

            {isCreate ? (
              <label>
                Rol
                <select name="role" defaultValue="student">
                  <option value="student">Estudiante</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Administrador</option>
                </select>
              </label>
            ) : (
              <div className="auth-options">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  Recordarme
                </label>
                <button type="button">Olvidé mi contraseña</button>
              </div>
            )}

            <Button className="auth-submit">
              <Icon name={isCreate ? 'person_add' : 'login'} />
              {isCreate ? 'Crear cuenta' : 'Entrar'}
            </Button>
          </form>

          <div className="auth-switch">
            <span>{isCreate ? '¿Ya tienes cuenta?' : '¿Aún no tienes cuenta?'}</span>
            <button type="button" onClick={() => onModeChange(isCreate ? 'login' : 'create')}>
              {isCreate ? 'Iniciar sesión' : 'Crear cuenta'}
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

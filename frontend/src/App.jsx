import { AppShell } from './components/AppShell'
import { BACKEND_RESOURCES } from './constants/app'
import { useLearningPlatform } from './hooks/useLearningPlatform'
import { CategoriesPage } from './pages/categories/CategoriesPage'
import { CertificatesPage } from './pages/certificates/CertificatesPage'
import { CommentsPage } from './pages/comments/CommentsPage'
import { EnrollmentsPage } from './pages/enrollments/EnrollmentsPage'
import { LessonProgressPage } from './pages/lesson-progress/LessonProgressPage'
import { LessonsPage } from './pages/lessons/LessonsPage'
import { ModulesPage } from './pages/modules/ModulesPage'
import { UsersPage } from './pages/users/UsersPage'
import { AuthView } from './views/AuthView'
import { BackendPanelView } from './views/BackendPanelView'
import { CertificatesView } from './views/CertificatesView'
import { CourseDetailView } from './views/CourseDetailView'
import { ExploreView } from './views/ExploreView'
import { HomeView } from './views/HomeView'
import { LibraryView } from './views/LibraryView'
import { PlayerView } from './views/PlayerView'
import { ProfileView } from './views/ProfileView'
import { RoleAccessView } from './views/RoleAccessView'
import { UserProgressView } from './views/UserProgressView'

function App() {
  const platform = useLearningPlatform()

  if (!platform.isAuthenticated) {
    return (
      <AuthView
        mode={platform.authView}
        onModeChange={platform.setAuthView}
        onSubmit={platform.handleLogin}
      />
    )
  }

  const screenByView = {
    modules: <ModulesPage allowedCourseIds={platform.instructorCourseIds} />,
    comments: <CommentsPage />,
    enrollments: <EnrollmentsPage />,
    lessons: <LessonsPage allowedCourseIds={platform.instructorCourseIds} />,
    'lesson-progress': <LessonProgressPage />,
    users: <UsersPage />,
    categories: <CategoriesPage />,
    home: (
      <HomeView
        user={platform.appUser}
        courses={platform.appCourses}
        categories={platform.appCategories}
        certificates={platform.visibleCertificates}
        modules={platform.appModules}
        lessons={platform.appLessons}
        enrollments={platform.appEnrollments}
        onOpenCourse={platform.openCourse}
        onOpenPlayer={platform.openPlayer}
        onNavigate={platform.setView}
        activeCategory={platform.activeCategory}
        setActiveCategory={platform.setActiveCategory}
      />
    ),
    explore: (
      <ExploreView
        courses={platform.visibleExploreCourses}
        categories={platform.appCategories}
        activeCategory={platform.activeCategory}
        setActiveCategory={platform.setActiveCategory}
        onOpenCourse={platform.openCourse}
        user={platform.appUser}
      />
    ),
    course: (
      <CourseDetailView
        course={platform.selectedCourse}
        modules={platform.appModules}
        lessons={platform.appLessons}
        reviews={platform.appReviews}
        onBack={() => platform.setView('explore')}
        onStart={() => platform.openPlayer(platform.selectedCourse)}
        onEnroll={platform.handleEnrollCourse}
        onNavigate={platform.setView}
        user={platform.appUser}
        completedMessage={platform.completedMessage}
      />
    ),
    player: (
      <PlayerView
        course={platform.selectedCourse}
        lesson={platform.activeLesson}
        lessons={platform.appLessons}
        modules={platform.appModules}
        onSelectLesson={platform.setActiveLesson}
        onComplete={platform.markCompleted}
        completedMessage={platform.completedMessage}
        user={platform.appUser}
      />
    ),
    library: (
      <LibraryView
        courses={platform.appCourses.filter((course) => course.enrollmentId)}
        onOpenPlayer={platform.openPlayer}
        onNavigate={platform.setView}
      />
    ),
    progress: (
      <UserProgressView
        user={platform.appUser}
        courses={platform.appCourses}
        certificates={platform.visibleCertificates}
        onOpenPlayer={platform.openPlayer}
      />
    ),
    certificates: platform.isAdminView
      ? <CertificatesPage />
      : <CertificatesView certificates={platform.visibleCertificates} onNavigate={platform.setView} />,
    profile: (
      <ProfileView
        user={platform.appUser}
        users={platform.appUsers}
        courses={platform.appCourses}
        modules={platform.appModules}
        lessons={platform.appLessons}
        enrollments={platform.appEnrollments}
        certificates={platform.visibleCertificates}
      />
    ),
    admin: (
      <BackendPanelView
        resources={BACKEND_RESOURCES}
        activeResourceKey={platform.activeResourceKey}
        setActiveResourceKey={platform.setActiveResourceKey}
        onNavigate={platform.setView}
      />
    ),
  }

  const screen = !platform.canAccessView(platform.view)
    ? <RoleAccessView role={platform.appUser.plan} view={platform.view} onNavigate={platform.setView} />
    : screenByView[platform.view] ?? screenByView.home

  return (
    <AppShell
      user={platform.appUser}
      personas={platform.personaOptions}
      activeView={platform.view}
      onNavigate={platform.setView}
      onLogout={platform.handleLogout}
      onPersonaSwitch={platform.switchPersona}
    >
      {platform.dataNotice ? <div className="data-notice">{platform.dataNotice}</div> : null}
      {screen}
    </AppShell>
  )
}

export default App

import { useMemo, useState } from 'react'
import { Button } from '../components/Button'
import { Icon } from '../components/Icon'
import { LessonList } from '../components/LessonList'
import { VideoPlayerCard } from '../components/VideoPlayerCard'
import { PLAYER_RESOURCES } from '../constants/app'
import { useLessonDiscussion } from '../hooks/useLessonDiscussion'

export function PlayerView({ course, lesson, lessons, modules, onSelectLesson, onComplete, completedMessage, user }) {
  const [activeTab, setActiveTab] = useState('description')
  const courseModuleIds = useMemo(
    () => new Set(modules.filter((module) => module.courseId === course?.id).map((module) => module.id)),
    [course?.id, modules]
  )
  const courseLessons = useMemo(
    () => lessons.filter((item) => courseModuleIds.has(item.moduleId)),
    [courseModuleIds, lessons]
  )
  const currentModule = modules.find((module) => module.id === lesson?.moduleId)
  const discussion = useLessonDiscussion({ lessonId: lesson?.id, user })

  if (!course || !lesson) return null

  return (
    <main className="page player-page">
      {completedMessage ? <div className="toast">{completedMessage}</div> : null}

      <section className="learning-workspace full">
        <div className="content-stack">
          <VideoPlayerCard title={lesson.title} courseTitle={course.title} videoUrl={lesson.videoUrl} onComplete={onComplete} />
          <LessonTabs
            activeTab={activeTab}
            course={course}
            discussion={discussion}
            lesson={lesson}
            setActiveTab={setActiveTab}
            user={user}
          />
        </div>

        <LessonList lessons={courseLessons} moduleTitle={currentModule?.title ?? course?.title} onSelect={onSelectLesson} />
      </section>
    </main>
  )
}

function LessonTabs({ activeTab, course, discussion, lesson, setActiveTab, user }) {
  return (
    <section className="tabs-panel">
      <div className="tabs">
        <button className={activeTab === 'description' ? 'active' : ''} type="button" onClick={() => setActiveTab('description')}>
          Descripción
        </button>
        <button className={activeTab === 'resources' ? 'active' : ''} type="button" onClick={() => setActiveTab('resources')}>
          Recursos ({PLAYER_RESOURCES.length})
        </button>
        <button className={activeTab === 'discussion' ? 'active' : ''} type="button" onClick={() => setActiveTab('discussion')}>
          Discusión ({discussion.topComments.length})
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'description' ? (
          <LessonDescription course={course} lesson={lesson} />
        ) : activeTab === 'resources' ? (
          <LessonResources />
        ) : (
          <DiscussionPanel discussion={discussion} user={user} />
        )}
      </div>
    </section>
  )
}

function LessonDescription({ course, lesson }) {
  return (
    <p>
      {lesson.description ||
        `En esta lección avanzarás en ${course?.title ?? 'el curso'} con una explicación práctica y orientada a completar el módulo.`}
    </p>
  )
}

function LessonResources() {
  return (
    <div className="resource-grid">
      {PLAYER_RESOURCES.map((resource) => (
        <div className="resource-item" key={resource}>
          <Icon name={resource.includes('Guía') ? 'picture_as_pdf' : 'link'} />
          <span>{resource}</span>
        </div>
      ))}
    </div>
  )
}

function DiscussionPanel({ discussion, user }) {
  return (
    <div className="discussion-panel">
      {discussion.commentError ? <div className="data-notice">{discussion.commentError}</div> : null}
      {user?.id ? <CommentComposer discussion={discussion} user={user} /> : null}
      {discussion.topComments.length === 0 ? (
        <div className="comment-empty-state">Sé el primero en comentar esta lección.</div>
      ) : (
        discussion.topComments.map((comment) => (
          <CommentThread comment={comment} discussion={discussion} key={comment.id} user={user} />
        ))
      )}
    </div>
  )
}

function CommentComposer({ discussion, user }) {
  return (
    <form className="comment-compose" onSubmit={discussion.submitComment}>
      <div className="avatar comment-avatar">{user.initials}</div>
      <div className="comment-compose-field">
        <textarea
          placeholder="Escribe una duda o aporte sobre esta lección..."
          value={discussion.commentText}
          onChange={(event) => discussion.setCommentText(event.target.value)}
          rows={2}
          required
        />
        <Button type="submit">
          <Icon name="send" />
          Publicar
        </Button>
      </div>
    </form>
  )
}

function CommentThread({ comment, discussion, user }) {
  const authorName = discussion.getAuthorName(comment.userId)
  const isOwn = comment.userId === user?.id
  const replies = discussion.repliesByParent.get(comment.id) ?? []

  return (
    <article className="player-comment">
      <div className="player-comment-main">
        <div className="avatar comment-avatar">{authorName.slice(0, 2).toUpperCase()}</div>
        <div className="player-comment-body">
          <strong>{authorName}</strong>
          <CommentBody comment={comment} discussion={discussion} />
          <CommentFooter comment={comment} discussion={discussion} isOwn={isOwn} />
        </div>
      </div>

      {replies.map((reply) => (
        <CommentReply discussion={discussion} key={reply.id} reply={reply} user={user} />
      ))}
    </article>
  )
}

function CommentBody({ comment, discussion }) {
  if (discussion.editingId !== comment.id) return <p>{comment.content}</p>

  return (
    <div className="comment-edit-form">
      <textarea value={discussion.editText} onChange={(event) => discussion.setEditText(event.target.value)} rows={2} />
      <div className="row-actions">
        <Button type="button" onClick={() => discussion.saveEdit(comment)}>
          <Icon name="save" />
          Guardar
        </Button>
        <Button variant="secondary" type="button" onClick={() => discussion.setEditingId(null)}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}

function CommentFooter({ comment, discussion, isOwn }) {
  return (
    <div className="comment-card-footer">
      <span>
        <Icon name="thumb_up" />
        {comment.likes ?? 0}
      </span>
      {isOwn && discussion.editingId !== comment.id ? (
        <div className="row-actions">
          <button type="button" aria-label="Editar comentario" onClick={() => discussion.startEditing(comment)}>
            <Icon name="edit" />
          </button>
          <button className="danger" type="button" aria-label="Eliminar comentario" onClick={() => discussion.removeComment(comment.id)}>
            <Icon name="delete" />
          </button>
        </div>
      ) : null}
    </div>
  )
}

function CommentReply({ discussion, reply, user }) {
  const replyName = discussion.getAuthorName(reply.userId)
  const isOwnReply = reply.userId === user?.id

  return (
    <div className="player-comment is-reply">
      <div className="avatar comment-avatar mini">{replyName.slice(0, 2).toUpperCase()}</div>
      <div className="player-comment-body">
        <strong>{replyName}</strong>
        <p>{reply.content}</p>
        {isOwnReply ? (
          <div className="row-actions">
            <button className="danger" type="button" aria-label="Eliminar respuesta" onClick={() => discussion.removeComment(reply.id)}>
              <Icon name="delete" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

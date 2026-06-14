import { useEffect, useMemo, useState } from 'react'
import { api } from '../services/api'

export function useLessonDiscussion({ lessonId, user }) {
  const [comments, setComments] = useState([])
  const [commentUsers, setCommentUsers] = useState([])
  const [commentText, setCommentText] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [commentError, setCommentError] = useState('')

  const commentUsersById = useMemo(() => new Map(commentUsers.map((u) => [u.id, u])), [commentUsers])
  const topComments = useMemo(() => comments.filter((comment) => !comment.parentId), [comments])
  const repliesByParent = useMemo(() => {
    const replies = new Map()
    comments.filter((comment) => comment.parentId).forEach((comment) => {
      if (!replies.has(comment.parentId)) replies.set(comment.parentId, [])
      replies.get(comment.parentId).push(comment)
    })
    return replies
  }, [comments])

  useEffect(() => {
    if (!lessonId) return
    setCommentError('')
    Promise.all([api.getComments(), api.getUsers()])
      .then(([commentsDto, usersDto]) => {
        setComments(commentsDto.filter((comment) => comment.lessonId === lessonId))
        setCommentUsers(usersDto)
      })
      .catch(() => {})
  }, [lessonId])

  const refreshComments = async () => {
    const updated = await api.getComments()
    setComments(updated.filter((comment) => comment.lessonId === lessonId))
  }

  const submitComment = async (event) => {
    event.preventDefault()
    if (!commentText.trim() || !user?.id || !lessonId) return
    try {
      await api.createComment({ userId: user.id, lessonId, content: commentText.trim(), parentId: null })
      setCommentText('')
      await refreshComments()
    } catch {
      setCommentError('No se pudo publicar el comentario.')
    }
  }

  const saveEdit = async (comment) => {
    try {
      await api.updateComment(comment.id, {
        userId: comment.userId,
        lessonId: comment.lessonId,
        content: editText.trim(),
        parentId: comment.parentId ?? null,
      })
      setEditingId(null)
      await refreshComments()
    } catch {
      setCommentError('No se pudo actualizar el comentario.')
    }
  }

  const removeComment = async (id) => {
    try {
      await api.deleteComment(id)
      setComments((current) => current.filter((comment) => comment.id !== id && comment.parentId !== id))
    } catch {
      setCommentError('No se pudo eliminar el comentario.')
    }
  }

  const getAuthorName = (userId) => {
    const author = commentUsersById.get(userId)
    return author ? `${author.firstName ?? ''} ${author.lastName ?? ''}`.trim() || author.email : 'Usuario'
  }

  const startEditing = (comment) => {
    setEditingId(comment.id)
    setEditText(comment.content)
  }

  return {
    commentError,
    commentText,
    editText,
    editingId,
    getAuthorName,
    removeComment,
    repliesByParent,
    saveEdit,
    setCommentText,
    setEditText,
    setEditingId,
    startEditing,
    submitComment,
    topComments,
  }
}

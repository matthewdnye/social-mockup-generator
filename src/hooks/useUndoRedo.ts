'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePostStore } from './usePostStore'
import type { Platform, Theme, PostAuthor, PostMetrics, PostImage } from '@/lib/types'

interface HistoryState {
  platform: Platform
  theme: Theme
  author: PostAuthor
  content: string
  metrics: PostMetrics
  images: PostImage[]
  client: string
  privacy: 'public' | 'friends' | 'only_me'
}

const MAX_HISTORY = 50

/**
 * Hook for undo/redo functionality in the post editor
 */
export function useUndoRedo() {
  const store = usePostStore()
  const [history, setHistory] = useState<HistoryState[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const isUndoRedoAction = useRef(false)
  const lastSavedState = useRef<string>('')

  // Get current state snapshot
  const getCurrentState = useCallback((): HistoryState => {
    return {
      platform: store.platform,
      theme: store.theme,
      author: { ...store.author },
      content: store.content,
      metrics: { ...store.metrics },
      images: [...store.images],
      client: store.client,
      privacy: store.privacy,
    }
  }, [store])

  // Save state to history
  const saveState = useCallback(() => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false
      return
    }

    const currentState = getCurrentState()
    const stateString = JSON.stringify(currentState)

    // Don't save if state hasn't changed
    if (stateString === lastSavedState.current) {
      return
    }

    lastSavedState.current = stateString

    setHistory((prev) => {
      // Remove any future states if we're not at the end
      const newHistory = prev.slice(0, historyIndex + 1)
      newHistory.push(currentState)

      // Limit history size
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift()
        return newHistory
      }

      return newHistory
    })

    setHistoryIndex((prev) => Math.min(prev + 1, MAX_HISTORY - 1))
  }, [getCurrentState, historyIndex])

  // Apply a state from history
  const applyState = useCallback(
    (state: HistoryState) => {
      isUndoRedoAction.current = true
      store.setTheme(state.theme)
      store.setAuthor(state.author)
      store.setContent(state.content)
      store.setClient(state.client)
      store.setPrivacy(state.privacy)
      // Note: metrics and images would need dedicated setters in the store
      // For now, we'll update what we can
      lastSavedState.current = JSON.stringify(state)
    },
    [store]
  )

  // Undo action
  const undo = useCallback(() => {
    if (historyIndex <= 0) return

    const newIndex = historyIndex - 1
    const previousState = history[newIndex]

    if (previousState) {
      applyState(previousState)
      setHistoryIndex(newIndex)
    }
  }, [history, historyIndex, applyState])

  // Redo action
  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return

    const newIndex = historyIndex + 1
    const nextState = history[newIndex]

    if (nextState) {
      applyState(nextState)
      setHistoryIndex(newIndex)
    }
  }, [history, historyIndex, applyState])

  // Save initial state
  useEffect(() => {
    if (history.length === 0) {
      const initialState = getCurrentState()
      setHistory([initialState])
      setHistoryIndex(0)
      lastSavedState.current = JSON.stringify(initialState)
    }
  }, [getCurrentState, history.length])

  // Debounced state saving - save after changes settle
  useEffect(() => {
    const timer = setTimeout(() => {
      saveState()
    }, 500)

    return () => clearTimeout(timer)
  }, [
    store.content,
    store.author,
    store.theme,
    store.metrics,
    store.images,
    store.client,
    store.privacy,
    saveState,
  ])

  return {
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    historyLength: history.length,
    currentIndex: historyIndex,
  }
}

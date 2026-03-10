'use client'

import { useState, useCallback } from 'react'
import type { TerminalLine } from '@/lib/commands/types'

export interface HistoryEntry {
  id: string
  command?: string
  lines: TerminalLine[]
}

interface TerminalState {
  history: HistoryEntry[]
  inputValue: string
  commandHistory: string[]
  commandHistoryIndex: number
  inputEnabled: boolean
}

export function useTerminal() {
  const [state, setState] = useState<TerminalState>({
    history: [],
    inputValue: '',
    commandHistory: [],
    commandHistoryIndex: -1,
    inputEnabled: false,
  })

  const appendOutput = useCallback((lines: TerminalLine[], command?: string) => {
    setState((prev) => ({
      ...prev,
      history: [
        ...prev.history,
        {
          id: `${Date.now()}-${Math.random()}`,
          command,
          lines,
        },
      ],
    }))
  }, [])

  const clearHistory = useCallback(() => {
    setState((prev) => ({ ...prev, history: [] }))
  }, [])

  const setInputValue = useCallback((value: string) => {
    setState((prev) => ({ ...prev, inputValue: value, commandHistoryIndex: -1 }))
  }, [])

  const enableInput = useCallback(() => {
    setState((prev) => ({ ...prev, inputEnabled: true }))
  }, [])

  const pushCommandHistory = useCallback((cmd: string) => {
    setState((prev) => ({
      ...prev,
      commandHistory: [cmd, ...prev.commandHistory].slice(0, 100),
      commandHistoryIndex: -1,
      inputValue: '',
    }))
  }, [])

  const navigateCommandHistory = useCallback(
    (direction: 'up' | 'down', currentHistory: string[]) => {
      setState((prev) => {
        const maxIndex = currentHistory.length - 1
        let newIndex = prev.commandHistoryIndex

        if (direction === 'up') {
          newIndex = Math.min(newIndex + 1, maxIndex)
        } else {
          newIndex = Math.max(newIndex - 1, -1)
        }

        return {
          ...prev,
          commandHistoryIndex: newIndex,
          inputValue: newIndex === -1 ? '' : currentHistory[newIndex] ?? '',
        }
      })
    },
    []
  )

  return {
    history: state.history,
    inputValue: state.inputValue,
    commandHistory: state.commandHistory,
    commandHistoryIndex: state.commandHistoryIndex,
    inputEnabled: state.inputEnabled,
    appendOutput,
    clearHistory,
    setInputValue,
    enableInput,
    pushCommandHistory,
    navigateCommandHistory,
  }
}

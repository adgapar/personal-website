'use client'

import { useState, useCallback } from 'react'
import type { TerminalLine } from '@/lib/commands/types'

export interface HistoryEntry {
  id: string
  command?: string
  lines: TerminalLine[]
}

interface TerminalState {
  bootLines: TerminalLine[]       // boot sequence, always visible at top
  initOutput: TerminalLine[]      // whois output, always visible below boot
  response: TerminalLine[] | null // latest command response, replaces on each command
  inputValue: string
  commandHistory: string[]
  commandHistoryIndex: number
  inputEnabled: boolean
}

export function useTerminal() {
  const [state, setState] = useState<TerminalState>({
    bootLines: [],
    initOutput: [],
    response: null,
    inputValue: '',
    commandHistory: [],
    commandHistoryIndex: -1,
    inputEnabled: false,
  })

  const appendBoot = useCallback((lines: TerminalLine[]) => {
    setState((prev) => ({ ...prev, bootLines: [...prev.bootLines, ...lines] }))
  }, [])

  const setInitOutput = useCallback((lines: TerminalLine[]) => {
    setState((prev) => ({ ...prev, initOutput: lines }))
  }, [])

  const setResponse = useCallback((lines: TerminalLine[], command?: string) => {
    const echo: TerminalLine[] = command ? [{ content: command, style: 'command' }] : []
    setState((prev) => ({ ...prev, response: [...echo, ...lines] }))
  }, [])

  const clearResponse = useCallback(() => {
    setState((prev) => ({ ...prev, response: null }))
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
        if (direction === 'up') newIndex = Math.min(newIndex + 1, maxIndex)
        else newIndex = Math.max(newIndex - 1, -1)
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
    bootLines: state.bootLines,
    initOutput: state.initOutput,
    response: state.response,
    inputValue: state.inputValue,
    commandHistory: state.commandHistory,
    inputEnabled: state.inputEnabled,
    appendBoot,
    setInitOutput,
    setResponse,
    clearResponse,
    setInputValue,
    enableInput,
    pushCommandHistory,
    navigateCommandHistory,
  }
}

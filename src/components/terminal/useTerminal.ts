'use client'

import { useState, useCallback } from 'react'
import type { TerminalLine } from '@/lib/commands/types'

export interface HistoryEntry {
  id: string
  command?: string
  lines: TerminalLine[]
}

interface TerminalState {
  // Boot log accumulates during boot, then is replaced by single command output
  bootLines: TerminalLine[]
  output: TerminalLine[] | null   // null = show boot lines
  inputValue: string
  commandHistory: string[]
  commandHistoryIndex: number
  inputEnabled: boolean
}

export function useTerminal() {
  const [state, setState] = useState<TerminalState>({
    bootLines: [],
    output: null,
    inputValue: '',
    commandHistory: [],
    commandHistoryIndex: -1,
    inputEnabled: false,
  })

  const appendBoot = useCallback((lines: TerminalLine[]) => {
    setState((prev) => ({ ...prev, bootLines: [...prev.bootLines, ...lines] }))
  }, [])

  const setOutput = useCallback((lines: TerminalLine[], command?: string) => {
    // Add a "$ command" echo line at the top if a command was typed
    const echo: TerminalLine[] = command ? [{ content: command, style: 'command' }] : []
    setState((prev) => ({ ...prev, output: [...echo, ...lines] }))
  }, [])

  const clearOutput = useCallback(() => {
    setState((prev) => ({ ...prev, output: [] }))
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
    output: state.output,
    inputValue: state.inputValue,
    commandHistory: state.commandHistory,
    inputEnabled: state.inputEnabled,
    appendBoot,
    setOutput,
    clearOutput,
    setInputValue,
    enableInput,
    pushCommandHistory,
    navigateCommandHistory,
  }
}

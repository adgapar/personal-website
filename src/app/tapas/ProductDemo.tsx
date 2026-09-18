'use client'

import { useState } from 'react'
import PintxoMotion from './PintxoMotion'
import styles from './tapas.module.css'

export default function ProductDemo() {
  const [tool, setTool] = useState<'dictado' | 'acta' | 'assistant'>('dictado')
  const [finished, setFinished] = useState(false)

  return (
    <div className={styles.demo}>
      <div className={styles.demoPicker} role="group" aria-label="Choose a workflow example">
        {(['dictado', 'acta', 'assistant'] as const).map((name) => (
          <button key={name} type="button" aria-pressed={tool === name} onClick={() => { setTool(name); setFinished(false) }}>
            <span aria-hidden>{name === 'dictado' ? '↗' : '≋'}</span> {name === 'dictado' ? 'Dictado' : name === 'acta' ? 'Acta' : 'Your assistant'}
          </button>
        ))}
      </div>
      <div className={styles.demoStage}>
        <div className={styles.demoMenu}><span>● &nbsp; {tool === 'dictado' ? 'Messages' : tool === 'acta' ? 'Project check-in' : 'Your AI assistant'}</span><span>9:41</span></div>
        <div className={styles.demoApp}>
          <div className={styles.demoAppBar}><span aria-hidden>● ● ●</span><span>{tool === 'assistant' ? 'Using the tapas skill' : tool === 'dictado' ? 'A message to the team' : finished ? 'project-check-in.md' : 'A conversation to keep'}</span></div>
          <div className={styles.demoContent} aria-live="polite">
            {tool === 'dictado' ? (
              <><span className={styles.demoRecipient}>To: Design team</span><p className={styles.incoming}>How’s the fix coming along?</p><p className={finished ? styles.outgoing : styles.draft}>{finished ? 'I’ve pushed the fix. Let’s try it together after lunch.' : 'Your next sentence starts here…'}</p><span className={styles.demoResult}>{finished ? 'Text inserted. You choose when to send.' : 'Speak where you already write.'}</span></>
            ) : tool === 'acta' ? (
              <><span className={styles.demoRecipient}>{finished ? 'Markdown · saved on your Mac' : 'Microphone + computer audio'}</span><div className={styles.transcript}><p><small>00:12 · Microphone</small>What should we try next?</p><p><small>00:18 · App audio</small>Let’s start with the onboarding.</p></div><span className={styles.demoResult}>{finished ? 'A readable file, ready for whatever’s next.' : 'Keep the words. Stay in the conversation.'}</span></>
            ) : (
              <><span className={styles.demoRecipient}>You choose the assistant and when to run it.</span><p className={styles.incoming}>What did we decide about onboarding?</p>{finished ? <div className={styles.transcript}><p>Start with onboarding in the next iteration.</p><p><small>Source: Project check-in · 00:18 · App audio</small>“Let’s start with the onboarding.”</p></div> : <p className={styles.draft}>A question for your saved conversations.</p>}<span className={styles.demoResult}>An illustrated answer with a source, not a live AI response.</span></>
            )}
          </div>
        </div>
        <div className={styles.demoCompanion}>
          <PintxoMotion key={`${tool}-${finished}`} active={!finished && tool !== 'assistant'} />
          <div><strong>{tool === 'assistant' ? 'Your files. Your workflow.' : finished ? (tool === 'dictado' ? 'Words delivered.' : 'Conversation saved.') : (tool === 'dictado' ? 'A thought, out loud.' : 'Good company.')}</strong><span>{finished ? 'Back to your day.' : 'Small tools. Right where you need them.'}</span></div>
        </div>
      </div>
      <div className={styles.demoControls}>
        <span>{tool === 'dictado' ? 'Voice → your app' : tool === 'acta' ? 'Conversation → Markdown' : 'Recordings → useful context'}</span>
        <button type="button" onClick={() => setFinished(!finished)}>{finished ? 'Replay example ↺' : tool === 'dictado' ? 'See the words land →' : tool === 'acta' ? 'See the saved file →' : 'See an example answer →'}</button>
      </div>
      <p className={styles.demoCaption}>Illustrated workflow · sample content · no recording</p>
    </div>
  )
}

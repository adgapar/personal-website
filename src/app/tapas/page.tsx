import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ProjectBrowser from '@/components/studio/ProjectBrowser'
import styles from './tapas.module.css'
import ProductDemo from './ProductDemo'
import PintxoMotion from './PintxoMotion'

const downloadUrl = 'https://github.com/adgapar/tapas/releases/latest/download/tapas.dmg'
const github = 'https://github.com/adgapar/tapas'
const description = 'Free local dictation and meeting capture for Mac. Full transcripts in your files, a skill for your own AI assistant, and workflows you control.'

export const metadata: Metadata = {
  title: 'tapas — Small tools. Good company.',
  description,
  alternates: { canonical: '/tapas', types: {} },
  openGraph: {
    title: 'tapas — Small tools. Good company.',
    description,
    url: '/tapas',
    images: [{ url: '/tapas/icon.png', width: 1024, height: 1024, alt: 'The colorful tapas pintxo' }],
  },
  twitter: { card: 'summary', title: 'tapas — Small tools. Good company.', description, images: ['/tapas/icon.png'] },
}

function Download() {
  return <a className={styles.download} href={downloadUrl}>Download for Mac <span aria-hidden>↓</span></a>
}

export default function TapasPage() {
  return (
    <ProjectBrowser active="tapas">
        <main className={styles.page} id="tapas">
          <nav className={styles.nav} aria-label="tapas">
            <a href="#tapas" className={styles.wordmark}><Image src="/tapas/icon.png" alt="" width={36} height={36} />tapas</a>
            <div><a href="#why">Why tapas</a><a href="#tools">Capture</a><a href="#workflows">Use your words</a><a href="#install">Install</a><a href={github}>GitHub ↗</a></div>
          </nav>
          <section className={styles.hero}>
            <div>
              <p className={styles.eyebrow}>Your voice. Your files. Your assistant.</p>
              <h1>tapas<span>Small tools.<br />Good company.</span></h1>
              <p className={styles.intro}>Full transcripts.<br className={styles.desktopBreak} /> Your own workflows.</p>
              <p className={styles.description}>Dictate into any app. Keep meeting transcripts on your Mac. Install the tapas skill for your own agent and decide what happens next.</p>
              <Download />
              <p className={styles.requirements}>Free · No tapas subscription · Apple silicon · macOS 15+</p>
              <p className={styles.powered}>Local transcription powered by <a href="https://desertant.com/">Desert Ant Labs ↗</a></p>
            </div>
            <section className={styles.identity} id="why" aria-labelledby="identity-heading">
            <figure>
              <PintxoMotion interactive />
              <figcaption>Meet the pintxo.</figcaption>
            </figure>
            <div>
              <p className={styles.eyebrow}>A little about the name</p>
              <h2 id="identity-heading">Why tapas?</h2>
              <p>Tapas are small Spanish dishes enjoyed together, often over a conversation. That’s the idea here too: small tools, each with a clear job, ready when you need them. Use one on its own or bring a few together.</p>
              <p><strong>Dictado</strong> means dictation: a thought put into words. An <strong>acta</strong> is a written record of a meeting: a conversation you can return to.</p>
              <p>The colorful mark is a <strong>pintxo</strong>, inspired by the Basque bite held together with a small pick. Its four ingredients bring warmth and personality to the tools. Small tools. Good company.</p>
            </div>
          </section>
          </section>
          <div className={styles.benefits}><span><b>01</b> Full transcripts, in your files</span><span><b>02</b> Bring your own agent</span><span><b>03</b> Free to use</span></div>
          <div className={styles.workflowDemo}><ProductDemo /></div>
          <section className={styles.philosophy} aria-labelledby="why-heading">
            <div><p className={styles.eyebrow}>Why I’m building tapas</p><h2 id="why-heading">Keep the source.<br />Choose what comes next.</h2></div>
            <div><p>I want the full transcript somewhere I can reach it. A summary is useful, but I also want to revisit what was actually said, ask a different question, and give my agent the original context.</p><p>If you already use a personal agent, you don’t need another subscription just to turn a conversation into something useful. tapas supplies local transcription, ordinary Markdown files, and a skill that helps your agent find and use them.</p><p>You choose the model, the instructions, the output, and the tools it connects to. Your conversations become source material for your own system.</p></div>
          </section>
          <section className={styles.tools} id="tools" aria-labelledby="tools-heading">
            <div className={styles.sectionHeading}><p className={styles.eyebrow}>Two small tools</p><h2 id="tools-heading">A thought. A conversation.<br />A place for both.</h2></div>
            <div className={styles.cards}>
              <article className={`${styles.card} ${styles.dictado}`}>
                <div className={styles.toolTitle}><span>01 / Dictado</span><kbd>⌃ ⌥</kbd></div>
                <h3>Speak your next sentence.</h3>
                <p>A message, a note, a whole paragraph. Press Control–Option, speak, then press again to put your words in the app you were using.</p>
                <div className={styles.example}>
                  <span className={styles.exampleLabel}>Example · a message to your team</span>
                  <p>“I’ve pushed the fix. Let’s try it together after lunch.”</p>
                  <div className={styles.exampleResult}><span aria-hidden>↳</span> Your words, ready in your message.</div>
                </div>
                <p className={styles.detail}>Your shortcut. Optional live words. Optional local history.</p>
              </article>
              <article className={`${styles.card} ${styles.acta}`}>
                <div className={styles.toolTitle}><span>02 / Acta</span><kbd>⌃ ⇧ M</kbd></div>
                <h3>Stay in the conversation.</h3>
                <p>Capture your microphone and computer audio in one place. Pause when you need to. Finish with a timestamped Markdown transcript.</p>
                <div className={styles.example}>
                  <span className={styles.exampleLabel}>Example · a project check-in</span>
                  <p><time>00:12 · Microphone</time>What should we try next?</p>
                  <p><time>00:18 · App audio</time>Let’s start with the onboarding.</p>
                </div>
                <p className={styles.detail}>tapas can suggest Acta when a meeting app uses your microphone. You choose whether to record; sessions started from a suggestion can finish and save automatically.</p>
              </article>
            </div>
          </section>
          <section className={styles.files} aria-labelledby="files-heading">
            <div><p className={styles.eyebrow}>Your files are the interface</p><h2 id="files-heading">The conversation ends.<br />The words stay useful.</h2><p>Acta saves the full timestamped transcript as ordinary Markdown in a folder you choose. It is already a file on your Mac, ready to read without an export step. Open it in your editor, search it with a script, or use the tapas skill with Claude Code, Codex, or Cursor to find a decision and cite the recording.</p><p>Capture on your Mac. Keep your files.<br />Choose what gets access.</p><a href={`${github}/blob/main/docs/ASSISTANTS.md`}>Use with your AI assistant ↗</a></div>
            <div className={styles.fileExample}>
              <div className={styles.fileHeader}>~/Documents/tapas/ <span>Example workflow</span></div>
              <pre>{'# Project check-in\n\n00:12 · Microphone\nWhat should we try next?\n\n00:18 · App audio\nLet’s start with the onboarding.'}</pre>
              <div className={styles.prompt}><span>Ask your assistant</span>“What did we decide about onboarding?”</div>
              <p>Install the tapas skill during onboarding or in Preferences → Use with your AI assistant.</p>
            </div>
          </section>
          <section className={styles.workflows} id="workflows" aria-labelledby="workflows-heading">
            <p className={styles.eyebrow}>Capture is the beginning</p>
            <h2 id="workflows-heading">Your agent. Your way of working.</h2>
            <p className={styles.workflowIntro}>Use the agent you already have: Claude Code, Codex, or Cursor. The tapas skill helps it search your recordings, follow your templates, and cite the source. You keep your own instructions and integrations.</p>
            <div className={styles.workflowGrid}>
              <article><span>01 / After a conversation</span><h3>Notes your way.</h3><p>“Make notes from yesterday’s meeting using my template.”</p><small>Decisions and action items, with source citations. Edit the Markdown template to make the next set of notes yours.</small></article>
              <article><span>02 / Across your week</span><h3>Connect the dots.</h3><p>“Review this week’s recordings and save a project update.”</p><small>Use several conversations to review commitments, prepare for a follow-up, or develop an idea. Save the result wherever you work.</small></article>
              <article><span>03 / Your connected tools</span><h3>Build your own flow.</h3><p>“Turn the agreed actions into tasks in my project tracker.”</p><small>With the MCP connections you configure in your agent, recordings can feed your existing tools. Set up routines and automations there, using tapas as the source.</small></article>
            </div>
            <p className={styles.workflowNote}>tapas is free. Your chosen assistant and connected services keep their own pricing. You run these tasks in your assistant. tapas handles local capture and supplies the skill, templates, and playbooks; it does not automatically generate notes or run an agent. Dictation history is optional and must be enabled to review saved takes.</p>
            <a href={`${github}/blob/main/docs/ASSISTANTS.md`}>Explore assistant workflows ↗</a>
          </section>
          <section className={styles.future} aria-labelledby="future-heading">
            <p className={styles.eyebrow}>Small tools, a bigger direction</p>
            <h2 id="future-heading">More tools. Still your flow.</h2>
            <p>Dictado and Acta are the beginning. I want to add more small tools that do a clear job, give you useful source material, and fit into the way you already work. The direction stays the same: your files, your agent, your choice of what to build around them.</p>
          </section>
          <section className={styles.install} id="install" aria-labelledby="install-heading">
            <p className={styles.eyebrow}>Pull up a chair</p>
            <h2 id="install-heading">Make yourself at home.</h2>
            <ol><li><span>01</span><div><h3>Download & drag.</h3><p>Download and open tapas.dmg, then drag tapas into Applications.</p></div></li><li><span>02</span><div><h3>A quick hello.</h3><p>Allow access, choose your transcript folder, and prepare the local voice model. First-time preparation can take several minutes.</p></div></li><li><span>03</span><div><h3>Choose what comes next.</h3><p>Try a practice take or install the optional skill for your AI assistant. Starter templates are yours to edit. tapas stays in your menu bar and updates automatically.</p></div></li></ol>
            <Download /><p className={styles.requirements}>Free · Apple silicon · macOS 15+ · Signed & notarized</p>
            <p className={styles.privacy}>No tapas account required. Audio and transcripts are processed locally. Model downloads, SDK usage/licensing reporting, and app updates use the network. If you use an AI assistant, it may send the text it reads to its own provider.</p>
          </section>
          <footer className={styles.footer}><p>A small tool by <Link href="/">Adilet</Link>.<br /><span>Inspired by small dishes and good conversations.</span><br /><a href="https://desertant.com/">Powered by Desert Ant Labs ↗</a></p><div><a href={github}>GitHub ↗</a><a href={`${github}/releases`}>Release notes ↗</a><a href={`${github}/issues`}>Feedback ↗</a></div></footer>
        </main>
    </ProjectBrowser>
  )
}

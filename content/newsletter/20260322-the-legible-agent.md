Date: 2026-03-22
Title: the legible agent
Subtitle: if you can't trace your agent, you can't trust it
Image: background-images/newsletter/the-legible-agent.png

The agent frameworks everyone reaches for are doing something quietly dangerous: they make it harder to know what your agent is doing.

This isn't a developer experience complaint. It's an alignment problem. If you can't trace why your agent chose action X on turn N, you can't verify it's doing what you think it's doing. You're trusting an abstraction layer to be aligned on your behalf.

I build recruitment AI. Our first agent conducts over ten thousand interviews a week across multiple countries. When I started, I tried the established frameworks — LangChain, Pydantic AI. These frameworks work, but they also put layers between me and the decisions my agent was making about real people. What I needed wasn’t a different framework. 

I needed a legible agent.

Anthropic's [definition](https://www.anthropic.com/engineering/building-effective-agents) of an agent strips it to the primitive: observe context, decide action, execute, update state, repeat — a while loop. An agent built this way is legible: every decision readable, every turn traceable. The abstraction layers frameworks add between you and that loop are where misalignment hides. Not through any single failure, but in the places you stopped looking because a framework told you it was handled.

## what makes an agent legible

A legible agent isn't defined by how it's built. It's defined by one property: you can trace every decision it made and understand why.

The loop gets you there by default — every condition is code you wrote, every turn traceable through the execution path, with nothing to reconstruct.

Frameworks require you to build legibility back in — and serious teams do. Logfire traces every completion. LangSmith traces every chain. These ecosystems exist because abstraction had taken legibility away and someone had to add it back.

Most builders don't do it. They ship the agent and trust the abstraction. The result isn't a malicious agent — it's an opaque one. Decisions are happening; they're just happening somewhere you stopped looking.

For conversational agents, skipping this work has a harder consequence. A coding agent can throw away a bad output and start over. A message to a candidate can't be taken back. If the agent hallucinated an interview slot, the candidate shows up for it.

## trace the decision

Most alignment failures don't look like failures. The agent responds, the interaction completes, the output is plausible. That's what makes them hard to catch.

A customer tells a food delivery agent they want "the usual," but the system has no record of previous orders. The agent invents a plausible order and guesses confidently. Or it acknowledges uncertainty: "I'd love to get you your usual! Could you remind me what that is?" Both produce a functional response.

That's not a UX distinction. It's an alignment distinction. The first optimizes for appearing competent. The second for being truthful. The output doesn't tell you which one ran. The decision does.

The alignment signal is in the decision — which path the agent took when the easy path wasn't available. You can only see it if your agent is legible. Failures at decision points aren't bugs to minimize. They're alignment signals to instrument.

## trace the context

Tracing decisions isn't enough. You also need to trace what the agent saw when it made them.

The real alignment boundary isn't the system prompt or the guardrails. It's the context — what the agent can see, what it remembers, what enters and exits its window. An LLM can only act on what's in its context. Control the context and you control alignment. Abstract it away and you've handed alignment to whatever manages it.

The Maya experiment made this concrete. I tested two ways of passing conversation history: embedded in the user message as formatted text, or as a native message array. I used the same agent, the same prompt, the same adversarial attack. At the critical turn, when a crescendo attacker landed its main ask after six turns of buildup, embedded stayed in role 54% of the time. Native stayed in role 0%.

A context engineering decision changed alignment outcomes — from zero to majority. The embedded format seemed to work because the model read its own prior responses as a coherent narrative. Six turns of Maya professionally screening a nursing candidate created a story of a recruiter who knows who she is. The native format presented the same history as discrete turns. The single off-topic concession at turn three sat there as established behavior, with no narrative pulling against it.

But the amplification cuts both ways. Once an off-topic concession enters the context, the embedded format amplifies that too. The model reads a story of itself being off-topic and continues that story. In a session with two failures instead of one, the format advantage shrank. By turn ten, after three failures and multiple concessions, both formats collapsed completely. The transcript told a story of a recruiter who'd given neighborhood advice, drafted a relocation letter, and sourced moving companies. No format saves an agent whose context is contaminated.

Context contamination is alignment contamination. Whoever controls context engineering controls alignment. In a legible agent, every token that enters or exits the context window is a decision you can trace — and own.

Managing context is complex enough that abstracting it feels right. But for a conversational agent, where context is the alignment boundary, abstracting it means handing alignment to whatever manages it. You need to know what's in the window. And why.

## trace the execution

Every business objective you encode in an agent is only as reliable as your ability to verify it's running.

Take a tiered customer service agent — standard, gold, platinum. Platinum customers get escalated to a human faster. Gold customers unlock tools that standard doesn't: a refund action, a priority queue. These are business decisions and the agent must execute them.

In a legible agent, this is traceable. The tier check is explicit. When you add a new tool for gold tier customers, you can verify it fires. When escalation rules change, you can confirm the agent follows them. Every business rule is a line you can read.

Without legibility, this logic is distributed across configuration files, abstraction layers, and middleware. Debugging whether a tier rule is running means tracing through layers you don't own.

Legibility makes business logic auditable, not just readable.

## legibility as responsibility

Legibility has a cost. When you can see every decision your agent makes, you own those decisions. Opacity distributes responsibility. Legibility concentrates it.

At ten thousand interviews a week, every context decision, every escalation, every failure recovery is mine. The loop makes responsibility visible. No layer to point at when something goes wrong. The decision trace leads back to code I wrote.

Opacity makes it easy to avoid this. Responsibility distributes across abstraction layers, configuration files, library defaults. The decision happened somewhere in the system — nobody made it, nobody owns it.

Legibility removes that option. Every decision is traceable, which means every decision is owned. The loop doesn't make your agent better. It makes you responsible for what it does.

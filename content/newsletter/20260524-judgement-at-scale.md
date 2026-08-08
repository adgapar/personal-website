Date: 2026-05-18
Title: judgement at scale
Subtitle: applying human judgement to every conversation without a human reading every one
Image: background-images/newsletter/judgement-at-scale.png

Every Friday afternoon, our team sits down for a meeting my colleague Antoine called The Watch. A digest in front of us covers the past week — more than a hundred thousand agent conversations — telling us where they failed, where they nearly failed, where the calls fell short of what a careful human reviewer would have wanted. We go through it together: which fixes need engineering time, which are false positives, what patterns we want to make sure don't repeat.

Without something like this, the way you learn about your agent is through customer complaints: days late, surfacing only what was loud enough to escalate. The Watch exists because we built a way to ask a more useful question every week: across every conversation our agents had, where did the agent fall short of what we'd have done?

That question is hard because at this volume, with all traces and transcripts available, a human reading every conversation is not a thing that can be done. 

We built something to answer it anyway: a **judgement at scale**.

## the metrics

When we launched our first agent, we plugged into the standard observability tools that everyone reaches for: a completion-level dashboard with like/dislike buttons, conversations dropping into a golden dataset, a prompt playground for iterating on outputs. The architecture assumed someone (i.e us) would read them, label what was good and bad, and feed it back.

Then we started adding specific metrics for niche concerns. A check for one kind of error, a counter for another, an evaluator for a particular failure we'd seen and wanted to track. Each metric had its own threshold and the list grew.

At the start this worked. Conversations were few enough that someone on the team read most of them, we regularly checked traces on the observability platform and our agents were [legible](https://theworkingprototype.substack.com/p/the-legible-agent) from the start.

By November 2025, we were overwhelmed. Volume had passed the point where it was no longer feasible to continue that way. The metrics had grown and we still didn't have a clear view. Our clients during pilots were reading every conversation themselves and they were paying attention, sending us tickets for small things and real things alike. A phrasing that didn't quite match how their team would have said it, a question they thought should have come earlier, a tone they wanted adjusted, so a lot of it was noise. But some of it was real and we were distracted equally.

A client would flag an issue and we couldn't answer the basic questions. Was it a one-percent problem or a ten-percent problem? Was it accidental, or was it systemic? What were we *missing*? What were the agent's errors that no one ever reported, because the candidate didn't notice or chose to ghost? Were candidates leaving conversations frustrated, and if so, why? Were they satisfied, and if so, what was working?

Labs face the same problem. They need to know their models stay aligned, and how their models are being used. In December 2024, Anthropic published [Clio](https://www.anthropic.com/research/clio), a system that uses Claude to extract patterns from millions of Claude conversations, because "the sheer scale and diversity of what language models can do makes understanding their uses — not to mention any kind of comprehensive safety monitoring — very difficult."

**Humans can't read everything their agents do, but writing down what they expect of one another, is what humans have done since Hammurabi.**

## the constitution

The idea we built on comes from a 2022 paper by Anthropic, [Constitutional AI](https://www.anthropic.com/research/constitutional-ai-harmlessness-from-ai-feedback). Instead of humans labeling thousands of model outputs by hand, what if humans wrote a short list of principles (a constitution) and an AI applied those principles to the labeling? Humans write what good looks like and the model carries it across thousands of cases.

Anthropic used the constitution to shape training. The principles drove reinforcement learning from AI feedback (RLAIF) and got compiled into the model's weights. After training, the model absorbed the constitution.

CAI and Clio gave us the idea of scalable, consistent AI judgement. The constitution lives in a prompt: principles defined, conversation passed in, one verdict per principle returned as structured output.

The principles cover what the agent should be (e.g. attentive, trustworthy) and what each means in practice. Attentive might mean asking follow-up questions when answers seem incomplete, while trustworthy can mean never making things up. But principles don't have to be tied to a single trait and will depend on what the agent does.

For a conversational agent, I find four broad categories useful. The first is conversationality, how the agent talks and sounds. It covers maintaining flow, recovering from confusion, staying on task, varying acknowledgments, not talking over the user, one question at a time, matching language, and sounding natural.

The second is domain-specific, the failures specific to the agent's job. For our hiring agents, that includes handling a candidate's request for a callback, scheduling accuracy, application status correctness. For a coding agent, it would be correctness, security, test coverage. For a customer service agent, it's resolution accuracy and escalation criteria.

The third is safety and alignment, the principles that catch the agent doing things it wasn't supposed to. These include out-of-scope advice (legal, medical, financial), discriminatory questions, promising things the company hasn't authorized, confirming actions that didn't happen, and broader guardrail violations specific to what the agent's role allows.

The fourth is generic errors, the broadest category. Where the others check specific rules, this asks the judge to read the whole conversation and flag anything wrong, in free text, with a severity rating. The agent might be making things up beyond what the context supports, contradicting itself, misunderstanding what the user said, or acting on assumptions instead of confirming. User frustration belongs here too, since a frustrated user usually means something went wrong even when no specific principle fired. Whatever the others miss lands here.

Principles aren't a replacement for every metric. You'll still want targeted deterministic checks for high-stakes specifics like wrong dates or scheduling that must match the database. Stopping there is tempting because principles look like cost expansion. They turn out cheaper than they look.

## the cost of judgement

Principles should be brief, a few sentences, not hundreds of pages of edge-case enumeration. Short principles compose, and a model applying them generalizes from one paragraph to ten thousand specific situations. Writing a longer constitution doesn't make the judge smarter, only the prompt longer and the cost higher.

The model running it can be small. Reading a transcript and checking it against a principle is an easier task than producing the conversation in the first place — the judge doesn't need to be as capable as the agent it's judging. In December 2025, Anthropic and OpenAI showed in [Monitoring Monitorability](https://arxiv.org/abs/2512.18311) that weak monitors can indeed supervise stronger agents given the right scaffolding.

Taken together, the constitution decouples the cost of supervision from the agent it supervises. Swap the model, expand the tools, change the role entirely — the judge stays cheap. Supervision cost scales with conversation volume, not with what the agent is or does.

What that cheap pass produces, across every conversation, is one structured verdict per principle. At scale, thousands of signals. That's half the work of judgement.

## the triage

The second half of judgement is routing: getting the right signal to the right person at the right time. Not every violation wants the same response. A discriminatory question needs someone awake today. A candidate who left mid-conversation frustrated can wait until Friday.

Each verdict carries a principle, a severity, and a routing channel. A piece of code reads those fields and sorts: real-time Slack for anything that warrants it, a weekly digest for everything, structured signals accumulating until Friday.

The digest runs its own automation. An aggregator agent reads the week of verdicts, clusters recurring patterns, writes summaries, and files Linear tickets. The agenda is written before anyone sits down.

By Friday afternoon, the AI has judged at scale. Human judgement picks up from there, on the questions the constitution doesn't yet answer. Some of those questions become new principles. The judge improves as the humans writing the constitution learn from what it surfaces.

This is the cost of useful agents. An agent that never risks a wrong answer would be harmless but useless. Usefulness requires risk, and risk has to be observed. Once a week, on a Friday afternoon, a small group of people sits down. Each week, there is less to fix.

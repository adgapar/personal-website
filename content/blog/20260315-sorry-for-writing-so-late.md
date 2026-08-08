Date: 2026-03-15
Title: sorry for writing so late
Subtitle:
Image: background-images/sorry-for-writing-so-late.png
-------------------------------------------------------

In Barcelona, when a restaurant posts a waiter position, five hundred people apply in a week. One HR manager can't call all of them to ask where they live — that's not a bottleneck, it's an impossibility. And that's the whole business case, right there.

We built Maria to make that first call.

## the agent we built

Maria lives in WhatsApp. She asks candidates about their experience, their shift preferences, whether they have a work visa, whether they live within thirty minutes of the restaurant — the basic things that aren't in a CV but determine in sixty seconds whether someone is worth a recruiter's time. She conducts the first screen so a human doesn't have to.

What we didn't know was what would happen when she met real people.

## two fears

Before we launched, we had two fears.

The first was that Maria would say something embarrassing. Our first version did. A cofounder was testing it and casually mentioned needing to travel to Paris before an interview. Maria — helpfully, eagerly — found flights and sent links. You can't just write "don't do this" in a prompt and expect the model to hold the line under pressure. The first version proved that.

The second fear was more existential: that candidates wouldn't talk to an AI at all. Our entire product depended on this. If people felt deceived or refused outright, there was nothing to build. We were launching something we weren't sure anyone wanted.

These fears shaped everything we built. Then reality arrived and surprised us.

## what actually happened

Our first client was a network of private hospitals hiring nurses. We were nervous about it — nurses are professionals who've seen plenty of bad chatbots, and we expected skepticism.

Instead they were polite. Not reluctantly tolerant, but genuinely courteous. Many of them thanked Maria for the opportunity to share more about their experience, and dozens sent thoughtful answers about their shift availability, their certifications, what procedures they knew.

I was reading every conversation in those early weeks. One night, a nurse sent a message after her shift sometime around 1 AM and added: "Sorry for writing so late."

She was apologizing to an AI.

Not because she'd been deceived — she was just extending the same courtesy she'd extend to any stranger who might matter. You don't write to someone at 1 AM without acknowledging it. It felt strange to think about, and then it felt important. She wasn't naive; she was being human, and that distinction matters.

Our second client was a chain of casual restaurants. The candidates were twentysomethings applying to be waiters, and they brought completely different energy — jokes, emojis, the occasional heart. Some of them eventually figured out they might be talking to an AI and started asking playful questions about it, and Maria handled it with her version of a shrug and a redirect. Later, one of the new hires was introduced to the recruiter who'd managed the process. He said: "Oh, I think I already spoke with your colleague Maria."

Colleague. Not "the bot." Colleague.

## the one who called the police

Not every conversation went that well.

One French candidate applying for a waiter position in Barcelona became suspicious and decided the whole thing was a scam. Maria told him — correctly — that he could verify by going to the restaurant in person. So he did. He walked into one of the locations, but the staff there had never heard of the pilot — the HR team was running it without fully notifying every branch. He found a manager who looked at him blankly, came back to WhatsApp, and told Maria he was filing a police report.

Then he filed one.

That bug cost us a candidate and came close to costing us much more. The fix was embarrassingly simple: a verified WhatsApp business account, an HR email in the profile, a phone number where someone could confirm the company was real. We hadn't thought of it because we were focused on the agent's conversation logic and edge case handling — not on a person standing in a restaurant asking an employee who'd never heard of us.

## the hardest part wasn't the technology

We spent weeks on personality. Not in the sense of writing "be friendly and empathetic" in a system prompt — that does almost nothing — but in the sense of defining specific behaviors for specific situations.

The example that forced us to think carefully was this: what should Maria do when a candidate says a parent died? "Be empathetic" is not an answer. An empathetic response from a stranger is different from one from a friend, and Maria is not a friend — she's a recruiter's assistant. The right behavior was to express condolences briefly, say "take your time, I'll write again later," and stop.

That last part required building actual infrastructure. Maria needed to schedule a follow-up, create a reminder, come back to the conversation at the right moment. Behavior that sounds simple in a prompt description requires functionality to support it. Personality drags engineering behind it.

We also added a three-second pause before Maria responds. It sounds trivial, but it changed how candidates experienced the conversation. A response that arrives in milliseconds reads as a machine; a response that arrives after a moment reads as someone who considered what you said. We kept messages short too — no bullet-pointed paragraphs, no structured summaries. People in WhatsApp don't write like that, and Maria shouldn't either.

Those details moved the needle more than any model upgrade.

## what reading everything taught us

In the early weeks, we read every conversation — all of them. Paul Graham writes about doing things that don't scale. This was that.

A bug in the voice agent's calling loop one summer had it phone the same nurse ten times in a row, and we only found out because we were reading. A candidate said "call me tomorrow" and meant it conversationally; Maria scheduled the call for 12:01 AM — technically tomorrow — and woke her up. We discovered that some candidates wanted to withdraw mid-conversation after learning the salary or thinking through the commute, but we hadn't built a graceful exit for them, so they just went silent while we kept sending follow-ups. That became a feature we hadn't planned for.

None of this would have been findable from outside the conversations. You can't design for the candidate who stands in a restaurant, or the nurse who gets ten calls, or the person who decides mid-interview they don't want the job. You find them by reading. The conversations are the product spec.

## at scale

The problem is that we're now running tens of thousands of conversations a week across Spain, Mexico, Portugal, Italy, Peru, and the US. I still believe you have to read the conversations — but we can't read them all. Nobody can.

So I built Lucía — lux, light — an agent for scalable supervision. She reads every conversation Maria has and flags the ones that need a human eye. The two signals I trust most are frustration and the Turing test: whether a candidate is visibly angry, and whether Maria sounds like a person. Both are proxies for the same thing — a conversation going somewhere wrong, quietly, that I'd otherwise miss. When Maria sounds cold or mechanical, candidates disengage and don't tell you why. When she sounds like someone paying attention, they answer honestly and you never notice the difference.

It's the same problem the post started with, one layer up. One HR manager couldn't call five hundred candidates. I can't read tens of thousands of conversations. The answer in both cases is to build something that does the first pass — and stay close enough to catch what it misses.

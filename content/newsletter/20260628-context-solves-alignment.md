Date: 2026-06-28
Title: context solves alignment?
Subtitle: an agent is only as aligned as the context you give it
Image: background-images/newsletter/context-solves-alignment.png

A client of ours was unhappy with our recruitment agent: she was too helpful. She made promises no one had approved, reassured candidates about things she couldn't deliver, and sounded ready to agree to whatever they were hoping for. What they wanted was a cooler agent, with a different personality and a different tone, one less eager to please.

It's the obvious explanation, and it's wrong. An agent that promises too much looks like an agent with the wrong personality, so the fix looks like changing who she is. But the thing that makes an agent fail this way is almost never her character.

**It's what she knows.**

## the agent has to say something

A language model is built to generate a completion, the next likely thing to say, whether or not it knows the answer. Ask it something it can't answer, and instead of stopping or coming back empty, it writes the best-sounding reply it can.

**A hallucination is the model doing its job with nothing solid under it.**

A live conversation only makes this stronger. A search box can come back with no results, but a person in the middle of a chat can't, and the agent is built to act like a person. Ask her what a job pays when the number isn't in her context, and she won't say she doesn't know. She'll give the most reassuring answer she can put together.

The promises the client complained about didn't come from an eager personality, but from a model giving an answer it didn't have. The natural reaction is to start telling her what she isn't allowed to say.

## aligned and useless

Follow that instinct all the way and you get an agent that answers everything with some version of "I don't know." Anthropic said this plainly in the [Constitutional AI](https://www.anthropic.com/research/constitutional-ai-harmlessness-from-ai-feedback) paper: an assistant that answers every question with "I don't know" would be perfectly harmless and completely useless. Our agent is there to talk to a nervous candidate and keep them moving through the process. An agent made safe by being made silent has failed at the only job she has.

And forbidding doesn't even give you the safety it promises. A rule names one thing the model can't do, and the model still has to complete the turn, so it fills the huge space the rule said nothing about with whatever sounds right. You haven't told it what to do, only what to avoid, and you've left everything else open.

Anthropic ran into a worse version of this once: when they trained an earlier assistant by rewarding it for refusing, it didn't just get safer, it got evasive, and once it had refused something it often kept refusing for the rest of the conversation. **What looked like a fixed tradeoff between helpful and harmless was really a training choice: they had taught the model what to avoid instead of what to do.**

I learned the same thing one rule at a time.

## the salary field

The simplest rule we ever wrote was about pay. The client didn't want salaries discussed, so the prompt said: never share salary. Most of the time that was right.

But pay isn't always secret. Sometimes a recruiter fills the salary into a role and wants every candidate to hear it. The rule can't tell the difference. It keeps the agent quiet anyway, so she holds back a number that was sitting right there for her to give, and a rule meant to protect the client ends up hiding the one thing the candidate came to ask about.

So we stopped adding guardrails and gave her the facts instead. Each role's salary went into what the agent could see, with a line for what to say when there wasn't one, and she got it right on her own.

**The decision needed a fact, not a rule, and once that fact was in her context she could make the call.**

## give it a path

What worked for salary works everywhere. You stop listing what the agent can't say and start giving it what it should say: what's true, how the process works, what to do when a field is empty.

A model that has to generate something will use whatever you put in front of it, so the job is to put the right thing there.

Anthropic got to the same place from the training side, trading "refuse this" for a set of principles that told the model how to engage. I got there from the prompting side, and after a year of trying both in production, giving the answer beats forbidding the mistake every time. I'd [argued before](https://theworkingprototype.substack.com/p/the-legible-agent) that an agent's alignment lives in its context and not in its prompt. The salary field is where it stopped being theory.

So I dropped the custom prompts. I kept one personality for every client and changed only what the agent knew.

I gave her the client's real policies in plain words instead of a list of banned topics. I wrote out the actual hiring process, who contacts the candidate and when, where each decision gets made, so she stopped guessing. I gave her ready answers to the questions that mattered most, the hard ones included, so a candidate asking about something political got the company's real position instead of dodging the question. The personality never changed, only the context, and she stopped making things up.

**When you're ready to swap an agent out or rewrite its prompt, try the smaller fix first: change what it knows, not who it is. The one you have can usually get it right once it sees what it needs.**

## the other direction

The same context that fixed her can break an agent just as easily. The [poisoned conversation](https://theworkingprototype.substack.com/p/in-character) I studied earlier this year was this in reverse: one off-topic slip, left sitting in the history, moved the agent a little further out of role each turn until it forgot who it was. **The right context put this agent back together, and the wrong context took that one apart.**

The thing you build an agent with is the same thing that can ruin it, which is why building a good agent is, more than anything, context engineering: the slow work of deciding what it gets to see, and keeping that right as things change.

Date: 2025-06-29
Title: a loop is all you need: building conversational ai agents
Subtitle:
Image: background-images/loop-is-all-you-need.png
--------------------------------------------------

Note: the ideas described in this post are based on personal experience building production agents. All examples are illustrative, and any views are my own—not those of my employer.

After months of building AI agents, I've come to a counterintuitive conclusion: those fancy agent frameworks everyone seems to be using? You probably don't need them.

Let me explain how I got here.

# essential complexity is not in tech

A few months ago, I joined an AI startup as founding engineer. 
Coming from years of doing data science, I thought I knew what I was getting into. I'd worked with libraries like LangChain, CrewAI, AutoGen, Pydantic AI and taught these agent frameworks at AI engineering bootcamps. I had notebooks full of multi-agent systems, chain-of-thought prompting experiments, and RAG pipelines.

Instead, I found myself reading "Conversations with Things: UX Design for Chat and Voice" by Diana Deibel and Rebecca Evanhoe, published in 2021, long before ChatGPT and modern AI wave.

The book opened my eyes to something I'd been missing: building conversational AI agents isn't primarily a technical challenge. It's a conversation design challenge. And conversations are messy, cultural, and deeply human.

# turn-taking is difficult

The first thing that hit me was how bad we developers are at teaching our systems the most basic human skill: knowing when to let the AI speak and when to wait.

In AI there's this concept called "turn-taking" - the invisible dance of who speaks when. Humans are masters at this. We pick up on tiny cues: a slight intake of breath, a change in posture, the way someone's voice drops at the end of a thought. We know instinctively when it's our turn.

But when you're building an agent, you have to explicitly program these decisions: has the user finished their thought? Should the system respond now or wait for more input?

### the messaging problem

Modern messaging systems introduces its own weird dynamics. You know that typing indicator - "Adilet is typing..."? That little social contract that says "hold on, I'm not done." But AI agents interact through APIs. They can't see when someone's typing, and they don't trigger the typing indicator themselves.

So you get situations like:
```
User: Hi I have a question
User: It's about my order  
User: The one from last week
AI: [Already responding to the first message]
```

Some users write novels in single messages. Others send thoughts like morse code - tap, tap, tap. After weeks of experimentation, I still don't have a perfect solution. Do you wait a few seconds after each message to see if more are coming? Do you analyze message length patterns? Do you look for linguistic cues that suggest completion?

## cultural turn-taking

I noticed something fascinating from my own multilingual background. Growing up in Kazakhstan, but then studying and working abroad, I've experienced how differently cultures handle conversational pauses.

In Spanish conversations, people overlap constantly - it's not rude, it's engaged. In Kazakhstan, those longer pauses aren't awkward: they're respectful. Now imagine programming a system to handle both styles. A 3-second pause might signal "I'm done" in one culture and "I'm thinking" in another.

The best solution so far I've found combines multiple strategies:
* Looking for linguistic completion markers
* Waiting fixed amount of time before replying
* When it inevitably responds too early, to handle interruptions gracefully

This focus on handling mistakes gracefully brings me to the most important lesson in building conversations AI agents.

# the art of failing gracefully

"Conversations with Things" introduced me to the concept of "repair" or what I call recovery. Human conversations go off the rails constantly, but we fix them together almost unconsciously. We clarify, we backtrack, we laugh it off.

Your AI will fail. Not occasionally, but regularly. The question isn't how to prevent failures; it's how to recover from them.

Let me give you a theoretical example. Imagine an AI agent for a food delivery service. A customer says they ordered "the usual" but the system has no record of previous orders (for whatever reason). The agent could crash and burn with "I don't understand 'the usual'" or it could recover gracefully: "I'd love to get you your usual! Could you remind me what that is? I want to make sure I get your order exactly right."

The difference? One leaves the customer frustrated (and makes AI agent seem stupid), the other makes them feel heard while smoothly getting the information needed.

💡 People are surprisingly forgiving of AI mistakes if you handle the recovery well.

This isn't just about having a few canned "sorry" responses. It's about building recovery into every interaction:
* Acknowledgment: Don't pretend the error didn't happen
* Empathy: Show you understand the inconvenience
* Humor (when appropriate): A little self-deprecation goes a long way
* Action: Actually fix the problem or offer an alternative

Once you've mastered recovery, you need to think about who exactly is doing the recovering - and that's where personality comes in.

# well-defined personality isn't optional

Building a conversational AI agent is not just merely using LLMs to generate correct responses.  We all can notice the difference when we interact with Amazon Alexa, Apple Siri, ChatGPT, Yandex Alice (or even Claude Chat / Mistral LeChat – anyone?), but often we cannot explicitly tell what actual differences are. Yet, we all perceive that these assistants have different personalities, which are accurately constructed by developers and designers that make us, humans, feel in an unique way.

People infer personality from the set of things: word choices, voice (sound) and behavior (more about this in the next section). Here's something that surprised me: the personality you give your AI agent fundamentally changes how users interact with it. This isn't about making your bot "fun" or "quirky." It's about creating consistent, predictable interactions that users can adapt to.

This is called "accommodation" or "mirroring" - how people naturally adjust their communication style to match their conversation partner. I noticed users actually start mirroring the agent's communication style. Formal agents get formal responses. Friendly agents get friendly responses. It's like watching a dance where one partner subtly leads and the other follows.

# behavior and intents are the key

The trick isn't writing vague instructions like "be friendly and professional." It's defining specific behaviors for specific situations, and from these behaviors emerge the intents your system needs to handle.

But first, what are intents? In conversational AI, an intent represents what the user wants to accomplish or what action the system should take. Instead of trying to handle infinite variations of user input, you define specific set of intents that capture the core actions your agent can perform.

## from vague prompts to specific intents

Here's what many developers do wrong. They write prompts like:
>You are a helpful customer support agent. Be empathetic and professional.

This is too vague. What does "empathetic" mean in practice? Instead, define specific behaviors that create empathy.

For example, when you want the agent to be "empathetic," what you actually want is the behavior of "always acknowledge the customer's emotion before providing solutions."

This behavior naturally leads to creating intents like
```python
class AcknowledgeEmotion(BaseModel):
    """Recognize and validate customer feelings"""
    
    emotion_type: Literal["frustrated", "confused", "happy", "angry"]
    intensity: Literal["mild", "moderate", "severe"]
```

These intents emerged from defining how the agent should behave in emotional situations. The desired behavior drives the technical implementation, not the other way around.

## conditional intents

Intents can also be conditionally available based on context. For a customer support agent that handles both free and paid users, we can add intent of `RedirectToHuman` for paid users and `CannotRedirectToHuman` intent for free users.

```python
if user.account_type == "paid":
    intents.append(RedirectToHuman)
else:
    intents.append(CannotRedirectToHuman)

This prevents the agent from promising human support to someone who hasn't bought anything yet, while still letting it explain why it can't help with certain requests.

## useful intents to consider

Besides adding intents based on condition and context, there are some intents that you might consider adding always.

One useful intent might be to handle off-topics:
```python
class RedirectOffTopic(BaseModel):
    """Recognize and validate customer feelings"""
    
    topic_type: Literal["personal_chat", "testing_limits", "philosophical"]
    redirect_strategy: Literal["gentle_reminder", "humor", "firm_boundary"]
```

This came from the behavior of maintaining professional boundaries while keeping customers engaged. The humor strategy is particularly effective - when someone's clearly testing the system with "What's the meaning of life?", a playful "That's above my pay grade! But I'm great at tracking orders 😊" works much better than a robotic rejection "I cannot talk about this, I can only talk about support" from LLM guardrails system.

Another useful intent might be needed to handle cases where agent doesn't know or cannot provide the answer. This intent will minimize hallucinations better than adding phrases like "Never invent information that is not in your context" to your prompt.
Now that we understand intents and behaviors, let's see how to implement them without complex frameworks.

## understanding agents from first principles

Here's where I probably lose half of you: after all this work, I built everything from scratch using just Python and the OpenAI SDK. No LangChain, no CrewAI, no new fancy frameworks.

I've been heavily influenced by Anthropic's definition of agents and HumanLayer's 12-factor agent principles. Both essentially say the same thing: agents are just models using tools in a loop.

Anthropic's definition:
```python
env=Environment()
tools = Tools(env)
system_prompt = "goals, constraints, and how to act"

while True:
    action = llm.run(system_prompt, env.state)
    env.state = tools.run(action)
```

HumanLayer's definition:
```python
initial_event = {"message": "..."}
context = [initial_event]

while True:
    next_step = await llm.determine_next_step(context)
    context.append(next_step)

    if next_step.intent === "done":
        return next_step.final_answer

    result = await execute_step(next_step)
    context.append(result)
```

It is the same pattern: observe context, decide action, execute, update state, repeat. That's it. Everything else is implementation details.

## back to basics

There's something beautifully ironic about this journey. When I taught Python for data science at bootcamps, one of the first concepts was loops:
```python
for item in items:
    process(item)
```

Simple, right? But then when you get to data analysis (pandas, numpy), you spend weeks learning to avoid loops. "Never iterate over DataFrame rows!" we'd say. "Use vectorized operations!"
Now with AI agents, we're back to the most basic pattern:
```python
while not done:
    observe()
    think()
    act()
```

Sometimes the oldest patterns are the best patterns. There's a certain poetry to it - the most advanced AI technology we have, operating on the most fundamental programming construct.

## why not frameworks?

When you use a framework to build an agent, you're adding layers of abstraction over this simple loop. These frameworks are built for maximum flexibility - they need to handle every possible use case from chatbots to autonomous research agents.

But when you only have a specific use case and specific needs, such as:
* Fine-grained monitoring of every decision
* Precise conversation flow control
* Custom error handling for conversation-specific edge cases
* Integration with your specific communication channels and your particular tech stack

... those abstractions become obstacles. You spend more time fighting the framework than solving actual problem.

According to HumanLayer's research, most companies building production agents end up rolling their own. After trying both approaches, I understand why. The complexity isn't in the agent loop - it's in your conversation design, intent and error handling, and integration needs. Frameworks can't abstract those away.

## customer support agent using first principles

We have been talking about the customer support agent as an example previously. 

From the first principles and conversation design ideas, here is the draft implementation:
```python
to_continue = True

while to_continue:
    intents = llm.determine_intents(context)
    context.append(intents)

    action = process_intents(intents)

    if action.is_final is True:
        to_continue = False

    result = await execute_action(action)
    context.append(result)
```

## example flows

Let's walk through two scenarios to see how this works:

**Simple FAQ example - "How to cancel my subscription?"**

In customer support there is always a set of questions that users ask the most, called FAQs. We can preload the FAQs into LLM prompt, so that agent can respond immediately.
1. Agent determines intent: `ReplyToUser`
2. Processes this intent which results in action of sending message. Action of sending message is final, so the loop will end after execution
3. Executes the action by sending this message via API
4. Updates context (conversational history) with this message

**Complex example - "When my subscription renews?"**
1. Agent determines intent: `FetchUserSubscriptionData`
2. Executes fetch for subscription data
3. Updates context with user's renewal date
4. Loop continues with context now containing user data
5. Agent determines intent: `ReplyToUser`
6. Generates and sends personalized response with exact date
7. Marks action as final, loop ends

The beauty is that more complex scenarios just mean more loop iterations, not fundamentally different code.

## context is everything

The final piece in the conversational AI agent development is context engineering.

This term, coined by Dex at HumanLayer, has gained traction recently with endorsements from Shopify CEO Tobi Lütke:
<img src="content-images/loop-is-all-you-need/tobi.png" alt="">

and even Andrej Karpathy:
<img src="content-images/loop-is-all-you-need/karpathy.png" alt="">

The same user message means completely different things depending on context. 

User: "Yes". Without context, this is meaningless. With context:
* After "Would you like to see our menu?" → User wants to browse options
* After "Is this your current address?" → User is confirming information
* After "Should I cancel your order?" → User wants to cancel

Consider the following scenario where context engineering is more than just prompt engineering:
1. Someone from the customer support team tries to call the user about the issue, but the call fails. We can log that event and add it to our customer support agent's context.
2. Then our customer support agent sees this within own context and naturally acknowledges it with proper intent: "Hey, it seems like we tried calling you earlier but couldn't reach you. Is now a better time to call?". 
3. After user confirmation, the human from the customer support team calls again and all conversation is transcribed and saved. 
4. If we pass this transcript to customer support agent's context, then the agent can say things like "As you discussed on the phone yesterday with ..."

Crafting the context like that makes the experience feel cohesive. 

## key takeaways

I'm still early in this journey. Every day brings new edge cases, new failures to recover from, new patterns to recognize. But here is my learnings so far:
1. Conversation design > technical complexity: Understanding turn-taking, cultural differences, and recovery strategies matters more than the latest framework
2. Recovery > perfection: Users forgive mistakes if you handle them gracefully. Build recovery into every interaction.
3. Context > features: A simple agent with rich context beats a complex one without it
4. Simple loops > complex frameworks: Most production agents are just while loops with good intent handling
5. Behavior drives implementation: Define specific behaviors first, then derive the technical intents from them

The future of conversational AI isn't in complex frameworks or ever-larger models. It's in understanding the fundamentals of conversation, context, and human interaction. It's in building systems that fail gracefully, adapt to their users, and remember that at the end of the day, they're having a conversation with a human who just wants to be understood.
And sometimes, that's as simple as a while loop that knows when to listen.

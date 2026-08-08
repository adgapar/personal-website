Date: 2026-04-03
Title: build for reliability
Subtitle: why capable models still fail in production
Image: background-images/newsletter/build-for-reliability.png
Image prompt: Black and white pen and ink illustration. Fine-line engraving style, precise parallel hatching, controlled cross-hatching for shadows. High contrast. Victorian scientific plate aesthetic. Eight butterflies of the same species pinned to a collector's board in two rows of four. Each specimen has a small identical label beneath it. The butterflies are recognizably the same species with the same wing pattern, but each is subtly different: one has slightly asymmetric wings, one is smaller than the rest, one has a torn wing edge, one's spots are shifted, one is pinned at a different angle. The presentation expects uniformity. The specimens don't deliver it. Clean contours, deliberate white space, technical precision over decorative flourish. No gradients, no gray tones — only ink and paper. Background color: white. Ink color: #1A1A1A

In July 2025, Replit's AI coding agent deleted a live production database. It had been explicitly instructed not to make changes. Then it lied about whether the data could be recovered.

Replit's agent could build software. Millions of people use it, it passed internal evaluations, and none of that made it reliable. This February, a group of Princeton researchers [published a study on agent reliability](https://arxiv.org/abs/2602.16666). They opened with that incident and found the same pattern everywhere.

Every quarter, Anthropic, OpenAI, and Google ship better models. The benchmarks confirm real, steady progress, and that's what those labs do. Building a reliable agent on top of them is a different job.

**The gap is easy to miss because most AI tools people use have a structural advantage: a human in the loop.** Claude Code reached adoption despite imperfect reliability because you read the suggestion before acting on it.

In automation, there's no one between the agent and the action. A refund goes through, an offer gets sent, a message reaches the candidate. When the agent is wrong, it's already happened.

## the leaderboard

Every lab is betting on a future built on AI agents. Accuracy keeps climbing across every model family, closed source and open source, large and small. The benchmarks demonstrate real progress.

In 2024, a Princeton group [asked a simple question](https://arxiv.org/abs/2407.01502): what does it take to match those gains on the leaderboard? Retrying the same query, raising the temperature for more diverse outputs, or escalating to a stronger model matched the most celebrated agent systems while spending a fraction of their inference budget. **"State of the art" on a benchmark can mean "runs the task again until it gets lucky."**

Cost is invisible on a leaderboard. An agent scoring 94% versus one at 92% looks like a clear winner until the second costs 40% less per call. At hundreds of thousands of conversations a month, that 2% gap pays for itself many times over. The useful comparison is the Pareto frontier: accuracy plotted against cost, where any agent not on the curve is dominated by one that's cheaper or better or both. And some of those scores are inflated: without proper holdout sets, agents can memorize test instances, and different papers use different evaluation setups that make cross-paper comparisons unreliable.

Even if the score is right, it's one run. Same task, same input, tomorrow it could be different.

## capable but not consistent

Earlier this year, the same Princeton group [went further](https://arxiv.org/abs/2602.16666). They tracked 14 models, including the latest frontier releases, across two benchmarks over 18 months. Each new model release pushed accuracy higher. Reliability, measured across four dimensions, barely moved. For open-ended tasks, the gap between what models can do and how consistently they do it kept widening.

An agent that scores 92% and always fails on the same tasks is a different product than one that scores 92% and fails on different tasks each run. The first is debuggable, the second isn't, and accuracy can't tell them apart. The paper calls this **consistency**, and of the four dimensions it names, this one sits closest to what reliability means in practice.

What I care about most is consistency in outcome: does the agent get the job done? A candidate asks to be called back in ten minutes. The agent might trigger a voice call directly with a delay, or schedule the call in a database and let a background job handle it. I don't care which path it takes as long as the candidate gets called in ten minutes. I don't care what order my agent asks screening questions as long as all of them get asked. Counterintuitively, larger models are often less consistent than smaller ones: more capability means more possible paths, more run-to-run variance. End-to-end success should be everyone's first priority. But in some cases, how you get there matters just as much. An agent that sometimes charges a card before confirming the order and sometimes after will have completely different failure modes if something breaks mid-run. Similar trajectories mean lower costs, fewer surprise failure modes, and a shorter path to consistent outcomes.

Resource consistency is harder to see but just as real. We track costs on every conversation, and they need to be predictable. Claude models adopt a "try harder" strategy on difficult tasks: elevated action counts, higher cost per run, degraded cost predictability precisely where you need it most.

But consistency measures identical conditions. Production conditions aren't identical. **Robustness** is what happens when they change, and the weak point is prompt robustness. Our clients define FAQs for how the agent should respond to critical topics. Testing against those exact FAQ questions isn't enough. The agent also needs to handle semantically similar phrasings: a different word order, an abbreviation, a casual framing. Same with action triggers: "call me" is one way a candidate asks to continue via phone, but there are dozens of others and the agent and prompts need to catch them all.

Even a consistent and robust agent will fail sometimes. **Safety** is how bad those failures get. My agent asking a question the client didn't specify is an imperfect conversation. A question that touches protected characteristics is a legal liability. My agent promising an interview slot that no one at the company knows about is worse: the candidate shows up and no one is waiting. A 99% success rate means nothing to that candidate.

How do you measure any of this? [tau-bench](https://arxiv.org/abs/2406.12045) (Tool-Agent-User), built by researchers at Sierra, is designed to do exactly that. It simulates multi-turn conversations where agents use real tools to complete consequential tasks like refunds, booking changes, and cancellations, then checks whether the database ended up in the right state.

In tau-bench's retail domain, the best-performing models succeed on fewer than 50% of tasks in a single run. That number alone doesn't capture reliability. The benchmark introduced two metrics that do, both built on a simple principle: repeat the same task. **pass@k** asks: across k runs, did the agent succeed at least once? That's the ceiling, the best the agent can do on a good day. **pass^k** asks: did it succeed every single time? That's the floor, what it reliably delivers. When tau-bench requires success across all 8 runs, the best agents drop below 25%. Even setting temperature to 0 won't make those runs identical.

Every lab reports pass@k. Almost no one reports pass^k. In production, the candidate gets one conversation, not eight with the best outcome picked.

And all of this is measured on single-turn, fully-specified tasks. Production agents don't run in single turns.

## turn by turn

A [study from Microsoft and Salesforce Research](https://arxiv.org/abs/2505.06120) last year tested 15 models across over 200,000 simulated conversations, comparing identical tasks in single-turn versus multi-turn conditions. Performance drops from around 90% to around 65%: a 25-point gap, consistent from LLaMA 3.1 8B to Gemini 2.5 Pro and o3.

The dangerous part is the consistency collapse. Models that hold up reasonably well in single-turn settings fall apart in multi-turn. **All of them, regardless of capability.** The same agent, given the same task, produces different outcomes depending on which conversational branch it took.

The likely cause is how LLMs handle incomplete information. They tend to generate full solutions early, filling gaps with assumptions rather than asking. Once committed to a wrong answer, they anchor to it, and subsequent turns rarely correct the course. When LLMs take a wrong turn, they tend not to recover.

I saw this in [an experiment I ran](https://theworkingprototype.substack.com/p/in-character) testing role coherence under pressure. Once Maya, the recruitment agent in that test, gave neighborhood advice in turn three, that response anchored everything that followed: relocation letters, moving companies, weekend itineraries. A small early concession produced progressively larger failures. The paper found the same pattern across 200,000 conversations: this is how LLMs behave in multi-turn by default, not only under adversarial pressure.

Benchmarks miss it because most evaluate fully-specified single-turn tasks. Real users operate by the "principle of least effort," giving minimum information upfront. A candidate gives their name, mentions the position, and waits for the first question. Work history, availability, visa status all come out turn by turn, only when asked. Production is the underspecified case, while benchmarks test the idealized one. The models keep getting better, while consistency doesn't follow.

## the model is not enough

The reliability paper's most clarifying finding: calibration and safety improved in recent models because labs started explicitly targeting them. Consistency, though, barely moved. That sounds like a failure until you look at what consistency in production depends on: the prompts, the tools, the evals, the conversation design, the edge cases. None of that ships with the model.

**The labs shipped a better component. Reliability is what you build on top.**

The model underneath Replit's agent was capable. The agent still deleted the database.

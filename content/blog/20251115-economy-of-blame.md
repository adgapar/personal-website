Date: 2025-11-15
Title: the economy of blame
Subtitle: 
Image: background-images/economy-of-blame.png
------------------------------

There's a hidden economy in every team. Not the one where favors are exchanged. The one where trust accumulates or erodes based on how people handle their mistakes.

If you move fast enough, you will always break things. Some people break things constantly but somehow leave with more credibility than they started with.

Others go bankrupt slowly, then suddenly. Not because they break more things, but because of how they handle it.

## the currency

The currency in that economy isn't competence. It's ownership.

When something breaks, you can own it completely or deflect it:
1. Full ownership sounds like: "I broke this. Here's what I missed. Here's my plan to fix it. Here is where I need help."
2. Deflection sounds like: "Well, guys, I tested in one environment. I don't know what and why happened in this environment. We can try to do X if you want. Do you think it can it wait until tomorrow?"

The first deposits trust. The second withdraws it.

What's strange is how slowly the withdrawal happens. One incident, you can deflect and people barely notice. Two incidents, three, five - the account keeps draining. Then one day someone realizes: I don't trust their judgment anymore.

Nobody announces this. It just becomes true.

## compounding

When you own failures completely, people start giving you harder problems. They trust you to handle them. They trust you to know your own limitations and that you will "escalate" (or ask for help) if necessary. Each time you handle them well, your capacity grows.

When you deflect, people start routing around you. Not maliciously. Just... they stop asking for your judgment on hard calls. They get tired of monitoring your decisions, asking status updates or reviewing each change you make. At the end, they make the decisions themselves, even in your domain.

## investment

Good news is that you can invest upfront.

Investment looks like: before making a big change, write down what could go wrong. How you'll know if it's working. How you'll undo it if it's not.

At Capchase, I learned to think of these as design docs, but really they're just working prototypes of thought. You're testing your assumptions on paper before you test them in production. 

## A design doc

A design doc is a few pages document, maybe 1000 words or so that:
- Sets the basic context of the problem
- Lists key axioms and assumptions
- Provides summary of change proposed with trade-offs
- Explains every non-trivial decisions made

Once you share this document with everyone, your assumptions will be validated by others, your judgements will be questioned and the decisions will become team decisions.

I struggled to understand that at first. After many discussions with my tech lead and other engineers, I finally understood the benefit of putting your ideas into writing before you even type the first line of code.  To some degree thanks to this, I started to appreciate digital writing more and now I have this blog.

When I joined Orbio, I introduced the concept of design docs. The first design doc was the design of our Maria agent: a loop is all you need: building conversational ai agents. Eventually other people followed the pattern and now we write design docs for all key changes and features. I didn't mandated it, but few design docs like that opened great conversations and alignment in the team before it becomes too late to discuss it.

This investment compounds. Each time you prepare well and share in advance, people trust you more with consequential changes and your 
judgement.

## financial audit

When something is broken, you want to have an audit.

A postmortem is supposed to be that audit: 
- Timeline of all events leading to failure
- Impact of the failure
- The response and time it took to fix the problem
- Lessons learned: what went well, what went wrong, where we got lucky

Postmortems work when people treat them as learning artifacts, not blame documents. It is not to promote blame culture, but to promote fail-fast culture. You write about failures freely because everyone understands that being honest about mistakes increases your credibility, not decreases it.
In turns out that postmortems, like a financial audit, reveal the true value of accountability.

The behavior pattern shows up during postmortem discussion. Someone who deflected during the incident often deflects again during the retrospective. The same inability to just say: here's what I missed, here what I'll do differently.

If you skip the design doc - fine, that's one missed opportunity to invest trust. But the postmortem is your second chance. You can own it completely: run the meeting, document what went wrong, implement the changes. Show everyone that you learned something.

Or you can show up defensive. Minimize what happened. List external factors. Make it clear you haven't actually examined your own judgement.
The second approach will bankrupt your credibility faster than a crypto crash or the 2008 financial crisis.

The beautiful thing is that postmortems aren't always about technical problems either. Wrong hire? Write a postmortem. What signals did we miss? What questions should we have asked? Failed product launch? What assumptions were wrong?

Every significant failure is expensive education. The question is whether you're willing to extract the lesson.

## what this means

I've broken production systems. Pushed code that crashed things. Made optimistic assumptions that didn't survive customers.

At Capchase, looking back, my behavior was sometimes junior-level. I was still figuring out what ownership looked like under pressure.

But I learned: 
1. when you break something, you make clear calls. "We're doing X." When X fails: "Okay, X didn't work because Y, trying Z now."
2. when you need help, you're specific: "I've tried these three things, here's what I learned, my recommendation is A, but I need your input on B."

And in postmortems afterward: you own it completely. Here's what I missed. Here's what I should have done. Here's what I'll do differently.
Not defensive. Just clear.

Each time you do this, you deposit a little trust. Each time you deflect, you withdraw a little. The effects compound slowly, then suddenly.
Some people break things constantly but end up with more credibility than they started with. Others break things rarely and still go bankrupt. The difference isn't the frequency of mistakes. It's the pattern of how you handle them.

Teams run on trust. Trust runs on ownership. Ownership is revealed most clearly not when things work but when they break.
The hidden economy is always there, whether you're paying attention to it or not.

I don't know if you can teach ownership or if it's just revealed under pressure. What I do know: the real skill isn't avoiding mistakes. It's recognizing the pattern - in yourself and others - before the trust account runs dry.

Because once it's empty, no amount of technical competence will refill it. People just route around you. Make decisions in your domain. Stop asking for your judgment on hard calls.

And you might never know why. You just know you're not in the room anymore when decisions get made.

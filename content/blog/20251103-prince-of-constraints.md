Date: 2025-11-03
Title: prince of constraints
Subtitle: 
Image: background-images/prince-of-constraints.png
--------------------------------------

I picked up Jordan Mechner's journals on making Prince of Persia (later PoP) expecting game development nostalgia. I played PoP as a kid and wanted to read how it was made.

What I got instead was some of the clearest articulations of building principles I've read. Project management. User motivation. Learning strategy. Location decisions. The same questions I've been writing about lately.

I'm 32 now. Jordan was at least 7 years younger when he wrote most of these entries. At this age I was far from building something that defined a genre and frankly had a lot of "what am I doing with my life" thoughts while reading it. But these journals aren't victory laps. They're filled with doubt:
1. Is the games industry dying?
2. Should I quit game development for screenwriting? 
3. Will I make it in New York? 

Jordan was figuring it out same as anyone else.

He never took formal courses on game design or project management. He had a psychology degree from Yale and was coding Prince of Persia in his parents' basement, learning by doing. In 2010, on the game's 30th anniversary, others got access to his raw notes annotated with 20 years of hindsight in the book "The Making of Prince of Persia: Journals 1985-1993", published by Stripe Press (Ideas for Progress).

Here's what I extracted from the book that would be useful for anyone building anything.

## fixed time, variable scope

**June 30, 1989**. 

Jordan and his father are working on music for Prince of Persia. They're struggling with memory constraints, time pressure, the technical limitations. His father asks: _"What if we can't get it all done in three days?"_

Jordan's answer: _"Then we have to scale it down to a size that we can do in three days."_

No debate about estimates. No discussion of trade-offs. Just: fit the scope to the timeline, not the other way around.

Basecamp built project management framework Shape Up around this principle. The framework doesn't work for me, but this rule does: you can't ship if you're constantly expanding scope. You ship by shrinking ambitions to match capacity. As I wrote in "local maxima": _"shipping is the only optimization that matters."_

## creative work needs space

**July 10, 1989.**

Jordan is designing levels:

> "Level design is a creative process, like screenwriting: you can't just sit down and put in ten hours at a stretch, you need time in between to let your ideas work themselves out."

He understood something that still trips up builders: creative work and implementation work have different rhythms. You can't force insight on a schedule. But you also can't wait for perfect clarity.


Builders need focus time and must live on a different schedule. But it's more than that—even within deep work sessions, creative work needs space between efforts.

The pattern: work → space → work → space.
Not: work → work → work → burnout.

## primer on gamification

**November 12, 1988.**

Jordan is thinking about what makes games engaging. 

His notes:

> "What's the point of running, running to get to the exit, if all it gets you is more of the same? **Rewards** in the story is not enough, rewards must be in the game. What makes a game fun? Tension/release, tension/release."
 
> "There need to be **sub-goals**. Places where you can say: 'Whew, I did it! That was tough one!... what's next?'"
 
> "You should be able to tell at any moment, by glancing at the screen, how close you are to finishing, how much is left. There are setbacks and successes on the road to ultimate success. If the subgoal is 'solving the level' you need **consistent visual indicator** of how close you are."
 
> "A game doesn't move forward until the player wants something: five seconds after you press start, you'd better know the answer to the question 'what do I want to happen?'"
 
> "There always has to be a **range of possible outcomes**, some better than others, so you're constantly thinking: 'Good..., Bad..., Terrible.' Every event has to move you closer or further away from your **goal**, or it is not an event, it's just window dressing."

Strip away the gaming context and this applies to any product:
* Five seconds in, does the user know what they want to happen?
* Can they see their progress at a glance?
* Do events meaningfully move them toward or away from their goal?
* Is there tension and release, not just endless sameness?

I think about this now when I am building for Orbio AI. When recruiters see our app, do they immediately know what they want? Can candidates see where they are in the process?

## learning by doing

**November 13, 1988.**

Jordan reflects on a 3-day screenwriting workshop:
> "I took his 3-day course and thought it was terrific. In reality, workshops (and how-to books) mostly give you a boost of inspirational energy and the illusion that you've learned something. The only way to really learn is by writing."

This one hit close. I see my alma mater (IE University) advertising 3-day courses for €4000. I sometimes get FOMO looking at bootcamp ads and certificate programs. Jordan's right: they give you energy and frameworks. But they don't give you skill.

Skill comes from doing the work. From encountering real problems. From solving them badly, then better.

Jordan applied to NYU Film Academy in 1990 and didn't get in. Decided to move to New York anyway and get his film education by doing: working for free, interning on productions, making his own films. Not by spending $100k on tuition.

The education he got - the network, the serendipity, the practical skills - came from being there and doing it. Not from sitting in a classroom.
I wrote about this exact principle in my take on education and learning:  practice > consumption. Jordan lived it three decades earlier, before we had online courses selling us shortcuts.

## location and serendipity

**May 7, 1991.**

Jordan reflects on his New York move:
>"I so definitely did the right thing by coming to New York. I've only been here seven months, and already I feel like I'm part of a network of people that keep meeting and crossing and cropping up in different combinations. That I run into someone I know almost every time I step outside—these things fill me with a deep and primitive satisfaction. In San Francisco I felt like I was in danger of falling off the edge of the world. Here I feel like I'm part of something that's strong enough to hold me in place."

He found a place that created serendipity through density. Each connection strengthened his network. As the net grew, possibilities multiplied.

His take on other cities he visited (May 1991) and I agree about Paris:

>"Rome is a great city; Berlin is an exciting place these days; even Vienna is jumping since the Wall fell. Paris is... Paris. There are good reasons to live almost anywhere. To live in Paris you don't need one." 

The location question - where to be for your craft - remains. I wrote about this in local maxima: weighing Madrid vs Elche, Spain vs Bay Area, stability vs serendipity. Jordan who for some time lived in Spain and France exploring Europe and learning languages faced it too: San Francisco vs New York vs Paris vs Madrid.

Different answers for different people. But the pattern holds: location shapes opportunity. Density creates collisions. Some cities give you energy just by being there. 

But you still need to show up, be present, notice who's around and let connections form. 

**July 26, 1989.**

>"I'll leave the notebook home. Instead, I'll just pay attention."

## constraints drive creativity

**March 7, 1990.**

Jordan and his friend Roland install an extra 1MB of RAM in Jordan's Mac. To test it, Roland creates an 8,000-page document in MS Word.

An "extra" 1MB was celebration-worthy.

Prince of Persia ran on an Apple II. The entire game had to fit in impossibly small memory. Every animation frame mattered. Every line of code counted. Jordan spent months figuring out how to make rotoscoped movement work within those limits. The constraint forced the creativity.

Now we have Claude with 200K context windows. Infinite cloud storage. Models that can process entire codebases. And somehow, we still ship less than Jordan did with 1MB.

The constraint isn't hardware anymore - it's attention. What's essential? What moves the user toward their goal? What's just window dressing?
The question remains the same. We just have to enforce our own constraints instead of having hardware enforce them for us. Jordan had the floppy disk telling him "no more." We have to tell ourselves.

## refusing to specialize

**July 5, 1985.**

Fresh out of Yale, Jordan is already questioning his path:

_(Reading this in 2025 - when gaming is an Olympic sport and the industry is booming - makes his doubt even more striking.)_

>"In the time it'll take me to do a new game, I could write three screenplays. And... the games business is drying up. There's no guarantee the new game will be as successful. Or that there will even be a computer games market a couple of years from now."

He was wrong about the games market dying. But the anxiety was real. Game designer or screenwriter? Which bet to make?

Jordan graduated Yale in 1985 with a psychology degree. He was simultaneously a game designer who could code, design, and animate entire games and an aspiring screenwriter making films on the side.

Everyone told him to pick one. Game designer or screenwriter. Pick a lane, get good, build a career.

He never did. Prince of Persia kept growing while he pursued screenwriting. Opportunities appeared in both. He didn't abandon either craft, he just kept both alive.

I wrote about polyworking: why one job isn't enough anymore in September. Reading Jordan's journals, I realize he lived this in the 1980s before we had the term. The pressure to specialize was the same. The advice to "pick one" was the same.

His path proved you don't have to. Prince of Persia eventually became a successful Disney movie, where he participated as a screenwriter.

## timeline pressure

**January 29, 1987**. Jordan is 23:
>"Watching him (Roland) do what he did for me today, I felt a little of the old joy come flooding back. I'd almost forgotten the most basic thing: programming is fun. I've grown middle-aged these past couple of years. Roland is 23 but he's still young at heart."

He called himself "middle-aged" at 23. Reading this at 32, I laughed. Then felt it.

**September 5, 1989**. Someone tells 25-year-old Jordan:
>"The most important thing is that you have good time. You are only young once! In 5 years you'll be 30. That's the time of life when you stop asking a lot of questions and start to accept certain things and not try to change them."

The definitions shifted. We now say 30 is still young. You can still explore. Still switch careers. Still ask questions and not accept things.

But the underlying anxiety - the pressure to have figured it out by some arbitrary age - that hasn't changed. Jordan felt it at 23. I feel it at 32. The number moves but the feeling stays.

What actually matters: Are you building? Are you learning? Are you asking questions? The rest is just numbers, everyone is on their own timeline.

## journaling

This isn't a cleaned-up retrospective. Jordan published his actual daily notes from 1985-1993—thinking captured while it was happening, not stories polished after they worked out.

I picked this up expecting game development stories. Got that, plus a lot more about building anything under constraints. It's honest, it's specific, and it's surprisingly fun to read.

In an interview years later, someone asked Jordan for advice. One thing he said: **keep a journal**. The most important things often don't advertise themselves - you only notice them if you're quiet and paying attention.

Reading these journals, that's exactly what you get. Thirty years of someone paying attention and writing it down. The doubt, the daily grind, the small observations that eventually mattered.

If you're building something, anything, give it a shot.

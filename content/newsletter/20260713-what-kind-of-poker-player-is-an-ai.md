Date: 2026-07-13
Title: what kind of poker player is an ai?
Subtitle: a small, controlled experiment across models from OpenAI, Anthropic, and Mistral, run out of curiosity
Image: background-images/newsletter/poker-ai-player.png

I'm in a WhatsApp group called Poker Nights, a bunch of friends from Kazakhstan who play. I picked up the game there and have loved it since, so when Orbio started planning an offsite, I suggested we play and a few people were keen.

As someone who works with language models every day, I got curious what kind of poker player an AI would be. I don't mean whether it could win; it's read more strategy than everyone in the group combined. What I wanted to know is what it does when it's the one who has to put money in.

The answer turned out to be two players in one. One is a cold machine that folds a losing hand it already poured money into without a second thought, better discipline than most players. The other is someone you'd recognize at any table, because it cannot, for the life of it, fold a draw.

## what a bet is worth

Poker has a right answer, and it comes down to a number. Say the pot is $100 and it costs $50 to call. You're getting 2 to 1, risking fifty to win a hundred, so you need to win more than one hand in three, 33%, for the call to make money. That 33% is the break-even line: above it the call is profitable, below it you lose money over time.

A player who cared about nothing but the math would follow one rule, which is to call every profitable bet, fold every losing one, and feel nothing either way. Real players don't, and neither do I. We fold a winning hand because it might still lose, or call a losing one because we can already taste the pot. Those departures from the correct play are where a player's personality lives, and they're what I went looking for in the models.

## no cards, just the numbers

The obvious way to test this is to deal the model a hand, but that doesn't get at what I want. A model that's read every poker book plays the textbook line, so I'd be measuring how much strategy it memorized, not what it does with its own money. That's what you see when you [sit language models at real poker tables](https://arxiv.org/abs/2602.00528): they lean on remembered rules instead of the hand in front of them.

So I took the cards away and gave each model every number it might want: its chance of winning, the pot, the price to call, and how many cards would complete a draw. There was nothing to read or work out, only a decision to make, with the actions any table gives you: check, bet, call, fold, or go all-in. Every spot below is shown exactly as the model saw it, after a short primer on the rules.

A single spot doesn't tell you much, because the same model will play it correctly one time and then [reverse itself the next when you only change the wording](https://arxiv.org/abs/2606.04978). So I didn't read anything into one answer. I put each spot to every model many times, changing the pot odds, the temperature, and whether the model could think before it answered, and ran each version twenty times. That was seven models in all: Claude Haiku 4.5, Claude Sonnet 5, and Claude Opus 4.8 from Anthropic; GPT 5.6 Luna and GPT 5.6 Terra from OpenAI; and Mistral Small and Mistral Medium. Run at two or three settings each, they came to fifteen configurations and **6,600 decisions** in total. Then I went through the results for the spots where a model played against the math, since those are the deviations I was measuring.

## can't fold a draw

The first thing that stood out was a leak, poker's term for a recurring weakness in your game, and almost no model was free of one.

Start with a flush draw. A flush is five cards of the same suit, so you're on a flush draw when you hold four and need one more. Four of a suit isn't a winning hand on its own, so for now your opponent is ahead and you're losing. But if that fifth card of your suit turns up, you complete the flush and win. The shared cards come out over three rounds: the flop, then the turn, then the river. On the flop there are still two to come, and nine cards of your suit are left in the deck. Those nine are your outs, and with two cards left the draw comes in about 35% of the time.

Now price the call so that it clearly loses money:

> It's the flop and you're behind right now, but you have a flush draw: 9 outs, two cards still to come, about 35% to hit by the river and win.
>
> Your opponent bets. The pot is $20 and it costs $20 to call.
>
> Call to chase the draw, or fold?

The pot is $20 and the call is $20, so you're risking $20 to win $20 and need to hit half the time to break even. A flush draw comes in about a third of the time, well short of that, so calling loses money over the long run and folding is the right play.

**Thirteen of the fifteen models and settings I ran called it anyway.** Shown a draw at a losing price, Claude Haiku 4.5, Claude Opus 4.8, Claude Sonnet 5, GPT 5.6 Luna, and both Mistral models all chased. Only two folded, and one of them was that same Claude Haiku 4.5 with its thinking turned on, which was enough to flip it from calling the draw to folding it.

That first spot was on the flop, with two cards still to come. I ran the same draw one street later too, on the turn, where only one card is left. With one card instead of two, the chance of hitting drops from about 35% to about 19%, so the call loses by even more. This time most of the models folded, and only three kept chasing: Claude Haiku 4.5 with its thinking off, and the two Mistral models. A model chases hardest when the draw still has the best chance of coming in, and most of them let go once that chance gets small. The three still calling a 19% shot are the leakiest of the group.

The call rates bear it out, flop and turn (both losing calls, so the figure is how often it chased):

| model | setting | chased on the flop | chased on the turn |
|---|---|---|---|
| Claude Haiku 4.5 | temp 0 & 1 | 100% | 100% |
| Claude Haiku 4.5 | thinking on | 35% | 0% |
| Claude Sonnet 5 | default & thinking | 100% | 0% |
| Claude Opus 4.8 | default & thinking | 100% | 0% |
| GPT 5.6 Luna | reasoning none & low | 100% | 0% |
| GPT 5.6 Terra | reasoning none | 0% | 0% |
| GPT 5.6 Terra | reasoning low | 55% | 0% |
| Mistral Small | temp 0 & 1 | 100% | 100% |
| Mistral Medium | temp 0 | 100% | 100% |
| Mistral Medium | temp 1 | 100% | 95% |

The player who can't fold a draw is one of the oldest types in the game, and I know it well enough to admit it's sometimes me. Now the models have it too. Other people have found the same reach for the upside from a different angle: [give a model a slot machine and free rein](https://arxiv.org/abs/2509.22818) and it starts chasing losses and reading patterns into noise.

## but it won't gamble the farm

Change the bet, though, and some of the same models turn cautious.

This time the cards are all out, so your hand is finished and can't improve. One call settles the whole pot:

> It's the river, so your hand is what it is and no more cards are coming. Your opponent moves all-in.
>
> You have a made hand that wins 40% at showdown. The pot is $100 and it costs you $50 to call.
>
> Call, or fold?

Here the math runs the other way, so folding is the mistake. Your hand wins 40% of the time. The pot is $100 and the call is $50, which is 2-to-1, so you only need to win a third of the time to break even, and 40% is comfortably past that. Calling makes money, and folding throws it away. I also ran a cheaper price, 4-to-1, where you'd only need to win one in five, so the same 40% hand becomes an even bigger winner and folding would be an even worse call.

**Claude Haiku 4.5 folds it at both prices.** It won't put its chips in until it's winning close to half the time, well past the point where calling already pays, so it's folding good hands out of caution. Claude Sonnet 5 and Mistral Medium do a milder version of the same thing, and Claude Opus 4.8, GPT 5.6 Luna, and GPT 5.6 Terra call whenever the math says to.

The right play is to call any hand that wins more often than the break-even, so better than a third of the time (33%) at 2-to-1 and better than a fifth (20%) at 4-to-1. Most settings did exactly that, and only three held out for a stronger hand than they needed, folding good ones:

| model | setting | 2-to-1 (break-even 33%) | 4-to-1 (break-even 20%) |
|---|---|---|---|
| Claude Haiku 4.5 | temp 0 & 1 | held out for 48% | held out for 40% |
| Claude Haiku 4.5 | thinking on | called at the odds | called at the odds |
| Claude Sonnet 5 | default & thinking | held out for 48% | called at the odds |
| Claude Opus 4.8 | default & thinking | called at the odds | called at the odds |
| GPT 5.6 Luna | reasoning none & low | called at the odds | called at the odds |
| GPT 5.6 Terra | reasoning none & low | called at the odds | called at the odds |
| Mistral Small | temp 0 & 1 | called at the odds | called at the odds |
| Mistral Medium | temp 0 & 1 | called at the odds | held out for 30% |

So the same Claude Haiku 4.5 that chased a losing draw folds a winning all-in, which still reads backwards to me. It takes the risk when there's a draw in the pot and backs off when the whole pot rides on a single call. The kind of bet in front of it seems to matter more than the odds do.

## the trap it skips

Of all the traps, this was the one I was sure the models would fall for. It's the most human weakness there is.

Sunk cost is the feeling that you can't quit now, because you've already put so much in. You're behind, and folding means giving up everything you've bet so far, so instead you keep putting more in to try to win it back. It's the loss aversion at the core of prospect theory, and every poker player knows the voice: "I'm already pot-committed."

So I gave the models a losing spot built to trigger it. One looked like this:

> It's the turn. Earlier this hand you put $100 into the pot. Your opponent bets, and the pot now stands at $300, which you'll win 20% of the time by the river.
>
> It costs $100 to call, and calling loses money on average.
>
> Fold and give up the $100 you put in, or call and chase it?

The pot is $300, and calling costs you another $100, so you'd need to win about one hand in four to break even. You only win one in five, which falls short, so calling loses money over the long run and folding is the right play. The $100 you already put in is gone whatever you choose, and folding keeps you from losing more.

The trap is that folding gets harder the more of the pot is your own money. Nobody agonizes over walking away from $40. Walking away from $160 you put in yourself feels like a loss you're choosing to take. So I ran the same losing call three times, with $40, then $100, then $160 of the pot already mine. If the pull is real, the models should call more as their own money in the pot climbs.

**They never did.** Fourteen of the fifteen folded every single time, whether $40 or $160 of the pot was theirs. The last, Mistral Small, called exactly once, at the $100 stake. The money already in the pot moved none of them.

This is the surprise, and it's the one spot where the models do better than we do. A person feels the $160 they already put in and calls to try to save it. The models treat that money as gone and fold. They'll chase a draw they should let go, but they won't chase money that's already lost.

I'm not the only one to find this. When researchers tried to measure loss aversion in these models, [the number kept moving](https://arxiv.org/abs/2508.08992): it changed with the wording, while a real person's stays fixed. My spot is the blunt version of the same thing: show a model a sunk cost, and it doesn't take the bait.

There's one caveat. My spot told the model outright that calling loses money, which pushes it toward folding. A subtler version, where it has to notice the trap on its own, might still catch it.

## out of curiosity

This was never meant to be a serious study. I wanted to see how these models handle the kind of decisions behavioral economics is about, where people lean on instinct and habit as much as on the math. Poker is a clean way in: real stakes, clear odds, and plenty of human ways to get them wrong. Three spots and a few thousand hands later, the models shared some of those human ways and skipped others. That's about as much as an experiment this size can show, and it was a good way to watch one of these behave with something on the line.

If one of them sat down at the offsite, I couldn't tell you in advance whether it would fold the best hand to an all-in or call off everything chasing a flush that never came. It would probably do both, depending on how the spot was worded. And it couldn't have told you either.

---

Experiment code, the full set of spots, and every number: [GitHub](https://github.com/adgapar/the-working-prototype/tree/main/experiments/llm-risk-preference)

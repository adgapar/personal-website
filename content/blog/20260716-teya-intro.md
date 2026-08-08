Date: 2026-07-16
Title: how and why i built a home ai assistant
Subtitle: the AI was the easy part.
Image prompt: Minimalist pixel art, 16:9, clean geometric composition. A single ordinary phone mounted flat and low on a warm kitchen wall at the low gold hour, its small round screen-face glowing awake and attentive, two soft dots and a curve, humble and unremarkable, while the shadow it throws up the wall beside it refuses to match: not the neat rectangle a phone should cast but a tall, elaborate machine, a mast of sensors, a jointed arm, a ringed head, the whole apparatus the builder once drew and never had to make, thrown cold and blue by the same warm light. At a glance it is simply a big shape beside a small object; only on close looking does the shadow betray itself, holding interior detail no shadow could ever hold: fine hinges, little dials, a lattice of mic-grilles threading through the dark like a folded blueprint fallen across the wall, intricate exactly where the plain phone is bare. The wide warm wall stretches quiet and empty around the two of them, the phone small and near, the imagined machine looming faint above. Background a solid lived-in terracotta-ochre, the color of a kitchen when the day's light goes gold. Palette warm but wry: terracotta-ochre wall, a single amber-gold spilling from the phone's little face as the only human warmth, the shadow rendered in cold steel-blue and slate, a thin seam of dusk-violet where the gold light meets the cold shape. Mood reassuring and quietly amused at once, warm and a little humbled, the ease of something simple sitting beside the cold complication it might have been. Influence: René Magritte's paradox of the object and its impossible shadow, flat, deadpan, and dreamlike, the shadow carrying detail the thing that casts it plainly does not. High-quality pixel art with clean edges, professional dithering where needed.
Image: background-images/teya-intro.png
---------------------------------------

We've had an Alexa at home for years, wired into our Sonos speakers, so in the kitchen it plays music and sets timers. That is the whole of what it does. I work with AI models every day, and it was obvious the assistant on our counter could be far more than that.

Every one of these works the same way. You set one up, whether it's Alexa or Google or Yandex's Alisa, and from then on your conversations go to a company that makes its money on ads and sales. You can't add anything to it yourself: you wait for big tech to ship a skill, or you buy the next box. Siri barely manages the basics. Meanwhile the model behind ChatGPT and Claude is smart and stuck behind a chat window.

**I wanted that intelligence running in my own house, doing the things that help a family**: a shared calendar both parents can see, reminders that go off on time, a shopping list you add to out loud, and a way for my kids to call me before they're old enough to dial a phone.

More than any single feature, it had to feel less like a command box and more like someone in the family: it should know who's talking, remember what matters about each of us, and let you cut in when it's wrong. What it learns stays ours, on the device, not on a company's servers.

I named it Teya.

## a spare phone is the whole machine

I studied robotics and mechatronics, so I imagined building my own from scratch, rather than tampering with the box already in the kitchen: sensors, a board, a microphone array, a 3D-printed enclosure. 

Then I realized that any cheap Android phone already has all those components. It has a screen, a microphone and a speaker, 4G, GPS, a calendar, a clock, and a dialer, and it can reach an AI model over the network. Hardware is the slow, expensive part of any robotics project, and here it's already solved, cheaply, by an ordinary phone. Few years ago I bought Samsung A34 as a backup device and barely used it.

There's no server behind Teya, no hub, no account to create. The reasoning runs in the cloud through one provider, and everything else runs on the phone. The whole design assumes no one would be willing to go through complex setup: it relies on the phone's own hardware and adds no VoIP or extra services. The only thing you enter is one API key.

## why it had to be a native app

The obvious question, once you decide it's going to be a phone app, is which kind. I asked it out loud on the first day: an Android app built with Kotlin, Flutter, or React Native? The usual reason to reach for Flutter or React Native is that you write one codebase and ship it to both the App Store and the Play Store. Teya never goes near either store. It's sideloaded onto one dedicated phone, so that advantage doesn't apply here at all.

What it needs instead is to reach deep into the phone: place a real cellular call, write to the calendar, run an always-on service that survives on a wall for weeks, hold the microphone open, run small machine-learning models on-device, and later float itself back on top of other apps. That is exactly the kind of always-on, system-level access the cross-platform frameworks fight you on and iOS locks down. **So I built it in native Kotlin.**

I'd never built an Android app, and it showed. Early on I had to stop and ask what a Gradle sync even was. [Riding the wave](https://adiletgaparov.substack.com/p/riding-the-wave) onto a platform I'd never used, I had Claude Code and Android Studio's Gemini explain what I didn't understand and do the work I couldn't. The phone I develop against is deliberately empty: a fresh SIM, no personal contacts, every permission pre-granted. It isn't anyone's daily phone. It's an appliance that happens to be a phone, which is also why there's nothing personal on it to steal.

## one provider

The one thing that has to happen off the phone is the thinking, and I wanted a single company doing all of it. Teya needs three things from the cloud: a model to reason and decide, speech-to-text to hear you, and text-to-speech to answer. Getting all three from one provider means one account and one key to enter, nothing more.

I picked Mistral. Part of it is that they're European, and I wanted to support AI built here. **Most of it is cost: a home assistant runs conversations all day, so the price per turn has to be low, and theirs is.** One key covers the reasoning, on Mistral Small, and since they released Voxtral, the same key does speech-to-text and text-to-speech. It understands the languages we speak at home. OpenAI and Google's Gemini can both do the same, but OpenAI costs more across that many conversations, and Gemini would route the family through Google, which is what I started this to avoid. Anthropic has no voice models at all.

I could have picked the best tool for each job instead: a dedicated transcription service like Deepgram, a dedicated voice like ElevenLabs or Cartesia, an open model I'd run myself. Each one is another account, another key, another thing to keep working, which is the opposite of a device nobody sets up. I might add one later for a specific piece, but not for the first version.

Mistral also does OCR, so later I could forward Teya an email or a photo of a school letter and have her read it and act on it, with no extra service to set up.

## teaching it to do things

An assistant that only talks is a chatbot with a speaker. What matters is the model deciding to do something and the phone carrying it out. It listens, sends the words to Mistral, and when the model asks for a tool, the phone runs it against one of Android's own capabilities and hands the result back, so the model can say what happened. Every tool maps to one thing the phone can already do, and the model picks from a fixed set. Eighteen of them today:

- **Calls** — `place_call`
- **Timers and alarms** — `set_timer` / `cancel_timer`, `set_alarm` / `cancel_alarm`
- **Calendar** — `add_event` / `cancel_event`, `get_events`
- **Shopping list** — `add_to_shopping_list` / `remove_from_shopping_list`, `read_shopping_list`, `clear_shopping_list`
- **Expenses** — `log_expense` / `delete_expense`, `query_expenses`
- **Memory** — `remember` / `forget`, `search_memory`

There's no `get_time`: the current time and last location ride in the model's context every turn, so it never spends a call to ask.

Building these over voice changed how I made them. **Anything the model can create, it has to be able to undo, and the two ship in the same change**, which is why almost every line above pairs an `add` or a `set` with a `cancel` or a `remove`. Transcription across a room is wrong often enough that the model fires the wrong tool call regularly, so there has to be a way back from every action. When the calendar could add events but not cancel them, asking it to remove one got a confident yes and a similar event quietly re-added later; with no way to undo, the model covers for itself.

I keep the model out of real calculation, too. It turns "ten minutes" into six hundred seconds for a timer, and pulls the amount and category out of "twelve euros for fruit" to log it. But when someone asks how much the family spent this month, the total is worked out in code and the model reads it back, because a model this small and fast would fumble a column of numbers on its own.

## waking it up

Because it lives on a wall and not in your hand, the first problem is getting its attention across a room. I started with a pre-trained "hey jarvis" model, a small TFLite one that runs on the phone itself. It wasn't working well at any distance: it only fired when I had my mouth almost on the phone, which is a strange thing to ask of a home assistant you're meant to call out to from the kitchen.

So I trained my own. I recorded myself saying "hey teya" a handful of times, deliberately walking around the room so it would learn to hear me near and far, and fed those into a trainer on my Mac ([microWakeWord](https://github.com/kahrendt/microWakeWord), through a [build for Apple Silicon](https://github.com/TaterTotterson/microWakeWord-Trainer-AppleSilicon)) alongside tens of thousands of synthetic examples. **It heard me across the room, and I dropped the pre-trained one.**

## interrupting her

Letting you interrupt Teya mid-sentence, called barge-in, was the hardest engineering in the whole project. It started as a scene at home: Teya had misheard my son Alen's name and was cheerfully telling him about Ireland, and Alen asked why she talks so much. That moment set two requirements: I had to be able to cut her off, and she had to assume she might have misheard.

Interrupting her is harder than it looks. To cut her off mid-sentence, the phone has to keep listening while she's speaking, which means it hears her own voice coming out of its own speaker and has to erase that before it can tell whether you're talking. That's echo cancellation, and it's a deep problem. I did the "correct" thing first: I compiled in Google's own echo canceller, the one running inside billions of devices. On synthetic test tones it removed about 72 decibels of echo. On the actual phone it removed almost none. I even had the agent take apart the shipped code of two voice frameworks I trust, LiveKit and Pipecat, to copy how they do it, and found the same problem in both: their approach needs a server behind the phone, and a home appliance with no server can't have one.

What finally worked was much dumber. A web browser cancels echo for video calls, locally, on the same phones. So I hid an invisible one-pixel browser window inside the app and let it clean the microphone for me. On the exact phone where Google's canceller had done nothing, the browser removed 36 to 41 decibels across repeated runs. **The browser beat Google's own canceller on the only phone that mattered.** The first clean interrupt landed that same evening, and I deleted the native module I'd spent days on.

Knowing when you've started and stopped talking, turn detection, is a smaller version of the same problem. The standard fix is voice activity detection (VAD), a small ML model, and I knew that going in, but it meant one more model on a phone already running the wake word, so I tried to avoid it. The cheaper options failed fast: a loudness threshold fired on any sound, because loud isn't the same as speech, and streaming the audio to a remote transcriber never returned a word. So I added the model after all, [Silero VAD](https://github.com/snakers4/silero-vad), on-device and tuned so a cough or a clatter doesn't count as your turn.

That handles you cutting in. The phone also has to tell you when it's your turn. The screen shows what it's doing, a face that shifts between idle, listening, thinking, and speaking, but it lives on a wall where no one is always looking, so it says the same thing in sound. That signal has to fire every time, so it can't come from the model: it's a plain chime, played the instant it starts listening. It used to speak a "Yes?" instead, but the word had to finish before the microphone opened, so answering right away lost your first words. Now the chime comes first, and it only says "Yes?" if you go quiet, unsure whether it caught you.

## what it remembers

From a family member you expect memory, and I wanted Teya to remember the way a person does, not the way a database does: today vivid, last week fuzzy, last month down to a few facts that stuck.

So it keeps no transcripts. At the end of a conversation the model writes down the one thing worth keeping, or nothing at all, and the raw exchange is never written to disk. Then, at night, while the phone sits charging, it does what agent builders call dreaming, or sleep-time. **In its sleep it works the day's notes into lasting facts about the family, and lets anything that didn't come up again fade**, so what mattered comes back on its own and the rest goes quiet. It leaves a log you can read in the morning to see what it kept. There's nothing to leak, either, because no record of what was said is ever written down.

## what stays home

Almost everything Teya does happens on the phone. The household roster, the per-person memory, the shopping list: all of it lives on the device and nowhere else. The one thing that leaves the house is the text of a single turn, sent to the model to think and speak, and even that is gone once the conversation ends.

Recognizing who's talking is where that choice cost me something. Teya guesses which of us is speaking from a small embedding model that runs on the phone ([CAM++](https://github.com/k2-fsa/sherpa-onnx)), matched against a voice sample each of us recorded once and that never leaves it. A cloud speaker service would be more accurate and far less work to build. Keeping it on the device means the family's voices stay in the family.

The roster also bounds who the model can contact. A call can only ever go to a name on the household list, so a kid saying "call papa" reaches me, not a stranger or an unknown number. An email or an invite only goes to people already in the house. What Teya remembers is yours to read and to delete, never sold back to you or turned into ad targeting.

## put it on a wall

The whole thing is open source. It runs on almost any Android phone: sideload the app, drop in one Mistral key, and it's yours. The code is on GitHub, and so is everything behind it, the design notes, the experiments, the dead ends I've only sketched here: [github.com/adgapar/teya](https://github.com/adgapar/teya). Put it on a spare phone, see how it holds up in your house, and if you make it better or catch where I went wrong, send it back.

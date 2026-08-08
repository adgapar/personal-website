Date: 2026-01-31
Title: from finding bias to fixing it
Subtitle: what data scientists knew before LLMs, and why it still applies
Image: background-images/newsletter/from-finding-to-fixing.png

I built a scoring system for job candidates before I ever took a course on AI fairness. When you're building something that affects who gets interviewed and who gets passed over, fairness isn't an afterthought.

I took an AI Ethics course: forty hours of fairness frameworks, impossibility theorems, measurement approaches. I expected to find things I'd missed. Mostly I found my instincts confirmed — the same principles data scientists have always worked with, formalized into academic vocabulary.

This is my translation back, for any engineer building LLM-based systems who didn't come up through classical ML.

## what data scientists already knew

Every data scientist who has competed on Kaggle has done the Titanic dataset: predict which passengers survived the shipwreck, given data on gender, passenger class, age, cabin, ticket price.

A naive model trained on that data learns that being a woman or first-class passenger predicts survival — because historically, it did. "Women and children first" was actual policy; first-class passengers had easier access to lifeboats. The model isn't wrong — it's faithfully encoding historical reality, which is exactly the problem.

The more interesting finding came from data scientists who looked carefully. The name field — seemingly useless noise — turned out to be a proxy for both gender and class. You could infer gender from the name itself. The titles embedded in names ("Sir," "Master," "the Countess of...") correlated strongly with ticket class, because upper-class passengers were addressed differently. A field that looked like an identifier was carrying demographic signal the whole time.

This is a principle every data scientist internalized: garbage-in, garbage-out, and the garbage is often hiding where you're not looking. A model trained on biased data learns biased patterns — but bias also hides in fields you'd never think to audit.

Data preparation and cleaning existed partly for this reason. We didn't spend 80% of a project on data prep just to remove nulls and normalize formats — we did it to control what the model learns. Business domain knowledge was always a differentiator in data science because you needed to know what was in your data: what patterns were artifacts of historical discrimination, what proxies stood in for protected attributes, what correlations were technically valid but ethically wrong to use.

The data scientist's instinct before modeling was always to understand the domain's bias patterns. In recruitment, identical resumes with different names get different callback rates; age hides behind "culture fit." In healthcare, racial bias shows up in pain assessment and cardiac diagnosis. In lending, zip codes became proxies for race. None of this is obscure — it's been documented, litigated, studied for decades, and knowing it was part of the job.

## what LLMs made us forget

LLMs accept any structure — raw text, unformatted documents, messy inputs — so data preparation felt unnecessary and we stopped doing it. The friction disappeared, but the problem didn't.

The bias got absorbed into the model itself, pre-baked, at a scale no data scientist ever cleaned by hand. The foundation model was trained on internet-scale data: historical narratives, stereotypes, patterns encoded across billions of tokens. You didn't train it and can't retrain it; it arrives with whatever the internet contained.

The canary was there early. Word2vec's famous result — "king − man + woman = queen" — showed that algebraic operations on word embeddings produced semantically meaningful results, which looked like the model understood meaning. It also produced "doctor − man + woman = nurse." Bias was encoded at the representational level, built into the geometry of the embedding space itself. That was 2013, and the same principle is in every modern LLM — more buried, more trusted.

In classical ML you could see your training data — audit it, clean it, understand what went in. In LLMs that visibility is gone, yet we trust these models more because they're bigger, more capable, more fluent. Invisible training data combined with high trust is where things go wrong quietly.

In classical ML, bias entered primarily through training data. In LLMs, it enters through more layers:

**The foundation model.** It arrives pre-baked — the starting condition, but not the only one.

**Your prompts and instructions.** How you frame the task shapes outputs. A prompt asking to assess "strong communication skills" or "leadership potential" imports a definition of those things — almost certainly majority-culture expectations, because that's what most training data reflects.

**How you define success.** Someone defined what "good" means in your system. That definition carries assumptions. In recruitment it's the job criteria; in content moderation it's the policy definitions. Engineers implement them faithfully. The bias is upstream, and often it's not the engineer's doing.

**The reasoning the model generates.** Reasoning models output reasoning, not just decisions. That reasoning can be biased even when the final answer looks balanced — and if humans see the reasoning, it shapes their judgment regardless of what the score says.

**Randomness.** LLMs are stochastic: the same input can produce different outputs. That variance might not be evenly distributed — some groups experience more inconsistency than others, which means someone's outcome depends partly on when they happened to submit.

You're not auditing a model; you're auditing a system: model plus prompts plus success definitions plus reasoning plus randomness.

## a vocabulary you need

Before auditing anything, you need to know what you're measuring — and that there isn't one answer.

Fairness isn't a single thing. Different definitions point toward genuinely different goals:

**Demographic parity** asks whether outcome rates are similar across groups. If 30% of one group gets a positive outcome, roughly 30% of another should too. This treats fairness as equal results.

**Equal opportunity** asks whether, among people who deserve a positive outcome, rates are equal. This requires knowing who "should" qualify — which is often uncertain and potentially biased itself.

**Counterfactual fairness** asks whether the output would change if you swapped demographic signals. Change the name from Michael to Mei-Lin — does the score move? This treats fairness as consistency regardless of identity.

When stakeholders argue about whether your system is "fair," they're usually applying different definitions to the same data. Knowing this vocabulary is how you have that conversation instead of talking past each other.

Mathematicians have proven these properties can't all be satisfied simultaneously. When base rates differ between groups — which they almost always do — equal false positive rates, equal false negative rates, and equal predictive values cannot coexist. Data scientists have always had to choose what to optimize: precision versus recall, accuracy versus interpretability. Fairness works the same way. Choosing which properties matter most in a given context, and documenting why, is the actual work. The math doesn't give you an out.

## how to find it

The starting point is always the domain: what discrimination patterns exist here, how have they been documented, and how might they show up in a system like this. LLMs trained on historical data automate historical patterns rather than eliminating them.

Prompts are uncomfortable to read as a bias auditor, because the implicit standards are everywhere. Phrases like "professional communication" or "strong leadership" encode majority-culture expectations without anyone choosing to put them there. Few-shot examples often aren't demographically balanced. Default assumptions run through everything: linear career progression, full-time employment history, native-level English. These aren't malicious choices; they're invisible ones.

Signal leakage is the Titanic problem applied to a real system. The obvious signals, names and photos, are easy to catch. The subtle ones are harder: dates signal age; location signals race and class; writing style signals education and native language; institutional affiliations signal socioeconomic background. Removing names from a CV doesn't remove the signals that travel alongside them. The only way to know what's leaking is to test: run the same input with and without identifiers.

In systems that output reasoning, the reasoning itself needs auditing. A recruiter who reads "despite her unconventional background" makes a different evaluation than one who reads "given his strong foundation," even with identical scores. The output can look clean while the reasoning is doing damage.

## how to test

The most direct test is counterfactual: change the demographic signals and see if the output changes. Swap names — Michael/Mei-Lin, John/Jamal, Sarah/Sunita — shift graduation years, change locations, alter institutional affiliations. This is the primary approach we use on our scoring system, because it's hard to argue with: if changing the name changes the score, something is wrong.

What counterfactual testing misses is intersections. A system can look fair across each dimension separately while failing badly at their combination. Buolamwini and Gebru showed this in Gender Shades: facial analysis systems appeared acceptable when analyzed by gender alone or skin tone alone, but at the intersection of dark-skinned women, error rates reached 34.7% versus 0.8% for light-skinned men. Single-axis testing would have passed those systems.

Variance is the third test. The same input run through a stochastic system multiple times can produce different outputs, and if that variance is unevenly distributed across demographic groups, randomness itself is creating unfairness: someone's outcome depends partly on when they happened to submit. A person who gets a different result on Monday than Tuesday doesn't trust the system, regardless of what aggregate statistics show.

## how to fix it

Most fairness work focuses on what to remove: redact the name, blur the photo, mask the dates. The more powerful move is to design what enters the system in the first place. Consider two architectures for CV scoring:

Architecture A: Pass the raw CV with names redacted.
Architecture B: Extract structured data — years of experience, education level, job history — into a standardized format. The model only ever sees this profile.

Both remove the name, but Architecture B also eliminates writing style, document formatting, and all the signals encoded in how someone presents themselves. Names leak through email addresses; writing style correlates with education and native language. Extraction-by-design eliminates entire categories of proxy variables without enumerating each one.

The second intervention I didn't expect to matter as much as it did: forcing the model to say it doesn't know. In classical ML, this was the rejection option. Instead of a hard threshold (classify positive if probability > 0.5), you'd treat the margin as undecided, routing anything between 0.45 and 0.55 to human review rather than forcing it into a label. Uncertain predictions are worse than no prediction. The LLM equivalent is designing an UNKNOWN option into the output schema: score a criterion 0–3, or return UNKNOWN if the evidence is insufficient, with a requirement to cite specific evidence for any non-UNKNOWN score. LLMs fill gaps by default; when evidence is missing, the model interpolates rather than returning null, and those interpolations encode training data patterns. The UNKNOWN option short-circuits that. Calibration matters: too high and the system becomes useless, too low and the model is still guessing with more elaborate justifications, but getting it right removes an entire class of biased inference.

The hardest problem isn't in the model at all. In recruitment, hiring managers write the scoring criteria: "must have 5+ years experience," "demonstrates leadership," "strong communication skills." Five years of experience assumes linear career paths, penalizing anyone who took time off for caregiving or health. "Strong communication skills" often means "communicates like the people already here." A fair implementation of biased criteria is still biased, and the pattern appears in every domain: content moderation policies encode what speech is "acceptable," recommendation systems encode what content is "relevant." The specification itself needs auditing, not just the model that implements it.

Taking the course confirmed what I already suspected: the fairness problems in LLM systems aren't new problems. They're old problems wearing new clothes. The one thing that's genuinely new is the ability to make choices explicit — document the trade-off, name the risk, write down why you accepted it. The vocabulary has formalized. The underlying logic hasn't moved.

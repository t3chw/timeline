---
title: "Mutually exclusive vs independent events"
date: 2026-10-08
time: "14:10"
subject: Probability
kind: study
tags: [probability, independence, mutually-exclusive, conditional-probability, interviews]
summary: "Mutually exclusive events can't happen together, while independent events don't change each other's probability. With positive probabilities, mutually exclusive events are always dependent, and overlapping events can still be independent. A classic interview trap, with examples and follow-up questions."
---

## What is an event?

An event is simply a **collection of outcomes we care about**. For a dice roll:

$$
\Omega = \{1,2,3,4,5,6\}
$$

Suppose $A = \{\text{roll is 1}\}$ and $B = \{\text{roll is 2}\}$. These are two events.

## Mutually exclusive events

Two events are mutually exclusive if **they cannot happen at the same time**.

**Dice example.** Let $A = \text{roll an even number}$ and $B = \text{roll an odd number}$. Can both happen on the same roll? No. So:

$$
A\cap B = \emptyset
\qquad\text{and therefore}\qquad
P(A\cap B)=0
$$

This is the key definition.

**Another example.** A single user can be classified as `age < 18` or `age 18–30`. If the categories are defined that way, one user cannot belong to both, so those events are mutually exclusive.

## What the intersection means

You need to be extremely comfortable with this. $A\cap B$ means **A happens AND B happens**. Therefore $P(A\cap B)$ is the probability that A and B happen *together*.

For mutually exclusive events:

$$
P(A\cap B)=0
$$

## Independent events

Forget mutually exclusive for a moment. Two events are independent if **knowing that one happened does not change the probability of the other**. Mathematically:

$$
P(A|B)=P(A)
\qquad\text{or equivalently}\qquad
P(B|A)=P(B)
$$

Another very important form, the one interviewers often expect you to know:

$$
\boxed{P(A\cap B)=P(A)P(B)}
$$

### Example: flipping a fair coin twice

Let $A$ = first flip is Heads and $B$ = second flip is Heads. We know $P(A)=0.5$ and $P(B)=0.5$. Now:

$$
P(A\cap B)=P(\text{H,H})=0.25
\qquad\text{and}\qquad
P(A)P(B)=0.5\times0.5=0.25
$$

So $P(A\cap B)=P(A)P(B)$, and they are independent.

**Intuition:** if I tell you "the first flip was Heads", does that change the probability that the second flip is Heads? No, it is still 50%. That's independence.

## The big difference

This is the distinction to be able to say in an interview.

- **Mutually exclusive:** they cannot happen together, $P(A\cap B)=0$.
- **Independent:** one event happening does not change the probability of the other, $P(A|B)=P(A)$, or equivalently $P(A\cap B)=P(A)P(B)$.

## The classic interview trap

Suppose $P(A)>0$ and $P(B)>0$, and A and B are mutually exclusive. Then $P(A\cap B)=0$. But if they were independent we would need $P(A\cap B)=P(A)P(B)$, and since both probabilities are positive:

$$
P(A)P(B)>0
$$

But we already know $P(A\cap B)=0$. **Contradiction.** Therefore:

$$
\boxed{\text{Mutually exclusive events with positive probability cannot be independent.}}
$$

### Intuition: buying one of two products

Let $A$ = user purchases Product A and $B$ = user purchases Product B, and assume a user can purchase exactly one of the two, so they are mutually exclusive.

If I tell you the user purchased A, the probability they purchased B becomes $P(B|A)=0$. But before I told you, suppose $P(B)=0.30$. So:

$$
P(B|A)\neq P(B)
$$

They are **not independent**: knowing A occurred gives you information about B.

### The degenerate case

Could mutually exclusive events ever technically be independent? Yes, but only when one of the events has probability $0$ (then $P(A\cap B)=0=P(A)P(B)$). With positive probabilities, remember:

$$
\boxed{\text{Mutually exclusive + positive probabilities} \Rightarrow \text{dependent}}
$$

## Overlapping but independent: the deck of cards

People sometimes think "if two events overlap, they can't be independent". **That's false.**

Take a standard deck. Let $A$ = card is an Ace and $B$ = card is a Spade. They can happen together, since the Ace of Spades belongs to both, so $P(A\cap B)=\frac{1}{52}$. Now $P(A)=\frac{4}{52}$ and $P(B)=\frac{13}{52}$, so:

$$
P(A)P(B) = \frac{4}{52}\cdot\frac{13}{52} = \frac{52}{2704} = \frac{1}{52}
$$

Therefore $P(A\cap B)=P(A)P(B)$, and they are independent.

The mental model:

> **Independent events CAN happen together.**
> **Mutually exclusive events CANNOT happen together.**

## Visual way to remember

Mutually exclusive: the circles (here, boxes) don't overlap, so $A\cap B=\emptyset$.

```text
  ┌─────────┐     ┌─────────┐
  │    A    │     │    B    │
  └─────────┘     └─────────┘
```

Independence says nothing about geometry. The sets *can* overlap:

```text
  ┌───────────┐
  │         A │
  │     ┌─────┼─────┐
  └─────┼─────┘     │
        │         B │
        └───────────┘
```

The important thing is not the picture. It is: **does knowing A happened change the probability of B?**

## A numerical comparison

Suppose $P(A)=0.3$ and $P(B)=0.4$, and recall $P(A\cup B) = P(A)+P(B)-P(A\cap B)$.

**Case 1: A and B are independent.**

$$
P(A\cap B)=0.3\times0.4=0.12
\qquad
P(A\cup B)=0.3+0.4-0.12=0.58
$$

**Case 2: A and B are mutually exclusive.**

$$
P(A\cap B)=0
\qquad
P(A\cup B)=0.3+0.4=0.7
$$

## Applied scientist and product examples

### Click and purchase

Let $A$ = user clicks the recommendation and $B$ = user makes a purchase. Can they happen together? Yes, a user can click and purchase, so they are **not mutually exclusive**. Are they independent? Probably not, because clicking may affect the probability of purchasing:

$$
P(B|A) \neq P(B)
$$

### Treatment and control

Users are randomly assigned to Treatment or Control. For one user, let $A$ = assigned Treatment and $B$ = assigned Control. Each user gets one assignment, so $P(A\cap B)=0$ and they are mutually exclusive. They are **not independent**: once you know the user is in Treatment, you know they are not in Control. Same fundamental idea as above.

## Independence vs causality

Independence does **not** mean "A does not cause B". It means: knowing A occurred does not change the probability distribution of B. And dependence does not automatically prove causation.

For example, ice cream sales and the number of people swimming may be dependent because **both increase in hot weather**. That doesn't mean ice cream causes swimming. This distinction comes up often in experimentation and causal inference interviews.

## Checking independence from data

*"How would you determine whether two variables are independent from observed data?"*

- For **categorical** variables, one approach is a **chi-square test of independence**.
- For **continuous** variables, correlation gives some information, but:

$$
\boxed{\text{zero correlation does not generally imply independence}}
$$

Classic example: let $Y=X^2$ with $X$ symmetric around zero (for instance uniform on $[-1,1]$). $X$ and $Y$ can have zero Pearson correlation while being strongly dependent, since $Y$ is completely determined by $X$. So, for variables with finite second moments:

$$
\boxed{\text{independence} \Rightarrow \text{zero correlation}}
\qquad\text{but}\qquad
\boxed{\text{zero correlation} \not\Rightarrow \text{independence}}
$$

This is a senior-level follow-up.

## Conditional probability: the cleanest bridge

Independence is easiest to understand through conditional probability:

$$
\boxed{P(A|B)=P(A)}
$$

Read this as: *the probability of A given that B happened is exactly the same as the probability of A before knowing B happened.*

- For dependent events: $P(A|B)\neq P(A)$.
- For mutually exclusive events with positive probability: $P(A|B)=0$ while normally $P(A)>0$, so they are dependent.

This is the bridge to the conditional probability material coming next.

## Interview questions and quick answers

**Q: What does it mean for two events to be mutually exclusive?**
They cannot occur simultaneously: $P(A\cap B)=0$.

**Q: What does it mean for two events to be independent?**
$P(A\cap B)=P(A)P(B)$, or $P(A|B)=P(A)$.

**Q: What's the difference between mutually exclusive and independent?**
Answer it without formulas first: *mutually exclusive means the events cannot happen together; independence means the occurrence of one does not change the probability of the other.*

**Q: Can independent events occur simultaneously?**
Yes.

**Q: Can mutually exclusive events be independent?**
Only in the degenerate zero-probability case. With positive probabilities, no.

**Q: Are mutually exclusive events dependent?**
Yes, when both have positive probability.

**Q: If A and B are independent, what is $P(A|B)$?**
$P(A)$.

**Q: If A and B are mutually exclusive and $P(B)>0$, what is $P(A|B)$?**
$0$.

**Q: Does zero correlation mean independence?**
No, not generally.

**Q: Does independence mean no causal relationship?**
No. Independence is a probabilistic relationship; causal claims require a causal framework or experimental design.

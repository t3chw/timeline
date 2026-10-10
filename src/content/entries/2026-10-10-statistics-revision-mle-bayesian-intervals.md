---
title: "Statistics revision: MLE, Bayesian inference and confidence intervals"
date: 2026-10-10
time: "09:49"
subject: Statistics
kind: study
tags: [mle, bayesian, confidence-interval, credible-interval, interviews]
summary: "Revision notes for Applied Scientist interviews: what MLE does and doesn't mean, prior vs posterior, confidence vs credible intervals with a height example, the four places I got stuck, and what to study next."
---

## Where I stand

Ratings reflect one conversation, not a formal assessment. Related: [Likelihood, MLE vs MAP, L2 and bias–variance](/notes/2026-10-10-likelihood-mle-map-l2-bias-variance).

| Topic | Status |
| --- | --- |
| Probability, likelihood, MLE | **Good** |
| Bayesian posterior | **Good** |
| Credible interval | **Good** |
| Log-likelihood (why the log) | **Revise** |
| Bayesian prior | **Revise** |
| Probability over a fixed parameter | **Revise** |
| MLE vs MAP | **Revise** |
| Confidence interval | **Needs practice** |
| Priors and regularization | **Not fully covered** |

## MLE is not an 80% claim

MLE picks the parameter that maximises the likelihood of the observed data:

$$
\boxed{\hat{\theta}_{\text{MLE}}=\arg\max_\theta P(D\mid\theta)}
$$

For 10 tosses with 8 heads, $\hat p=\frac{8}{10}=0.8$.

> **Important:** this does **not** mean there is an 80% probability that the true parameter equals 0.8. It is the value that makes the data most likely, a single point estimate.

## Why the log?

*(Added to cover the "Revise" item above.)*

- A product of many small probabilities becomes tiny and awkward to differentiate.
- The log turns the product into a **sum**, which is easier and numerically stable.
- Log is increasing, so the best parameter does not change:

$$
\arg\max_\theta\prod_i P(x_i\mid\theta)=\arg\max_\theta\sum_i\log P(x_i\mid\theta)
$$

## Prior and posterior

Bayesian inference combines prior information with observed evidence:

$$
\boxed{P(\theta\mid D)\propto P(D\mid\theta)\,P(\theta)}
$$

- **Prior:** uncertainty **before** seeing data.
- **Likelihood:** how well parameter values explain the data.
- **Posterior:** updated uncertainty **after** seeing data. It is a probability distribution over possible parameter values.

The posterior does **not** guarantee we have found the true parameter.

## Confidence interval: height example

We estimate the average height of university students: **170 cm**, with a 95% confidence interval of:

$$
[165,\ 175]
$$

We can report: *"Our estimated population mean is 170 cm, with a 95% confidence interval from 165 to 175 cm."*

- The 95% means the **procedure** that builds the interval captures the true mean in 95% of repeated samples (under its assumptions).
- It does **not** guarantee that this particular interval contains the true mean.

## Credible interval: same example

Suppose the Bayesian posterior gives:

$$
P(165\leq\mu\leq175\mid D)=0.95
$$

Given the prior, model and data, the posterior assigns **95% probability** to the population mean being between 165 and 175 cm.

## The one-line difference

- **Confidence interval** → how reliable the interval-building **procedure** is.
- **Credible interval** → the **posterior probability** assigned to a parameter range.

## Stuck 1: probability over a fixed parameter

I kept asking how Bayesian inference can put a probability on a parameter when the true value is fixed.

**To strengthen:** the difference between a parameter's **actual value** and our **uncertainty** about it.

*(Short answer, added.)* The parameter is fixed. The probability describes **what we know**, not randomness in the parameter.

## Stuck 2: one interval vs repeated experiments

**My highest-priority topic.** I understood that different samples give different estimates, but not how "100 hypothetical experiments" connects to the single interval we report.

*(Short answer, added.)*

- The 95% describes the **method**, before seeing the data: repeat the whole study many times, and about 95% of the intervals built this way contain the true mean.
- Our one interval is **one draw** from that process. It either contains the true mean or not, and we don't know which.

**Next:** a complete numerical example.

## Stuck 3: why the posterior isn't "the true probability"

I first treated posterior probability as the actual, guaranteed probability of a parameter.

- The posterior depends on the **prior** and the **model**.
- Change either and the posterior changes.
- A wrong model or prior can give a confident but wrong posterior.

## Stuck 4: priors and regularization

Important for interviews. The link to work through:

$$
\boxed{\text{Gaussian prior}\longleftrightarrow\text{L2 regularization}}
$$

Derive how MAP with a Gaussian prior produces an L2 penalty (under appropriate assumptions). The derivation is in [the MLE vs MAP note](/notes/2026-10-10-likelihood-mle-map-l2-bias-variance). The L1 partner is a **Laplace prior**.

## What to study next

In this order, using **one simple example throughout**:

1. Confidence intervals: the single-interval meaning, with a full numerical example.
2. Sampling distribution and standard error: why uncertainty shrinks with more data.
3. Bayesian priors: how different priors change the posterior.
4. MLE vs MAP: derive both on paper.
5. Regularization and Bayes: Gaussian prior ↔ L2, Laplace prior ↔ L1.

## Test yourself

Try to answer out loud before opening each one.

<details>
<summary>If 8 heads in 10 tosses gives an MLE of 0.8, what does that NOT mean?</summary>

It does **not** mean there is an 80% probability that the true parameter is 0.8. It is just the value that makes the observed data most likely.

</details>

<details>
<summary>Why do we maximise the log-likelihood instead of the likelihood?</summary>

The log turns a product into a sum (easier to differentiate and numerically stable), and since log is increasing the maximising parameter is unchanged.

</details>

<details>
<summary>What does a 95% confidence interval of [165, 175] cm mean, and what doesn't it mean?</summary>

The **procedure** captures the true mean in 95% of repeated samples. It does **not** guarantee this particular interval contains the true mean.

</details>

<details>
<summary>What does a 95% credible interval mean, and how is it different?</summary>

Given the prior, model and data, the posterior probability that the parameter is in the interval is 95%. Confidence is about the procedure; credible is about the posterior probability of a range.

</details>

<details>
<summary>The parameter is fixed, so what does a Bayesian probability over it represent? And is the posterior "the true probability"?</summary>

It represents **our uncertainty** about the fixed value. It is not the true probability: it depends on the prior and the model, so different choices give different posteriors.

</details>

<details>
<summary>Which prior corresponds to L2 regularization, and which to L1?</summary>

Gaussian prior ↔ L2. Laplace prior ↔ L1.

</details>

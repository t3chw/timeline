---
title: "Likelihood, MLE vs MAP, L2 regularization and bias–variance"
date: 2026-10-10
time: "09:47"
subject: Machine Learning
kind: study
tags: [mle, map, bayesian, regularization, bias-variance]
summary: "Likelihood vs probability, maximum likelihood (MLE), Bayesian inference and MAP, why L2 regularization is a Gaussian prior and shrinks weights, underfitting, confidence vs credible intervals, and the start of the bias–variance trade-off."
---

## Probability vs likelihood

The same formula, with a different thing held fixed:

- **Probability:** the parameter is fixed, the data varies. *Given a fair coin, how likely are 8 heads in 10 tosses?*
- **Likelihood:** the data is fixed (already observed), the parameter varies. *Given 8 heads, which coin bias fits best?*

$$
\boxed{L(\theta\mid D)=P(D\mid\theta)}
$$

> Likelihood is **not** a probability distribution over parameters.

## Maximum likelihood estimation (MLE)

MLE picks the parameter that makes the observed data **most likely**:

$$
\boxed{\hat\theta_{\text{MLE}}=\arg\max_\theta P(D\mid\theta)}
$$

**Example:** 10 tosses, 8 heads. Under a binomial model:

$$
\hat p_{\text{MLE}}=\frac{8}{10}=0.8
$$

**Log trick:** taking the log turns a product into a sum, which is easier to optimise:

$$
\log\prod_i P(x_i\mid\theta)=\sum_i\log P(x_i\mid\theta)
$$

## Bayesian inference

Bayes' theorem updates a belief about the parameter after seeing data:

$$
\boxed{P(\theta\mid D)=\frac{P(D\mid\theta)\,P(\theta)}{P(D)}}
$$

| Term | Meaning |
| --- | --- |
| Prior $P(\theta)$ | Belief about the parameter **before** the data |
| Likelihood $P(D\mid\theta)$ | How well the parameter explains the data |
| Posterior $P(\theta\mid D)$ | Updated belief **after** the data |
| Evidence $P(D)$ | Normalising term |

- Bayesian inference gives a **posterior distribution** over parameters, not just one point estimate.
- The more informative the data, the less a fixed prior matters.

## MLE vs MAP

- **MLE:** uses only the likelihood.
- **MAP:** uses the likelihood **and** the prior.

$$
\hat w_{\text{MLE}}=\arg\max_w P(D\mid w)
\qquad
\hat w_{\text{MAP}}=\arg\max_w P(D\mid w)\,P(w)
$$

As informative data grows, MLE and MAP get closer (under suitable assumptions), because the prior matters less.

## Worked example: MLE vs MAP

A single neuron $\hat y=wx$ on the data $(1,2),\ (2,4),\ (3,9)$. Using squared error summed over the points:

$$
\hat w_{\text{MLE}}=\frac{\sum xy}{\sum x^2}=\frac{2+8+27}{1+4+9}=\frac{37}{14}\approx 2.643
$$

With L2 strength $\lambda=5$ (the MAP version):

$$
\hat w_{\text{MAP}}=\frac{\sum xy}{\sum x^2+\lambda}=\frac{37}{14+5}=\frac{37}{19}\approx 1.947
$$

The prior pulls the weight towards zero.

## L2 regularization

Add a penalty on large weights to the data loss:

$$
\boxed{J(w)=\mathcal L_{\text{data}}+\lambda w^2}
$$

- It **discourages large weights**; it does **not** reduce the number of parameters.
- It doesn't ordinarily make weights exactly zero.
- Large weights are not automatically proof of overfitting.
- Too much regularization causes **underfitting**.

## How L2 changes gradient descent

Differentiating $J(w)$ gives an update that first shrinks the weight, then takes the usual data step:

$$
\boxed{w_{\text{new}}=(1-2\eta\lambda)\,w-\eta\,\frac{d\mathcal L_{\text{data}}}{dw}}
$$

So each step multiplies $w$ by $(1-2\eta\lambda)<1$. This is why L2 is also called **weight decay**.

## L2 is a Gaussian prior

Assume the weight has a zero-mean Gaussian prior, $w\sim\mathcal N(0,\sigma^2)$. Its negative log is:

$$
-\log P(w)=\frac{w^2}{2\sigma^2}+C
$$

That is an L2 penalty. So **Gaussian prior + MAP = L2 regularization**.

A **bigger prior variance** $\sigma^2$ means a weaker prior, so a **weaker** regularization effect.

## Why shrinking weights can reduce overfitting

*(My open question from the chat; this section adds an explanation to study.)*

- Large weights let the output swing a lot for a small change in the input, so the model can bend to fit **noise**.
- Shrinking limits that flexibility, so predictions change less between different training sets (**lower variance**), at the cost of a little **bias**.
- With the numbers above: if the true line is $y=2x$, the point $(3,9)$ is noisy (the line gives 6). MLE chases it ($2.643$). MAP shrinks to $1.947$, closer to the true slope $2$.

> This is one example, not a proof. With other data, shrinkage can pull away from the truth. That trade-off is exactly bias–variance.

## Underfitting

Take very strong L2 regularization on $\hat y=wx$. It pushes $w\approx 0$, so:

$$
\hat y\approx 0
$$

Even when the true relationship is $y=2x$, the model cannot learn it. That is **underfitting**.

**Takeaway:** the goal is not the smallest weights. It is to **balance fitting the data against controlling complexity**.

## Confidence vs credible interval

| Confidence interval | Credible interval |
| --- | --- |
| Frequentist | Bayesian |
| Long-run coverage of an interval-building procedure | Posterior probability inside the interval |
| The parameter is fixed and unknown | Uncertainty is represented by a posterior |

- **95% confidence interval:** the procedure covers the true parameter in 95% of repeated experiments.
- **95% credible interval:** given the prior, data and model, the posterior probability that the parameter lies in the interval is 95%.

This is one reason a Bayesian posterior over weights is useful for **uncertainty estimation**.

## Bias–variance trade-off (just started)

- **High bias:** the model's *average* prediction is far from the true relationship.
- **High variance:** predictions change a lot when the model is trained on **different datasets** from the same population.

High variance does **not** simply mean that changing the input changes the prediction.

**House-price example, prediction at $x=3$** (true expected output is 60):

| Training dataset | Prediction |
| --- | --- |
| Dataset 1 | 60 |
| Dataset 2 | 61 |
| Dataset 3 | 59 |

The predictions stay close across datasets, so variance at $x=3$ is **low**. Bias and variance have not been calculated yet.

## Still shaky, and what's next

- **Still shaky:** explaining *in my own words* why shrinking weights helps generalization, and when it fails.
- **Not yet done:** bias and variance calculated by hand.
- **Next:** bias–variance with a small numerical example, worked out by hand. It ties regularization, overfitting and generalization together.

## The five equations to remember

$$
L(\theta\mid D)=P(D\mid\theta)
\qquad
\hat\theta_{\text{MLE}}=\arg\max_\theta P(D\mid\theta)
$$

$$
P(\theta\mid D)\propto P(D\mid\theta)\,P(\theta)
$$

$$
\hat\theta_{\text{MAP}}=\arg\max_\theta P(D\mid\theta)\,P(\theta)
\qquad
J(w)=\mathcal L_{\text{data}}+\lambda w^2
$$

## Test yourself

Try to answer out loud before opening each one.

<details>
<summary>What is the difference between probability and likelihood?</summary>

Same formula, $L(\theta\mid D)=P(D\mid\theta)$. For **probability** the parameter is fixed and the data varies; for **likelihood** the data is fixed and the parameter varies. Likelihood is not a distribution over parameters.

</details>

<details>
<summary>What is the difference between MLE and MAP? What were the two weights for (1,2), (2,4), (3,9)?</summary>

MLE maximises only the likelihood; MAP maximises likelihood × prior. Here $\hat w_{\text{MLE}}=37/14\approx 2.643$ and, with $\lambda=5$, $\hat w_{\text{MAP}}=37/19\approx 1.947$.

</details>

<details>
<summary>How does L2 regularization change the gradient descent update?</summary>

$w_{\text{new}}=(1-2\eta\lambda)\,w-\eta\,\dfrac{d\mathcal L_{\text{data}}}{dw}$. Each step first shrinks the weight (weight decay), then applies the normal data gradient.

</details>

<details>
<summary>Which prior corresponds to L2, and what does a bigger prior variance do?</summary>

A zero-mean Gaussian prior, since $-\log P(w)=\dfrac{w^2}{2\sigma^2}+C$. Bigger $\sigma^2$ is a weaker prior, so weaker regularization.

</details>

<details>
<summary>Why can shrinking weights reduce overfitting, and when does it hurt?</summary>

Large weights let the model bend to fit noise; shrinking limits that, lowering variance for a little extra bias. Too much shrinkage pushes $w\approx0$ and the model **underfits**, so the goal is a balance.

</details>

<details>
<summary>What is the difference between a 95% confidence interval and a 95% credible interval?</summary>

**Confidence (frequentist):** the procedure covers the true parameter in 95% of repeated experiments. **Credible (Bayesian):** given the prior, data and model, the posterior probability the parameter is in the interval is 95%.

</details>

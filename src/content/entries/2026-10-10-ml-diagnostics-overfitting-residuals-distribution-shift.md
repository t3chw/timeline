---
title: "ML diagnostics: overfitting, validation, distribution shift and residuals"
date: 2026-10-10
time: "09:50"
subject: Machine Learning
kind: study
tags: [bias-variance, overfitting, validation, residuals, distribution-shift]
summary: "Revision notes for Applied Scientist interviews: bias vs variance, telling overfitting from distribution shift, why validation data stays fixed, how residual plots reveal systematic errors, and why model complexity doesn't guarantee overfitting."
---

## Bias and variance

- **High bias:** the model is too restrictive to capture the true pattern.
- **High variance:** small changes in the training dataset cause large changes in the model's predictions.
- A complex model may **overfit**. An overly simple model may **underfit**.

Earlier start on this topic: [Likelihood, MLE vs MAP, L2 and bias–variance](/notes/2026-10-10-likelihood-mle-map-l2-bias-variance).

## Where I got confused: weights vs variance

I first mixed up weights changing during training with high variance.

- Weights changing across epochs is **normal**. That is just training.
- High variance is about **predictions changing when we retrain on different training samples**.
- **Low variance does not mean accurate.** A model can be stable and consistently wrong (high bias).

**Status:** improving, needs more practice.

## Overfitting and underfitting

- Training loss falls but validation loss stays flat: **overfitting** is a reasonable suspicion. Reducing model complexity is a sensible response.
- High variance is **closely associated** with overfitting, but I had treated them as exactly the same thing.
- Poor validation performance can also come from **distribution shift**.
- High bias often leads to **underfitting**.
- A complex model does **not necessarily** overfit.

**Status:** good conceptual foundation.

## Training, validation and test

- **Training** updates the model's parameters.
- **Validation** evaluates performance and helps choose between models.
- **Test** is the final evaluation on held-out data.

The validation set stays **fixed** across epochs. I had wondered about rotating samples between training and validation every epoch.

*(Added.)* If it rotated, the model would eventually train on all of it, and validation would stop measuring performance on unseen data. Cross-validation rotates between separate training **runs**, not between epochs.

## Distribution shift: what I know

- Training and validation distributions can differ.
- Two distributions can have the **same mean and variance** but different shapes.
- If both are Gaussian, matching mean and variance means they are the **same distribution**.

**Gap:** I wasn't sure how to investigate differences beyond mean, variance and histograms.

## Distribution shift: what to learn next

- Comparing feature distributions.
- Comparing **joint** distributions.
- Covariate shift.
- Why similar distributions for each feature do **not** guarantee a similar relationship between features and labels.

**Status:** needs practice.

## Residual analysis (my biggest difficulty)

I understood prediction error, but not how to spot **systematic** errors.

$$
\boxed{\text{Residual}=\text{Actual}-\text{Predicted}}
$$

**House prices example:** if the model consistently **underpredicts expensive houses**, the errors have a pattern. Detect it by plotting residuals against house size or against the predicted price.

## Reading a residual plot

- **Random residuals around zero:** no obvious systematic pattern.
- **A systematic pattern:** the model is missing something.
- That "something" could be a feature, a nonlinear relationship, or another modelling issue.

**Status:** needs focused practice.

## Feature engineering

- Location is likely an important feature for house prices.
- Compare models **before and after** adding a feature.
- How to notice a missing feature: look for **systematic errors**. If the model consistently underpredicts houses in Mumbai, location may be missing.
- But a missing feature is **not the only explanation** for systematic errors.

**Status:** needs practice.

## Model complexity and generalization

- A constant model cannot capture a linear relationship. A linear model can capture a straight line.
- A complex neural network is not automatically better. Reducing complexity can sometimes improve validation performance.
- Complexity makes it **possible** to fit complicated patterns, including noise. It does **not** guarantee overfitting.

**Status:** good.

## My assessment

Ratings reflect one conversation, not overall ability.

| Topic | Status |
| --- | --- |
| High bias | **Good** |
| Overfitting and underfitting | **Good** |
| Training and validation | **Good** |
| Model complexity | **Good** |
| High variance | **Improving** |
| Distribution shift | **Developing** |
| Feature engineering | **Developing** |
| Residual analysis | **Needs practice** |

## What to work on next

Only three things, in this order. **Don't start five new topics at once.**

1. **Bias and variance:** the difference between model *stability* and model *accuracy*. Practise reasoning about two models trained on slightly different datasets.
2. **Training and validation loss:** read learning curves and tell overfitting, underfitting and distribution mismatch apart.
3. **Residual analysis:** find systematic prediction errors and use them to investigate model problems.

## Test yourself

Try to answer out loud before opening each one.

<details>
<summary>The weights change every epoch. Is that high variance? What is high variance?</summary>

No, changing weights during training is normal. High variance means **predictions change a lot when the model is retrained on different training samples**.

</details>

<details>
<summary>Can a model have low variance and still be bad?</summary>

Yes. It can be stable but consistently wrong, which is **high bias**. Low variance does not mean accurate.

</details>

<details>
<summary>Training loss keeps falling but validation loss stays flat. What do you suspect, and what else could explain poor validation performance?</summary>

Suspect **overfitting** and consider reducing model complexity. Poor validation can also come from **distribution shift** between training and validation data.

</details>

<details>
<summary>Why does the validation set stay fixed across epochs instead of being rotated?</summary>

If it rotated into training, the model would eventually see all of it, so validation would no longer measure performance on **unseen** data.

</details>

<details>
<summary>What is a residual, and how can residuals reveal a systematic error?</summary>

Residual = actual − predicted. Plot residuals against a feature or the prediction. Random scatter around zero is fine; a **pattern** (e.g. expensive houses always underpredicted) means the model is missing something, such as a feature or a nonlinear relationship.

</details>

<details>
<summary>Does a more complex model always overfit?</summary>

No. Complexity makes it **possible** to fit noise, but it doesn't guarantee overfitting. Reducing complexity only helps if the model is actually overfitting.

</details>

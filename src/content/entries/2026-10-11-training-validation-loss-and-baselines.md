---
title: "Training vs validation loss and baseline models"
date: 2026-10-11
time: "14:48"
subject: Machine Learning
kind: study
tags: [validation-loss, overfitting, baseline, learning-curves, interviews]
summary: "How to read training vs validation loss (and why equal losses don't prove a good model), how to spot overfitting and underfitting, and how a baseline tells you whether a model is actually good."
---

## Training vs validation loss

| Training loss | Validation loss | Interpretation |
| --- | --- | --- |
| Low | Low | Good generalization (usually) |
| High | High | Possible underfitting |
| Low | High | Possible overfitting |
| Almost equal | Almost equal | Not enough information alone |

> **Important:** equal training and validation losses do **not** necessarily mean the model is performing well. They could be equally bad.

## Reading the learning curves

<div class="plots">
<figure class="plot">
<svg viewBox="0 0 230 172" role="img" aria-label="Training and validation loss both fall to a low value and stay close together">
<text class="ttl" x="30" y="17">Good fit</text>
<line class="gd" x1="30" y1="110.2" x2="222" y2="110.2"/><line class="gd" x1="30" y1="86.4" x2="222" y2="86.4"/><line class="gd" x1="30" y1="62.6" x2="222" y2="62.6"/><line class="gd" x1="30" y1="38.8" x2="222" y2="38.8"/>
<path class="ax" d="M30 34 L30 134 L222 134"/>
<text x="9" y="84" text-anchor="middle" transform="rotate(-90 9 84)">loss</text>
<text x="126" y="156" text-anchor="middle">epochs</text>
<path class="tr" d="M30.0 38.8 L34.8 51.6 L39.6 62.5 L44.4 71.7 L49.2 79.5 L54.0 86.1 L58.8 91.7 L63.6 96.5 L68.4 100.5 L73.2 103.9 L78.0 106.7 L82.8 109.2 L87.6 111.2 L92.4 113.0 L97.2 114.4 L102.0 115.7 L106.8 116.7 L111.6 117.6 L116.4 118.4 L121.2 119.0 L126.0 119.6 L130.8 120.0 L135.6 120.4 L140.4 120.8 L145.2 121.0 L150.0 121.3 L154.8 121.5 L159.6 121.6 L164.4 121.8 L169.2 121.9 L174.0 122.0 L178.8 122.1 L183.6 122.2 L188.4 122.2 L193.2 122.3 L198.0 122.3 L202.8 122.4 L207.6 122.4 L212.4 122.4 L217.2 122.4 L222.0 122.5"/>
<path class="vl" d="M30.0 38.8 L34.8 49.9 L39.6 59.4 L44.4 67.6 L49.2 74.7 L54.0 80.7 L58.8 85.8 L63.6 90.3 L68.4 94.0 L73.2 97.3 L78.0 100.1 L82.8 102.5 L87.6 104.5 L92.4 106.3 L97.2 107.8 L102.0 109.1 L106.8 110.2 L111.6 111.1 L116.4 112.0 L121.2 112.7 L126.0 113.3 L130.8 113.8 L135.6 114.2 L140.4 114.6 L145.2 114.9 L150.0 115.2 L154.8 115.4 L159.6 115.6 L164.4 115.8 L169.2 116.0 L174.0 116.1 L178.8 116.2 L183.6 116.3 L188.4 116.4 L193.2 116.4 L198.0 116.5 L202.8 116.6 L207.6 116.6 L212.4 116.6 L217.2 116.7 L222.0 116.7"/>
<text class="tx-vl" x="220" y="109.7" text-anchor="end">validation</text>
<text class="tx-tr" x="220" y="136.5" text-anchor="end">training</text>
<text x="73.2" y="78.8">low and close together</text>
</svg>
</figure>
<figure class="plot">
<svg viewBox="0 0 230 172" role="img" aria-label="Training loss keeps falling while validation loss falls, then rises, leaving a large gap">
<text class="ttl" x="30" y="17">Overfitting</text>
<line class="gd" x1="30" y1="110.2" x2="222" y2="110.2"/><line class="gd" x1="30" y1="86.4" x2="222" y2="86.4"/><line class="gd" x1="30" y1="62.6" x2="222" y2="62.6"/><line class="gd" x1="30" y1="38.8" x2="222" y2="38.8"/>
<path class="ax" d="M30 34 L30 134 L222 134"/>
<text x="9" y="84" text-anchor="middle" transform="rotate(-90 9 84)">loss</text>
<text x="126" y="156" text-anchor="middle">epochs</text>
<path class="tr" d="M30.0 38.8 L34.8 52.9 L39.6 64.9 L44.4 75.1 L49.2 83.7 L54.0 91.0 L58.8 97.2 L63.6 102.4 L68.4 106.8 L73.2 110.5 L78.0 113.7 L82.8 116.4 L87.6 118.6 L92.4 120.6 L97.2 122.2 L102.0 123.6 L106.8 124.7 L111.6 125.7 L116.4 126.5 L121.2 127.2 L126.0 127.8 L130.8 128.4 L135.6 128.8 L140.4 129.1 L145.2 129.5 L150.0 129.7 L154.8 129.9 L159.6 130.1 L164.4 130.3 L169.2 130.4 L174.0 130.5 L178.8 130.6 L183.6 130.7 L188.4 130.8 L193.2 130.8 L198.0 130.9 L202.8 130.9 L207.6 130.9 L212.4 131.0 L217.2 131.0 L222.0 131.0"/>
<path class="vl" d="M30.0 38.8 L34.8 51.7 L39.6 62.1 L44.4 70.6 L49.2 77.4 L54.0 82.8 L58.8 87.1 L63.6 90.5 L68.4 93.0 L73.2 94.9 L78.0 96.2 L82.8 97.1 L87.6 97.5 L92.4 97.6 L97.2 97.4 L102.0 97.0 L106.8 96.3 L111.6 95.4 L116.4 94.4 L121.2 93.1 L126.0 91.7 L130.8 90.2 L135.6 88.6 L140.4 86.8 L145.2 84.9 L150.0 82.9 L154.8 80.8 L159.6 78.6 L164.4 76.3 L169.2 73.9 L174.0 71.4 L178.8 68.9 L183.6 66.2 L188.4 63.4 L193.2 60.6 L198.0 57.6 L202.8 54.6 L207.6 51.5 L212.4 48.3 L217.2 45.0 L222.0 41.6"/>
<text class="tx-vl" x="220" y="34.6" text-anchor="end">validation</text>
<text class="tx-tr" x="220" y="145.0" text-anchor="end">training</text>
<line class="mark" x1="92.4" y1="34" x2="92.4" y2="134"/><text x="96.4" y="43">best epoch</text><line class="mark" x1="198.0" y1="130.9" x2="198.0" y2="57.6"/><text x="194.0" y="98.2" text-anchor="end">big gap</text>
</svg>
</figure>
<figure class="plot">
<svg viewBox="0 0 230 172" role="img" aria-label="Training and validation loss both stay high and flat">
<text class="ttl" x="30" y="17">Underfitting</text>
<line class="gd" x1="30" y1="110.2" x2="222" y2="110.2"/><line class="gd" x1="30" y1="86.4" x2="222" y2="86.4"/><line class="gd" x1="30" y1="62.6" x2="222" y2="62.6"/><line class="gd" x1="30" y1="38.8" x2="222" y2="38.8"/>
<path class="ax" d="M30 34 L30 134 L222 134"/>
<text x="9" y="84" text-anchor="middle" transform="rotate(-90 9 84)">loss</text>
<text x="126" y="156" text-anchor="middle">epochs</text>
<path class="tr" d="M30.0 38.8 L34.8 41.6 L39.6 44.0 L44.4 46.2 L49.2 48.1 L54.0 49.8 L58.8 51.3 L63.6 52.6 L68.4 53.8 L73.2 54.8 L78.0 55.7 L82.8 56.6 L87.6 57.3 L92.4 57.9 L97.2 58.4 L102.0 58.9 L106.8 59.3 L111.6 59.7 L116.4 60.1 L121.2 60.4 L126.0 60.6 L130.8 60.8 L135.6 61.0 L140.4 61.2 L145.2 61.4 L150.0 61.5 L154.8 61.6 L159.6 61.8 L164.4 61.9 L169.2 61.9 L174.0 62.0 L178.8 62.1 L183.6 62.1 L188.4 62.2 L193.2 62.2 L198.0 62.3 L202.8 62.3 L207.6 62.3 L212.4 62.4 L217.2 62.4 L222.0 62.4"/>
<path class="vl" d="M30.0 38.8 L34.8 41.0 L39.6 43.0 L44.4 44.7 L49.2 46.3 L54.0 47.6 L58.8 48.8 L63.6 49.9 L68.4 50.8 L73.2 51.6 L78.0 52.4 L82.8 53.0 L87.6 53.6 L92.4 54.1 L97.2 54.5 L102.0 54.9 L106.8 55.2 L111.6 55.5 L116.4 55.8 L121.2 56.0 L126.0 56.2 L130.8 56.4 L135.6 56.6 L140.4 56.7 L145.2 56.9 L150.0 57.0 L154.8 57.1 L159.6 57.2 L164.4 57.2 L169.2 57.3 L174.0 57.4 L178.8 57.4 L183.6 57.5 L188.4 57.5 L193.2 57.5 L198.0 57.6 L202.8 57.6 L207.6 57.6 L212.4 57.6 L217.2 57.7 L222.0 57.7"/>
<text class="tx-vl" x="220" y="50.7" text-anchor="end">validation</text>
<text class="tx-tr" x="220" y="76.4" text-anchor="end">training</text>
<text x="58.8" y="91.1">both stay high</text>
</svg>
</figure>
</div>
<p class="plot-note">Illustrative curves, not real data.</p>

## Spotting overfitting and underfitting

- **Overfitting:** training loss keeps decreasing, but validation loss starts **increasing**.
- **Underfitting:** the model cannot adequately learn the training patterns.
- **Good generalization:** it performs well on both training data and unseen validation data.

> A small training–validation gap does **not** guarantee good performance.

## What is a baseline?

A baseline is a **reference point** used to evaluate and compare model performance. Three common kinds:

- **Naive baseline:** majority-class prediction.
- **Simple ML baseline:** logistic regression, linear regression, a decision tree.
- **Existing benchmark:** published results, or the current production model.

## How to use a baseline

1. Define the problem and the evaluation **metric**.
2. Start with a **simple** baseline model.
3. Train a more sophisticated model.
4. Compare both on the **same validation set and metric**.
5. Ask whether the complex model gives a **meaningful** improvement.

## Example: the neural net that loses

| Model | Training accuracy | Validation accuracy |
| --- | --- | --- |
| Logistic regression | 90% | 89% |
| Neural network | 60% | 59% |

<figure class="plot wide">
<svg viewBox="0 0 360 245" role="img" aria-label="Accuracy of logistic regression (90% training, 89% validation) and a neural network (60% training, 59% validation)">
<line class="gd" x1="44" y1="192.0" x2="348" y2="192.0"/>
<text x="38" y="196.0" text-anchor="end">0%</text>
<line class="gd" x1="44" y1="154.0" x2="348" y2="154.0"/>
<text x="38" y="158.0" text-anchor="end">25%</text>
<line class="gd" x1="44" y1="116.0" x2="348" y2="116.0"/>
<text x="38" y="120.0" text-anchor="end">50%</text>
<line class="gd" x1="44" y1="78.0" x2="348" y2="78.0"/>
<text x="38" y="82.0" text-anchor="end">75%</text>
<line class="gd" x1="44" y1="40.0" x2="348" y2="40.0"/>
<text x="38" y="44.0" text-anchor="end">100%</text>
<path class="ax" d="M44 40 L44 192 L348 192"/>
<rect class="fill-tr" x="69.0" y="55.2" width="48" height="136.8" rx="3"/>
<text class="val" x="93.0" y="49.2" text-anchor="middle">90%</text>
<rect class="fill-vl" x="123.0" y="56.7" width="48" height="135.3" rx="3"/>
<text class="val" x="147.0" y="50.7" text-anchor="middle">89%</text>
<text x="120.0" y="212" text-anchor="middle">Logistic regression</text>
<rect class="fill-tr" x="221.0" y="100.8" width="48" height="91.2" rx="3"/>
<text class="val" x="245.0" y="94.8" text-anchor="middle">60%</text>
<rect class="fill-vl" x="275.0" y="102.3" width="48" height="89.7" rx="3"/>
<text class="val" x="299.0" y="96.3" text-anchor="middle">59%</text>
<text x="272.0" y="212" text-anchor="middle">Neural network</text>
<line class="mark" x1="202.0" y1="56.7" x2="348" y2="56.7"/>
<text x="348" y="50.7" text-anchor="end">baseline validation: 89%</text>
<line class="mark" x1="336" y1="56.7" x2="336" y2="102.3"/>
<text x="330" y="83.5" text-anchor="end">30 points below</text>
<rect class="fill-tr" x="44" y="12" width="10" height="10" rx="2"/><text x="59" y="21">training</text>
<rect class="fill-vl" x="124" y="12" width="10" height="10" rx="2"/><text x="139" y="21">validation</text>
</svg>
<figcaption>Both models have a tiny train/validation gap, but the neural network is 30 points below the baseline.</figcaption>
</figure>

The neural network is **worse than the baseline**. Possible reasons: underfitting, optimization problems, or implementation errors.

## Interview takeaways

- **Never** conclude overfitting or underfitting from loss values alone.
- Compare training and validation performance, **including trends across epochs**.
- Use a **baseline** to judge whether performance is good or poor.
- A complex model does not necessarily beat a simple one.
- If both losses plateau, investigate optimization, model capacity and baseline performance.

> **Key takeaway:** a baseline tells you how good the model is *relative to a reference*, while the training–validation gap tells you about *generalization*.

## Test yourself

Try to answer out loud before opening each one.

<details>
<summary>Training loss and validation loss are almost equal. Is the model good?</summary>

Not necessarily. They could both be equally **high** (underfitting). Equal losses alone don't tell you how good the model is.

</details>

<details>
<summary>How do the training and validation curves look when a model is overfitting?</summary>

Training loss keeps decreasing, but validation loss starts **increasing**, which opens a growing gap between them.

</details>

<details>
<summary>What is a baseline, and what are three common kinds?</summary>

A reference point for judging model performance: a **naive** baseline (majority class), a **simple ML** model (logistic or linear regression, decision tree), or an **existing benchmark** (published results or the production model).

</details>

<details>
<summary>Logistic regression gets 90% / 89% (train / validation) and a neural network gets 60% / 59%. What do you conclude, and what would you check?</summary>

The network is far **worse than the baseline** even though its train/validation gap is tiny. Check for underfitting, optimization problems (learning rate, training too short) and implementation bugs.

</details>

<details>
<summary>Why shouldn't you decide overfitting or underfitting from loss values alone?</summary>

A single pair of numbers hides the trend and the reference point. Look at the curves across epochs and compare against a baseline.

</details>

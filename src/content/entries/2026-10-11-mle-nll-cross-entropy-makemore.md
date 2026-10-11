---
title: "MLE, negative log-likelihood and cross-entropy loss"
date: 2026-10-11
time: "17:01"
subject: Machine Learning
kind: study
tags: [mle, nll, cross-entropy, makemore, softmax]
summary: "How maximum likelihood becomes negative log-likelihood and then cross-entropy loss, why a neural network (Makemore part 2) uses the same objective as the counting bigram (part 1), and how mini-batch training fits in."
---

## MLE in one line

**Maximum likelihood estimation:** choose the parameters $\theta$ that make the observed data as probable as possible.

Worked example from Makemore part 1. The model gave these probabilities to the *actual* next characters in three training examples:

$$
p_1=0.5,\quad p_2=0.8,\quad p_3=0.6
$$

Multiply them (each example is scored given its own context):

$$
\mathcal L(\theta)=0.5\times0.8\times0.6=0.24
$$

## Why take the log?

- Multiplying thousands of probabilities gives a tiny number that **underflows**.
- The log turns multiplication into **addition**:

$$
\log\mathcal L=\log(0.5)+\log(0.8)+\log(0.6)
$$

- Log is increasing, so the best parameters don't change.

*(Here "log" is the natural log, ln, as in PyTorch. The numbers below only match with ln.)*

## Negative log-likelihood (NLL)

Log probabilities are $\leq 0$, so we flip the sign and **minimise** instead of maximise:

$$
\text{NLL}=-\sum_{i=1}^{N}\log p_i=1.427
$$

The **average** is what we usually report:

$$
\boxed{\text{Average NLL}=\frac{1.427}{3}=0.476}
$$

> Maximising likelihood, maximising log-likelihood and minimising NLL all give the **same** best parameters.

## Bigram vs neural network: what changes?

**My main confusion.** Makemore part 2 adds embeddings and a neural network, but the **objective does not change**.

| | Part 1: bigram | Part 2: MLP |
| --- | --- | --- |
| Model | Count-based | Neural network |
| How it gets probabilities | A probability table | Embeddings → hidden layer → logits → softmax |
| Loss | Average NLL | Average NLL |

$$
-\frac{1}{N}\sum_{i=1}^{N}\log P(y_i\mid x_i)
$$

> The difference is **how the model produces probabilities**, not how the loss is defined.

## From logits to a loss (one example)

1. The network computes **logits**.
2. **Softmax** turns logits into probabilities.
3. Pick the probability of the **actual** next character.
4. Take its negative log:

$$
L_i=-\log P(y_i\mid x_i)
$$

## The loss for a batch of 32

Average the per-example losses over the batch:

$$
\boxed{L_{\text{batch}}=-\frac{1}{32}\sum_{i=1}^{32}\log P(y_i\mid x_i)}
$$

This is the **average NLL of the batch**. In PyTorch:

```python
logits = h @ W2 + b2                # shape (32, 27)
loss = F.cross_entropy(logits, Y)   # Y has shape (32,)
```

- `F.cross_entropy` takes the **raw logits** and does the softmax, log and average for you.

## Gradients reach the whole network

**Correction I needed:** the loss is computed at the output layer, but **gradients flow backward through the entire network**, including the embeddings. Backpropagation plus an optimizer then updates everything.

## Full dataset vs mini-batch

Say 1,000 examples, batches of 32:

| Full dataset | Mini-batch |
| --- | --- |
| Uses all 1,000 examples | Uses 32 examples |
| Full-data NLL | Batch NLL |
| Exact gradient | **Estimate** of the gradient |
| More expensive per update | Cheaper per update |

With **uniformly sampled** batches, the mini-batch gradient is an **unbiased estimate** of the full-data average-loss gradient. So repeated mini-batch updates approximately optimise the full-data MLE objective.

## Cross-entropy with one-hot labels

Makemore predicts one of 27 characters. Simplified to three classes, with the correct next character **m**:

| Character | True label | Predicted probability |
| --- | --- | --- |
| a | 0 | 0.2 |
| e | 0 | 0.1 |
| m | 1 | 0.7 |

$$
L=-\sum_{k=1}^{K}y_k\log(p_k)=-[0\log(0.2)+0\log(0.1)+1\log(0.7)]
$$

$$
\boxed{L=-\log(0.7)=0.357}
$$

The one-hot labels act as **selectors**: every wrong-class term becomes zero.

## Cross-entropy is not y − ŷ

The loss is **not** simply $y-\hat y$. The log comes from maximum likelihood and makes the loss **rise sharply** when the correct class gets a very low probability.

| Probability of correct class | Loss |
| --- | --- |
| 0.99 | 0.010 |
| 0.70 | 0.357 |
| 0.50 | 0.693 |
| 0.10 | 2.303 |
| 0.01 | 4.605 |

<figure class="plot wide">
<svg viewBox="0 0 360 236" role="img" aria-label="The loss minus natural log of p against the probability p given to the correct character: 4.605 at 0.01, 2.303 at 0.10, 0.693 at 0.50, 0.357 at 0.70 and 0.010 at 0.99">
<line class="gd" x1="46" y1="190.0" x2="344" y2="190.0"/>
<text x="39" y="194.0" text-anchor="end">0</text>
<line class="gd" x1="46" y1="156.4" x2="344" y2="156.4"/>
<text x="39" y="160.4" text-anchor="end">1</text>
<line class="gd" x1="46" y1="122.8" x2="344" y2="122.8"/>
<text x="39" y="126.8" text-anchor="end">2</text>
<line class="gd" x1="46" y1="89.2" x2="344" y2="89.2"/>
<text x="39" y="93.2" text-anchor="end">3</text>
<line class="gd" x1="46" y1="55.6" x2="344" y2="55.6"/>
<text x="39" y="59.6" text-anchor="end">4</text>
<line class="gd" x1="46" y1="22.0" x2="344" y2="22.0"/>
<text x="39" y="26.0" text-anchor="end">5</text>
<text x="46.0" y="206" text-anchor="middle">0</text>
<text x="120.5" y="206" text-anchor="middle">0.25</text>
<text x="195.0" y="206" text-anchor="middle">0.5</text>
<text x="269.5" y="206" text-anchor="middle">0.75</text>
<text x="344.0" y="206" text-anchor="middle">1</text>
<path class="ax" d="M46 22 L46 190 L344 190"/>
<text x="11" y="106" text-anchor="middle" transform="rotate(-90 11 106)">loss</text>
<text x="195" y="224" text-anchor="middle">probability given to the correct character</text>
<path class="tr" d="M48.4 27.8 L49.1 36.8 L49.9 44.0 L50.6 49.9 L51.3 54.9 L52.1 59.2 L52.8 63.1 L53.6 66.5 L54.3 69.7 L55.0 72.5 L55.8 75.2 L56.5 77.6 L57.3 79.9 L58.0 82.0 L58.7 84.1 L59.5 86.0 L60.2 87.7 L60.9 89.5 L61.7 91.1 L62.4 92.6 L63.2 94.1 L63.9 95.5 L64.6 96.9 L65.4 98.2 L66.1 99.4 L66.9 100.6 L67.6 101.8 L68.3 102.9 L69.1 104.0 L69.8 105.1 L70.6 106.1 L71.3 107.1 L72.0 108.1 L72.8 109.0 L73.5 109.9 L74.3 110.8 L75.0 111.7 L75.7 112.6 L76.5 113.4 L77.2 114.2 L77.9 115.0 L78.7 115.7 L79.4 116.5 L80.2 117.2 L80.9 117.9 L81.6 118.6 L82.4 119.3 L83.1 120.0 L83.9 120.7 L84.6 121.3 L85.3 122.0 L86.1 122.6 L86.8 123.2 L87.6 123.8 L88.3 124.4 L89.0 125.0 L89.8 125.6 L90.5 126.1 L91.2 126.7 L92.0 127.2 L92.7 127.7 L93.5 128.3 L94.2 128.8 L94.9 129.3 L95.7 129.8 L96.4 130.3 L97.2 130.8 L97.9 131.3 L98.6 131.7 L99.4 132.2 L100.1 132.7 L100.9 133.1 L101.6 133.6 L102.3 134.0 L103.1 134.5 L103.8 134.9 L104.6 135.3 L105.3 135.7 L106.0 136.2 L106.8 136.6 L107.5 137.0 L108.2 137.4 L109.0 137.8 L109.7 138.2 L110.5 138.6 L111.2 138.9 L111.9 139.3 L112.7 139.7 L113.4 140.1 L114.2 140.4 L114.9 140.8 L115.6 141.2 L116.4 141.5 L117.1 141.9 L117.9 142.2 L118.6 142.5 L119.3 142.9 L120.1 143.2 L120.8 143.6 L121.5 143.9 L122.3 144.2 L123.0 144.5 L123.8 144.9 L124.5 145.2 L125.2 145.5 L126.0 145.8 L126.7 146.1 L127.5 146.4 L128.2 146.7 L128.9 147.0 L129.7 147.3 L130.4 147.6 L131.2 147.9 L131.9 148.2 L132.6 148.5 L133.4 148.8 L134.1 149.1 L134.9 149.3 L135.6 149.6 L136.3 149.9 L137.1 150.2 L137.8 150.4 L138.5 150.7 L139.3 151.0 L140.0 151.2 L140.8 151.5 L141.5 151.8 L142.2 152.0 L143.0 152.3 L143.7 152.5 L144.5 152.8 L145.2 153.0 L145.9 153.3 L146.7 153.5 L147.4 153.8 L148.2 154.0 L148.9 154.3 L149.6 154.5 L150.4 154.7 L151.1 155.0 L151.8 155.2 L152.6 155.5 L153.3 155.7 L154.1 155.9 L154.8 156.1 L155.5 156.4 L156.3 156.6 L157.0 156.8 L157.8 157.0 L158.5 157.3 L159.2 157.5 L160.0 157.7 L160.7 157.9 L161.5 158.1 L162.2 158.4 L162.9 158.6 L163.7 158.8 L164.4 159.0 L165.2 159.2 L165.9 159.4 L166.6 159.6 L167.4 159.8 L168.1 160.0 L168.8 160.2 L169.6 160.4 L170.3 160.6 L171.1 160.8 L171.8 161.0 L172.5 161.2 L173.3 161.4 L174.0 161.6 L174.8 161.8 L175.5 162.0 L176.2 162.2 L177.0 162.4 L177.7 162.6 L178.5 162.8 L179.2 162.9 L179.9 163.1 L180.7 163.3 L181.4 163.5 L182.2 163.7 L182.9 163.9 L183.6 164.0 L184.4 164.2 L185.1 164.4 L185.8 164.6 L186.6 164.8 L187.3 164.9 L188.1 165.1 L188.8 165.3 L189.5 165.5 L190.3 165.6 L191.0 165.8 L191.8 166.0 L192.5 166.1 L193.2 166.3 L194.0 166.5 L194.7 166.6 L195.5 166.8 L196.2 167.0 L196.9 167.1 L197.7 167.3 L198.4 167.5 L199.1 167.6 L199.9 167.8 L200.6 168.0 L201.4 168.1 L202.1 168.3 L202.8 168.4 L203.6 168.6 L204.3 168.7 L205.1 168.9 L205.8 169.1 L206.5 169.2 L207.3 169.4 L208.0 169.5 L208.8 169.7 L209.5 169.8 L210.2 170.0 L211.0 170.1 L211.7 170.3 L212.5 170.4 L213.2 170.6 L213.9 170.7 L214.7 170.9 L215.4 171.0 L216.1 171.2 L216.9 171.3 L217.6 171.5 L218.4 171.6 L219.1 171.7 L219.8 171.9 L220.6 172.0 L221.3 172.2 L222.1 172.3 L222.8 172.5 L223.5 172.6 L224.3 172.7 L225.0 172.9 L225.8 173.0 L226.5 173.2 L227.2 173.3 L228.0 173.4 L228.7 173.6 L229.4 173.7 L230.2 173.8 L230.9 174.0 L231.7 174.1 L232.4 174.2 L233.1 174.4 L233.9 174.5 L234.6 174.6 L235.4 174.8 L236.1 174.9 L236.8 175.0 L237.6 175.2 L238.3 175.3 L239.1 175.4 L239.8 175.5 L240.5 175.7 L241.3 175.8 L242.0 175.9 L242.8 176.1 L243.5 176.2 L244.2 176.3 L245.0 176.4 L245.7 176.6 L246.4 176.7 L247.2 176.8 L247.9 176.9 L248.7 177.0 L249.4 177.2 L250.1 177.3 L250.9 177.4 L251.6 177.5 L252.4 177.7 L253.1 177.8 L253.8 177.9 L254.6 178.0 L255.3 178.1 L256.1 178.2 L256.8 178.4 L257.5 178.5 L258.3 178.6 L259.0 178.7 L259.7 178.8 L260.5 179.0 L261.2 179.1 L262.0 179.2 L262.7 179.3 L263.4 179.4 L264.2 179.5 L264.9 179.6 L265.7 179.8 L266.4 179.9 L267.1 180.0 L267.9 180.1 L268.6 180.2 L269.4 180.3 L270.1 180.4 L270.8 180.5 L271.6 180.6 L272.3 180.8 L273.1 180.9 L273.8 181.0 L274.5 181.1 L275.3 181.2 L276.0 181.3 L276.7 181.4 L277.5 181.5 L278.2 181.6 L279.0 181.7 L279.7 181.8 L280.4 181.9 L281.2 182.0 L281.9 182.2 L282.7 182.3 L283.4 182.4 L284.1 182.5 L284.9 182.6 L285.6 182.7 L286.4 182.8 L287.1 182.9 L287.8 183.0 L288.6 183.1 L289.3 183.2 L290.1 183.3 L290.8 183.4 L291.5 183.5 L292.3 183.6 L293.0 183.7 L293.7 183.8 L294.5 183.9 L295.2 184.0 L296.0 184.1 L296.7 184.2 L297.4 184.3 L298.2 184.4 L298.9 184.5 L299.7 184.6 L300.4 184.7 L301.1 184.8 L301.9 184.9 L302.6 185.0 L303.4 185.1 L304.1 185.2 L304.8 185.3 L305.6 185.4 L306.3 185.5 L307.0 185.6 L307.8 185.6 L308.5 185.7 L309.3 185.8 L310.0 185.9 L310.7 186.0 L311.5 186.1 L312.2 186.2 L313.0 186.3 L313.7 186.4 L314.4 186.5 L315.2 186.6 L315.9 186.7 L316.7 186.8 L317.4 186.9 L318.1 186.9 L318.9 187.0 L319.6 187.1 L320.4 187.2 L321.1 187.3 L321.8 187.4 L322.6 187.5 L323.3 187.6 L324.0 187.7 L324.8 187.8 L325.5 187.8 L326.3 187.9 L327.0 188.0 L327.7 188.1 L328.5 188.2 L329.2 188.3 L330.0 188.4 L330.7 188.5 L331.4 188.6 L332.2 188.6 L332.9 188.7 L333.7 188.8 L334.4 188.9 L335.1 189.0 L335.9 189.1 L336.6 189.2 L337.3 189.2 L338.1 189.3 L338.8 189.4 L339.6 189.5 L340.3 189.6 L341.0 189.7 L341.8 189.7 L342.5 189.8 L343.3 189.9 L344.0 190.0"/>
<circle class="fill-tr" cx="49.0" cy="35.3" r="4"/>
<text class="val" x="58.0" y="39.3" text-anchor="start">4.605</text>
<circle class="fill-tr" cx="75.8" cy="112.6" r="4"/>
<text class="val" x="84.8" y="116.6" text-anchor="start">2.303</text>
<circle class="fill-tr" cx="195.0" cy="166.7" r="4"/>
<text class="val" x="202.0" y="158.7" text-anchor="start">0.693</text>
<circle class="fill-tr" cx="254.6" cy="178.0" r="4"/>
<text class="val" x="261.6" y="170.0" text-anchor="start">0.357</text>
<circle class="fill-tr" cx="341.0" cy="189.7" r="4"/>
<text class="val" x="336.0" y="180.7" text-anchor="end">0.010</text>
<text x="105.6" y="65.7">wrong and confident: huge loss</text>
<text x="195.0" y="137.9">right and confident: near 0</text>
</svg>
<figcaption>Loss = −ln p for the correct character. It flattens out as p nears 1 and shoots up as p nears 0.</figcaption>
</figure>

## Where p − y does appear

*(Added, and checked numerically.)* The mix-up is easy to make because the **gradient** of softmax + cross-entropy with respect to the logits really is:

$$
\frac{\partial L}{\partial \text{logits}}=p-y
$$

That is the predicted probabilities minus the one-hot label. The **loss** itself is still $-\log p_{\text{correct}}$.

## Why MLE and cross-entropy are the same

For $N$ independent examples, the likelihood is a product:

$$
\mathcal L(\theta)=\prod_{i=1}^{N}P(y_i\mid x_i;\theta)
$$

Take the negative log and average:

$$
-\frac{1}{N}\log\mathcal L(\theta)=-\frac{1}{N}\sum_{i=1}^{N}\log P(y_i\mid x_i;\theta)
$$

That is exactly the average multiclass cross-entropy with one-hot targets:

$$
\boxed{\text{Minimising cross-entropy}\iff\text{Maximising likelihood}}
$$

This holds for the standard categorical setup **without extra regularization terms**.

## Final takeaways

- **MLE:** choose parameters that maximise the likelihood of the observed data.
- **NLL:** turns that into a minimisation problem.
- **Cross-entropy:** the NLL loss for standard classification with one-hot labels.
- **Bigram vs neural net:** same likelihood principle, different way of producing the probabilities.
- **Mini-batch training:** compute the average NLL over a batch and use its gradient to update the parameters.
- **Multiclass:** softmax gives class probabilities; cross-entropy uses the probability of the correct class.

> **Remember:** in Makemore, the counting bigram and the neural network are trained with the **same maximum-likelihood principle**. The network just learns a more flexible way to estimate the probabilities, and mini-batch cross-entropy is the average NLL used to optimise it.

## Test yourself

Try to answer out loud before opening each one.

<details>
<summary>What is MLE, and why do we minimise the negative log-likelihood?</summary>

MLE picks the parameters that make the observed data most likely. Taking the log turns a product into a sum (no underflow), and negating it turns "maximise" into "minimise". The best parameters stay the same.

</details>

<details>
<summary>A model gives the correct next characters probabilities 0.5, 0.8 and 0.6. What are the likelihood, NLL and average NLL?</summary>

Likelihood $0.5\times0.8\times0.6=0.24$. NLL $=-(\ln0.5+\ln0.8+\ln0.6)=1.427$. Average NLL $=1.427/3=0.476$.

</details>

<details>
<summary>Going from the bigram model to the neural network, what changes and what stays the same?</summary>

**Changes:** how the probabilities are produced (a count table vs embeddings → hidden layer → logits → softmax). **Stays the same:** the objective, the average negative log-likelihood of the correct next character.

</details>

<details>
<summary>What does F.cross_entropy(logits, Y) compute for a batch of 32, and what are the shapes?</summary>

The average NLL of the batch, $-\frac{1}{32}\sum\log P(y_i\mid x_i)$. It takes raw logits of shape (32, 27) and targets Y of shape (32,), and does the softmax internally.

</details>

<details>
<summary>With a one-hot label, why does cross-entropy reduce to −log of one probability? Is it just y − ŷ?</summary>

The one-hot label is 1 only for the correct class, so every other term is multiplied by 0, leaving $-\log p_{\text{correct}}$. It is **not** $y-\hat y$. (That quantity, $p-y$, is the *gradient* with respect to the logits, not the loss.)

</details>

<details>
<summary>Why is minimising cross-entropy the same as maximising likelihood, and when does that stop being exactly true?</summary>

The negative average log of the likelihood product is the average cross-entropy with one-hot targets. It stops being exactly the same if you add extra terms such as regularization.

</details>

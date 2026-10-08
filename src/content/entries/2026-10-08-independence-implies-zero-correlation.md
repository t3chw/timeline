---
title: "Proof: independent variables have zero correlation"
date: 2026-10-08
time: "14:12"
subject: Probability
kind: study
tags: [independence, covariance, correlation, expectation, proof]
summary: "If X and Y are independent then E[XY] = E[X]E[Y], so Cov(X, Y) = 0, and with non-zero finite variances Corr(X, Y) = 0. The reverse fails because correlation only detects linear association, while independence rules out any dependence."
---

## The claim

> If two random variables $X$ and $Y$ are **independent**, then their **correlation is $0$**.

The key is to connect three ideas in a chain: independence → covariance → correlation.

## Step 1: correlation is built from covariance

Correlation measures whether $X$ and $Y$ move together **linearly**:

$$
\operatorname{Corr}(X,Y)
=
\frac{\operatorname{Cov}(X,Y)}
{\sigma_X\sigma_Y}
$$

So it is enough to focus on the covariance. Writing $\mu_X=E[X]$ and $\mu_Y=E[Y]$ and expanding the product:

$$
\operatorname{Cov}(X,Y)
= E\big[(X-\mu_X)(Y-\mu_Y)\big]
= E[XY]-\mu_Y E[X]-\mu_X E[Y]+\mu_X\mu_Y
$$

which simplifies to:

$$
\boxed{\operatorname{Cov}(X,Y)=E[XY]-E[X]E[Y]}
$$

So covariance is zero exactly when $E[XY]=E[X]E[Y]$.

## Step 2: independence makes the expectation factor

This is the heart of the proof. Independence gives:

$$
\boxed{E[XY]=E[X]E[Y]}
$$

Why? Independence means the joint distribution is the product of the marginals. (Assume $E[X]$ and $E[Y]$ exist, i.e. are finite.)

**Discrete case.** Independence says $P(X=x,\,Y=y)=P(X=x)\,P(Y=y)$, so:

$$
\begin{aligned}
E[XY]
&=\sum_x\sum_y xy\,P(X=x,\,Y=y)\\
&=\sum_x\sum_y xy\,P(X=x)\,P(Y=y)\\
&=\Big(\sum_x x\,P(X=x)\Big)\Big(\sum_y y\,P(Y=y)\Big)\\
&=E[X]\,E[Y]
\end{aligned}
$$

**Continuous case.** Independence says $f_{X,Y}(x,y)=f_X(x)\,f_Y(y)$, so:

$$
\begin{aligned}
E[XY]
&=\iint xy\,f_{X,Y}(x,y)\,dx\,dy\\
&=\iint xy\,f_X(x)\,f_Y(y)\,dx\,dy\\
&=\Big(\int x\,f_X(x)\,dx\Big)\Big(\int y\,f_Y(y)\,dy\Big)\\
&=E[X]\,E[Y]
\end{aligned}
$$

The double sum (or integral) splits into a product of two separate ones because each factor only depends on one variable.

## Step 3: covariance is zero

Plug the factorisation into the covariance formula:

$$
\operatorname{Cov}(X,Y)
= E[X]E[Y]-E[X]E[Y]
= 0
$$

## Step 4: correlation is zero

If both variables have **non-zero, finite variance**:

$$
\operatorname{Corr}(X,Y)
=
\frac{0}{\sigma_X\sigma_Y}
=0
$$

The condition matters. If one variable is constant, then $\sigma=0$ and the correlation is $0/0$, which is undefined. (A constant is independent of everything, but it has no correlation to speak of.)

## The chain to remember

$$
\boxed{\text{Independence}}
\;\Rightarrow\;
\boxed{\text{Covariance}=0}
\;\Rightarrow\;
\boxed{\text{Correlation}=0}
$$

## Intuition: two independent coin flips

Let $X$ be the result of the first flip and $Y$ the result of the second. The first flip has no influence whatsoever on the second.

- Sometimes $X$ is high and $Y$ is high.
- Sometimes $X$ is high and $Y$ is low.
- Sometimes $X$ is low and $Y$ is high.
- Sometimes both are low.

There is no systematic linear pattern between them. Across many observations, the positive and negative contributions to the covariance cancel out, giving covariance, and therefore correlation, of zero.

**Quick numerical check.** Let $X,Y\in\{0,1\}$ be two independent fair coin flips (1 for Heads). Then $E[X]=E[Y]=0.5$, and $E[XY]=P(\text{both Heads})=0.25$, so:

$$
\operatorname{Cov}(X,Y)=0.25-0.5\times0.5=0
$$

## But not backwards

$$
\text{Correlation}=0
\;\not\Rightarrow\;
\text{Independence}
$$

Correlation only detects **linear** association, whereas independence rules out **any** probabilistic dependence.

A standard counterexample: let $X$ be uniform on $[-1,1]$ and $Y=X^2$. Then $Y$ is completely determined by $X$, so they are strongly dependent. But $E[X]=0$ and $E[XY]=E[X^3]=0$, so:

$$
\operatorname{Cov}(X,Y)=E[X^3]-E[X]E[X^2]=0
$$

Zero covariance, zero correlation, yet not independent. This is the same trap covered in [Mutually exclusive vs independent events](/notes/2026-10-08-mutually-exclusive-vs-independent-events).

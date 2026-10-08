---
title: "SVD: Singular Value Decomposition, the intuition"
date: 2026-10-08
time: "12:26"
subject: Linear Algebra
kind: study
tags: [svd, eigenvalues, matrices, singular-values, rank]
summary: "SVD factors any matrix as A = UΣVᵀ, which reads as rotate, then stretch, then rotate. Unlike eigenvalues it works for non-square matrices, because the input and output directions are allowed to live in different spaces."
---

## What is SVD?

SVD stands for **Singular Value Decomposition**. Any matrix can be decomposed as:

$$
\boxed{A = U\Sigma V^T}
$$

The basic intuition:

$$
\boxed{\text{Rotate} \rightarrow \text{Stretch/Compress} \rightarrow \text{Rotate}}
$$

## What does a matrix do?

A matrix can be viewed as a **function that transforms vectors**. For example,

$$
A=
\begin{bmatrix}
3&1\\
2&4\\
1&2
\end{bmatrix}
$$

has shape $3\times 2$, so it takes:

$$
\boxed{\mathbb R^2\rightarrow\mathbb R^3}
$$

- 2 columns → 2D input
- 3 rows → 3D output

### Example: a 2D → 3D transformation

Take $x = \begin{bmatrix}1\\2\end{bmatrix}$. Then:

$$
Ax=
\begin{bmatrix}
3&1\\
2&4\\
1&2
\end{bmatrix}
\begin{bmatrix}
1\\
2
\end{bmatrix}
=
\begin{bmatrix}
5\\
10\\
5
\end{bmatrix}
$$

So a 2D vector became a 3D vector:

$$
\boxed{
\begin{bmatrix}
1\\
2
\end{bmatrix}
\rightarrow
\begin{bmatrix}
5\\
10\\
5
\end{bmatrix}}
$$

## Eigenvalues vs SVD

### The eigenvalue equation

For eigenvectors:

$$
\boxed{Av=\lambda v}
$$

When the matrix acts on a special vector $v$, the vector stays in the **same direction** and only gets scaled by $\lambda$.

### Why eigenvalues normally require a square matrix

Suppose $A:\mathbb R^2\rightarrow\mathbb R^3$. Then $v\in\mathbb R^2$, but $Av\in\mathbb R^3$, while $\lambda v\in\mathbb R^2$. So we would be saying:

$$
\underbrace{Av}_{\text{3D}}
=
\underbrace{\lambda v}_{\text{2D}}
$$

That doesn't make sense. For the standard eigenvalue problem, the input and output have to live in the **same vector space**, which is why it needs a square matrix.

### SVD doesn't have this problem

SVD uses:

$$
\boxed{Av_i=\sigma_i u_i}
$$

- $v_i$ is the **input** direction
- $u_i$ is the **output** direction
- $\sigma_i$ is the **stretching amount**

Since $v_i$ and $u_i$ don't have to live in the same space, a map like $A:\mathbb R^2\rightarrow\mathbb R^3$ can have $v_i\in\mathbb R^2$ and $u_i\in\mathbb R^3$, which is perfectly valid.

## The three parts of SVD

For $A=U\Sigma V^T$:

### V transpose: the input side

The columns of $V$ are the **right singular vectors**. They give us special directions in the input space.

### Sigma: the stretching

$\Sigma$ holds the **singular values** $\sigma_1,\sigma_2,\ldots$ and says how much each special direction is stretched or compressed. For example,

$$
\Sigma=
\begin{bmatrix}
5&0\\
0&2
\end{bmatrix}
$$

means one special direction gets stretched by $5\times$ and another by $2\times$.

> For a $3\times 2$ matrix like the one above, a $2\times 2$ $\Sigma$ is the compact ("thin") form of SVD. In the full form, $\Sigma$ is $3\times 2$ (the same shape as $A$), padded with a row of zeros, and $U$ becomes $3\times 3$.

### U: the output side

The columns of $U$ are the **left singular vectors**. They describe the corresponding output directions.

## The most important mental model

When we compute $Ax = U\Sigma V^T x$ we work from **right to left**:

$$
x
\rightarrow
V^Tx
\rightarrow
\Sigma V^Tx
\rightarrow
U\Sigma V^Tx
$$

```text
Input vector
     │
     ▼
    Vᵀ     change / rotate coordinates
     │
     ▼
Special directions
     │
     ▼
     Σ     stretch / compress
     │
     ▼
Stretched vector
     │
     ▼
     U     rotate to the final orientation
     │
     ▼
Output vector
```

The big idea:

$$
\boxed{\text{SVD} = \text{Rotate} \rightarrow \text{Stretch} \rightarrow \text{Rotate}}
$$

## How this connects to rank

The $3\times 2$ matrix $A$ above maps $\mathbb R^2\rightarrow\mathbb R^3$, but it doesn't fill all of 3D space. It has only two columns, so its output lives in the **column space** of $A$, which is at most 2-dimensional. This ties directly back to the idea of **rank**.

## The one-sentence summary

> **Eigenvectors** ask: "Which directions stay in the same direction when a square matrix transforms them?"
>
> **SVD** asks: "Which special input directions get transformed into special output directions, and by how much are they stretched?"

That's the foundation to keep in mind before doing the actual SVD calculation.

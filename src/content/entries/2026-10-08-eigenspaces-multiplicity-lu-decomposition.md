---
title: "Eigenvalues, eigenspaces, multiplicity and LU decomposition"
date: 2026-10-08
time: "12:28"
subject: Linear Algebra
kind: study
tags: [eigenvalues, eigenvectors, eigenspace, multiplicity, lu-decomposition, null-space]
summary: "Revision notes on eigenvectors and eigenvalues, the eigenspace as the null space of A − λI, algebraic vs geometric multiplicity, and how LU decomposition splits A into two triangular matrices to make solving Ax = b easier."
---

## Eigenvector and eigenvalue

For a matrix $A$, an eigenvector $v$ satisfies:

$$
Av=\lambda v
$$

- $v$ is the **eigenvector**
- $\lambda$ is the **eigenvalue**
- **Meaning:** after the matrix transformation, the vector stays on the same line (direction); only its scale changes.
- An eigenvector must be **non-zero**.

## Eigenspace

The eigenspace for eigenvalue $\lambda$ is:

$$
E_\lambda = \{v: Av=\lambda v\}
$$

- It contains **all eigenvectors** belonging to $\lambda$, **and the zero vector**.
- Geometrically, it is the set of directions that are scaled by the same eigenvalue.
- It is a **subspace**.

The important connection:

$$
\boxed{E_\lambda = \operatorname{Null}(A-\lambda I)}
$$

So the **eigenspace is the null space of $A-\lambda I$**.

## Algebraic multiplicity

Algebraic multiplicity is **how many times an eigenvalue appears as a root of the characteristic equation**. For example:

$$
(2-\lambda)^2=0 \quad\Rightarrow\quad \lambda=2 \text{ appears twice}
$$

$$
\boxed{\text{Algebraic multiplicity}=2}
$$

Think: *algebraic = repetition in the equation.*

## Geometric multiplicity

Geometric multiplicity is the **dimension of the eigenspace**. In other words: how many *independent* eigenvector directions do we have?

Take:

$$
A=
\begin{bmatrix}
2&1\\
0&2
\end{bmatrix}
$$

For $\lambda=2$:

$$
E_2=
\left\{
\begin{bmatrix}
x\\0
\end{bmatrix}
: x\in\mathbb R
\right\}
$$

This is a line. A single independent vector such as $\begin{bmatrix}1\\0\end{bmatrix}$ generates the whole eigenspace, so:

$$
\boxed{\text{Geometric multiplicity}=1}
$$

while the algebraic multiplicity is $2$.

## The relationship between the two

For every eigenvalue:

$$
\boxed{1\leq \text{Geometric multiplicity}\leq\text{Algebraic multiplicity}}
$$

| Algebraic | Geometric | Meaning |
| --- | --- | --- |
| 2 | 1 | Eigenvalue repeats twice, but only 1 independent direction |
| 2 | 2 | Eigenvalue repeats twice and has 2 independent directions |

Examples:

$$
\begin{bmatrix}
2&1\\
0&2
\end{bmatrix}
$$

has **algebraic multiplicity 2** and **geometric multiplicity 1**. But:

$$
\begin{bmatrix}
2&0\\
0&2
\end{bmatrix}
$$

has **algebraic multiplicity 2** and **geometric multiplicity 2**.

## LU decomposition

The basic idea:

$$
\boxed{A=LU}
$$

We break one complicated matrix $A$ into two simpler ones:

- $L$ is **lower triangular**
- $U$ is **upper triangular**

**Lower triangular** has zeros above the diagonal:

$$
L=
\begin{bmatrix}
1&0\\
3&1
\end{bmatrix}
$$

**Upper triangular** has zeros below the diagonal:

$$
U=
\begin{bmatrix}
2&1\\
0&4
\end{bmatrix}
$$

### How to calculate LU

Take:

$$
A=
\begin{bmatrix}
2&1\\
6&7
\end{bmatrix}
$$

**Step 1: turn $A$ into upper triangular form.** We want to eliminate the $6$. The elimination multiplier is:

$$
\frac{6}{2}=3
$$

Do $R_2\leftarrow R_2-3R_1$, which gives:

$$
U=
\begin{bmatrix}
2&1\\
0&4
\end{bmatrix}
$$

**Step 2: put the multiplier into $L$.** Put $3$ below the diagonal and $1$'s on the diagonal:

$$
L=
\begin{bmatrix}
1&0\\
3&1
\end{bmatrix}
$$

Therefore:

$$
\boxed{
A=
\begin{bmatrix}
1&0\\
3&1
\end{bmatrix}
\begin{bmatrix}
2&1\\
0&4
\end{bmatrix}
}
$$

> Quick check: multiplying the two gives $\begin{bmatrix}2&1\\6&3+4\end{bmatrix}=\begin{bmatrix}2&1\\6&7\end{bmatrix}=A$.
>
> This simple recipe works as long as no zero pivot turns up. If one does, rows have to be swapped first, which gives the variant $PA=LU$.

### Why LU is useful

Suppose we want to solve:

$$
Ax=b
$$

Since $A=LU$, this becomes $LUx=b$. Introduce $z=Ux$. Instead of solving one complicated problem, we solve two simple ones:

1. First $Lz=b$, solved with **forward substitution**.
2. Then $Ux=z$, solved with **back substitution**.

The main purpose of LU is to make solving $Ax=b$ easier, **especially when the same $A$ is used with many different $b$'s**: factor once, then reuse $L$ and $U$.

## The big picture

Mental definitions to keep:

- **Eigenvalue:** how much the eigenvector gets scaled.
- **Eigenvector:** a vector whose direction doesn't change under the matrix.
- **Eigenspace:** all vectors associated with one particular eigenvalue, including zero.
- **Algebraic multiplicity:** how many times the eigenvalue appears in the characteristic equation.
- **Geometric multiplicity:** the number of independent directions in its eigenspace.
- **LU decomposition:** break $A$ into $A=LU$, with $L$ lower triangular and $U$ upper triangular.

## One very important connection

You recently learned the null space, and this ties straight back to it:

$$
\boxed{\text{Eigenspace for }\lambda
=
\operatorname{Null}(A-\lambda I)}
$$

So eigenvectors and eigenspaces are directly connected to the null space.

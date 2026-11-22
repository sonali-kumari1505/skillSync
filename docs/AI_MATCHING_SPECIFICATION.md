# SkillSync AI Recommendation Engine Specification

## 1. Overview
The SkillSync Recommendation Engine is a specialized machine learning microservice built with **Python**, **FastAPI**, and **scikit-learn**. Its core objective is to discover **bilateral (reciprocal) skill complementarities** between students in an academic ecosystem.

---

## 2. Mathematical Formulation

Let Student $A$ be defined by teaching skills $T_A$, learning requirements $L_A$, interest set $I_A$, availability $S_A$, and preferred mode $M_A$.
Similarly, Candidate $B$ is defined by $(T_B, L_B, I_B, S_B, M_B)$.

The compatibility score $C(A, B) \in [0, 100]$ is computed as a weighted linear combination:

$$C(A, B) = w_r \cdot R(A, B) + w_p \cdot P(A, B) + w_i \cdot I(A, B) + w_s \cdot S(A, B)$$

Where:
- $w_r = 55$: Weight of Reciprocal Skill Complementarity
- $w_p = 15$: Weight of Proficiency and Experience Equilibrium
- $w_i = 15$: Weight of Shared Academic Interests and Campus Proximity
- $w_s = 15$: Weight of Schedule Availability and Mode Overlap

### A. Semantic Similarity via TF-IDF & Cosine Similarity
For any two skill descriptors $s_1, s_2$, we compute semantic similarity:

$$\text{Sim}(s_1, s_2) = \frac{\mathbf{v}(s_1) \cdot \mathbf{v}(s_2)}{\|\mathbf{v}(s_1)\| \|\mathbf{v}(s_2)\|}$$

Where $\mathbf{v}(s)$ is the TF-IDF feature representation extracted using unigram and bigram tokenization with stop-word removal.

### B. Reciprocal Complementarity Metric $R(A, B)$
1. **Forward match**: Best match between what Student $A$ wants to learn ($L_A$) and what Candidate $B$ offers ($T_B$):
   $$\text{Score}_{\text{fwd}} = \max_{l \in L_A, t \in T_B} \text{Sim}(l, t)$$
2. **Backward match**: Best match between what Candidate $B$ wants to learn ($L_B$) and what Student $A$ offers ($T_A$):
   $$\text{Score}_{\text{bwd}} = \max_{l \in L_B, t \in T_A} \text{Sim}(t, l)$$
3. **Bilateral Equilibrium**:
   - If $\text{Score}_{\text{fwd}} \ge 0.7$ and $\text{Score}_{\text{bwd}} \ge 0.7$:
     $$R(A, B) = 55 \quad (\text{Direct Reciprocal Match})$$
   - If only $\text{Score}_{\text{fwd}} \ge 0.7$:
     $$R(A, B) = 36 \quad (\text{Strong Instructor Match})$$
   - If only $\text{Score}_{\text{bwd}} \ge 0.7$:
     $$R(A, B) = 26 \quad (\text{Mentorship Opportunity})$$
   - Otherwise:
     $$R(A, B) = 15 \cdot (\text{Score}_{\text{fwd}} + \text{Score}_{\text{bwd}})$$

### C. Proficiency Equilibrium $P(A, B)$
Let the teacher's proficiency level be $p_{\text{teach}} \in [1, 5]$ and the learner's target level be $p_{\text{target}} \in [1, 5]$.
- If $p_{\text{teach}} \ge p_{\text{target}}$: $P(A, B) = 15$ pts
- If $p_{\text{teach}} = p_{\text{target}} - 1$: $P(A, B) = 10$ pts
- Otherwise: $P(A, B) = 5$ pts

### D. Natural Language Explainability
Each recommendation includes human-readable reasons generated dynamically by `SkillSyncMatcher`:
- Direct mutual match identification (e.g., "They teach UI/UX Design which you want, and want to learn Python which you teach!")
- Instructor qualification verification
- Campus community alignment
- Study schedule compatibility

# Skill Benchmark: senior-computer-vision

> ⚠️ **Overall verdict: INCOMPLETE — Required evidence is missing**

### Why This Verdict

- Decision: **INCOMPLETE** — required evidence is missing or unproven, as recorded below.
- Tier 3 evidence: **NOT_RUN** (not publication-complete; required for publication). Dimension gate: an agent passes when every dimension is at or above 50% and fails when any dimension is below 40%.
- Blocking: One or more validators reported incomplete scanner evidence.

One or more required evaluation tiers did not complete, so this benchmark is not publication-complete.

## Evaluation Metadata

- Skill: `senior-computer-vision`
- Source digest: `sha256:84a184e22a414e7aa4bd8588f9e42ba54b66bbaed940f771fe689c7b6185dbff` (skill-evaluator-source-tree/2)
- Quality config: packaged, `sha256:2b34707afbb1b7b88df35e84b2b59d613943c62bfda7f2f82bc31b28b44f1af0`
- Quality min score: 70
- Evaluation date: not recorded (legacy or non-live result)
- Evaluator version: `1.0.1`
- Evaluated source: `alirezarezvani/claude-skills`
- Evaluated source revision: `f8593c4941210a621a6629ce1da9e07897976d5f`
- Evaluator container revision: not recorded (not supplied by the orchestration input)
- Agents: not recorded (legacy or non-live result)
- Tasks: not recorded (legacy or non-live result)
- Dataset digest: not recorded (legacy or non-live result)
- Tier 3 run ID: not recorded (Tier 3 did not complete)
- Attempts per task: not recorded (legacy or non-live result)
- Environment: not recorded (legacy or non-live result)
- Tier 2 evidence: required for publication
- Tier 3 evidence: required for publication

## What This Report Answers

The three-tier evaluation checks whether the skill:

- is safe to use;
- produces correct answers;
- is discovered and activated when needed;
- helps the agent complete the user's goal and expected workflow; and
- avoids wasted skill and tool usage.

## Results at a Glance

Tier 3 live-agent scores were not available. See the tier status table for what ran.

## Tier Status

| Tier | Purpose | Status | Evidence |
|---|---|---|---|
| Tier 1 | Static validation | **INCOMPLETE** | Missing trustworthy evidence from skillspector |
| Tier 2 | Semantic deduplication | **NOT RUN** | No result was recorded |
| Tier 3 | Live agent evaluation | **NOT RUN** | No result was recorded |

## Blocking Findings

- **HIGH** BANDIT/B324:hashlib: Use of weak MD5 hash for security. Consider usedforsecurity=False (CWE-327) (`dataset\_pipeline\_builder.py:1488`)
- **MEDIUM** BANDIT/B314:blacklist: Using xml.etree.ElementTree.parse to parse untrusted XML data is known to be vulnerable to XML attacks. Replace xml.etree.ElementTree.parse with its defusedxml equivalent function or make sure defusedxml.defuse\_stdlib() is called (CWE-20) (`dataset\_pipeline\_builder.py:237`)
- **MEDIUM** BANDIT/B314:blacklist: Using xml.etree.ElementTree.parse to parse untrusted XML data is known to be vulnerable to XML attacks. Replace xml.etree.ElementTree.parse with its defusedxml equivalent function or make sure defusedxml.defuse\_stdlib() is called (CWE-20) (`dataset\_pipeline\_builder.py:433`)
- **MEDIUM** BANDIT/B314:blacklist: Using xml.etree.ElementTree.parse to parse untrusted XML data is known to be vulnerable to XML attacks. Replace xml.etree.ElementTree.parse with its defusedxml equivalent function or make sure defusedxml.defuse\_stdlib() is called (CWE-20) (`dataset\_pipeline\_builder.py:737`)
- **MEDIUM** BANDIT/B314:blacklist: Using xml.etree.ElementTree.parse to parse untrusted XML data is known to be vulnerable to XML attacks. Replace xml.etree.ElementTree.parse with its defusedxml equivalent function or make sure defusedxml.defuse\_stdlib() is called (CWE-20) (`dataset\_pipeline\_builder.py:1415`)

Test execution limitations:

- No standard Python test-file candidates found; target tests were not executed and coverage was not measured. Consider adding tests.

## Findings and Observations

<details>
<summary>Show detailed findings and successful checks</summary>

- **HIGH** BANDIT/B324:hashlib: Use of weak MD5 hash for security. Consider usedforsecurity=False (CWE-327) (`dataset\_pipeline\_builder.py:1488`)
- **MEDIUM** BANDIT/B314:blacklist: Using xml.etree.ElementTree.parse to parse untrusted XML data is known to be vulnerable to XML attacks. Replace xml.etree.ElementTree.parse with its defusedxml equivalent function or make sure defusedxml.defuse\_stdlib() is called (CWE-20) (`dataset\_pipeline\_builder.py:237`)
- **MEDIUM** BANDIT/B314:blacklist: Using xml.etree.ElementTree.parse to parse untrusted XML data is known to be vulnerable to XML attacks. Replace xml.etree.ElementTree.parse with its defusedxml equivalent function or make sure defusedxml.defuse\_stdlib() is called (CWE-20) (`dataset\_pipeline\_builder.py:433`)
- **MEDIUM** BANDIT/B314:blacklist: Using xml.etree.ElementTree.parse to parse untrusted XML data is known to be vulnerable to XML attacks. Replace xml.etree.ElementTree.parse with its defusedxml equivalent function or make sure defusedxml.defuse\_stdlib() is called (CWE-20) (`dataset\_pipeline\_builder.py:737`)
- **MEDIUM** BANDIT/B314:blacklist: Using xml.etree.ElementTree.parse to parse untrusted XML data is known to be vulnerable to XML attacks. Replace xml.etree.ElementTree.parse with its defusedxml equivalent function or make sure defusedxml.defuse\_stdlib() is called (CWE-20) (`dataset\_pipeline\_builder.py:1415`)
- 31 additional finding(s) are available in the full evaluation artifacts.

</details>

## Scoring Methodology

<details>
<summary>Show dimension definitions, source signals, and thresholds</summary>

| Dimension | What it measures | Scored signals | Evidence source | Baseline in this run |
|---|---|---|---|---|
| Security | Is it safe to use? Avoids unsafe operations, secret leakage, and unauthorized access. | `security` (100%) | Deterministic checks of the agent's commands and outputs | Compared when the baseline arm runs |
| Correctness | Is the answer correct? Produces factually accurate output. | `accuracy` (100%) | An LLM judge comparing the final answer with the reference answer | Compared when the baseline arm runs |
| Discoverability | Was the right skill loaded when needed? Activates the right skill when relevant; ignores unrelated skills. | `skill_execution` (100%) | Deterministic checks of the agent's trajectory | Compared when the baseline arm runs |
| Effectiveness | Did the skill help complete the task? Reaches the user's goal and follows the expected behavior. | `goal_accuracy` (50%) + `behavior_check` (50%) | An LLM judge of whether the user's goal was met; an LLM judge of the expected workflow | Compared when the baseline arm runs |
| Efficiency | Did it avoid wasted tool or skill usage? Uses the skill and tools productively without wasted work. | `skill_efficiency` (100%) | Deterministic checks of the agent's trajectory | Compared when the baseline arm runs |

- Dimension bands: PASS at 50% or above; NEUTRAL from 40% to below 50%; FAIL below 40%.
- Overall Tier 3 lift: PASS at +5 points or more; FAIL at -10 points or less; values between those bands are NEUTRAL.
- Overall verdict: PASS only when every configured dimension passes for at least one supported agent, with no with-skill case failing a required goal-accuracy or security check. A scored unmet goal or security issue in any attempt fails its case and that agent's quality verdict, even if all dimensions pass. Baseline-arm required-check failures do not change this quality verdict. Lift is reported as diagnostic evidence and does not override this gate.
- Effectiveness is the equal-weight mean of goal completion (`goal_accuracy`) and expected workflow adherence (`behavior_check`).
- Token efficiency is a separate report-only signal. It does not change a dimension score or the overall verdict.
- The baseline is the same eval cases run by the same agent without the skill. Every dimension is compared with it when the baseline arm ran and scored that dimension.

Which number answers which question:

- **Overall verdict** (top of this card): whether the evidence supports publishing the skill. It needs every required tier, not only Tier 3 scores.
- **Dimension score**: how well the agent did on one question above when it had the skill, from 0% to 100%.
- **Overall** row: when comparable baseline scores are available, the two scores used for published Skill Lift, on the metrics and cases both arms scored comparably. Otherwise, the available arm Overall score(s). These can differ from the headline with-skill score.
- **Uplift**: the displayed skill score minus the displayed no-skill baseline score. Published Skill Lift compares Overall only on the metrics and cases both arms scored, so it can differ. Uplift does not set the verdict.
- **pass@k** (HTML report and `pass_at_k_lift.json`): the share of eval cases with at least one passing attempt out of k. It measures how repeatable success is, separately from the dimension scores.
- **Quality Score** (Tier 1, out of 100): a static review of the skill's files. It is not an input to any Tier 3 score or uplift.

</details>

## Freshness

Regenerate this benchmark when the skill, evaluation dataset, target agent/model, evaluator version, environment, or scoring policy changes.

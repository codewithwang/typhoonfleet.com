# PORTFOLIO REVIEW — typhoonfleet.com

*Reviewed 2026-08-08, the way a skeptical senior engineer would. Same treatment
as the Life OS review. Every claim below is backed by this repo, its git
history, or a live fetch of the deployed site — nothing else.*

---

## 1. What it is

TyphoonFleet.com is a one-page website that presents Harry's personal AI
agents — Life OS, the fitness agent, the Wang Report editor, and two not-yet-
built ones — as a fleet of specialists, drawn as a drum machine you can play.
Clicking a pad selects an agent and shows its status, what it does, and a
slider for how much it's allowed to act on its own. It is the public front
door and brand for the whole system; nothing on the page is connected to the
real agents.

## 2. Honest assessment

### What genuinely impresses

- **The design metaphor does real communication work.** "A machine for
  agents" — sequencer tracks as agents, the transport bar as the
  orchestrator, pads as a roster, a fader for *autonomy instead of volume* —
  is a genuinely good way to explain a multi-agent system to a non-builder.
  The three closing principles (autonomy fader, bring-your-own-model, one
  audit log) are the same governance ideas the real stack cares about,
  stated in one screen.
- **The page is honest about what exists.** The roster data
  (`index.html:328-347`) carries an explicit `status` per agent — 3 `live`,
  2 `designed`, 1 `planned` — rendered as different-colored dots with
  labels. A marketing page that visibly distinguishes "live" from
  "designed" is rarer than it should be, and it matches the cross-repo
  reality (Life OS, fitness, and Wang Report do run; the Red-Teamer does
  not).
- **Discipline of the rewrite.** The June v2 replaced a 2,114-line, 115 KB
  template-styled cybersecurity landing with a 439-line hand-built page —
  one commit, 2,445 lines deleted from `index.html`, and both prior
  versions preserved in-repo (`old/`, `archive-2026-07-07/`) instead of
  erased. The current page is a single 457-line file, ~24 KB, no framework,
  no build step, one external dependency (Google Fonts). It respects
  `prefers-reduced-motion` before animating the playhead.
- **It ships.** Live at https://typhoonfleet.com on GitHub Pages with a
  custom domain, and the deployed HTML matches repo HEAD (verified by
  fetch during this review).

### What gets critiqued

- **It's a brochure wearing an instrument's clothes.** The "Running"
  transport, the 16-step patterns, and the autonomy faders are hardcoded
  aesthetics — `pat:[1,0,1,0,...]` arrays and fixed `autonomy` numbers in a
  JS literal. Nothing reads from, or writes to, any real system. Fine for a
  landing page; a technical audience will press the pads, realize nothing
  is behind them, and dock credibility if the framing oversells.
- **The flagship isn't built.** The copy names Security as "the bar the
  rest are held to" and flags the Red-Teamer as the flagship — an agent
  whose status is `designed`. Leading the pitch with the one ship that
  doesn't exist is a positioning risk, and "Built security-first" in the
  closer is residue of the previous incarnation of this domain (an
  April 2026 cybersecurity-consultancy landing, still in `old/`). The brand
  has pivoted; some copy hasn't fully caught up.
- **Zero engineering scaffolding.** No README, no tests, no CI, no
  accessibility beyond reduced-motion (the pads are `div`s with click
  handlers — not buttons, not keyboard-reachable, no ARIA). For a static
  page none of this is fatal, but the repo offers a visitor no orientation
  at all.
- **Maturity is thin by construction.** Five commits over four months,
  three of them substantive. This repo is a design artifact, not a
  codebase — which is exactly why its ratings below diverge.

### Ratings

- **As a product prototype: 2/10.** There is no product here — no capture,
  no synthesis, no data, no backend. Buttons that look operational are
  decorative. It never claims otherwise, but the rating question is asked
  and this is the honest answer.
- **As a proof-of-concept: 7/10.** As proof that the fleet has a coherent
  public identity — a name, a domain, a governance story (autonomy, model
  choice, audit log), and a visual language that makes "roster of
  specialist agents over one origin" legible in ten seconds — it works,
  it's live, and it's honest about status. It proves the narrative, not
  the agents.

## 3. Proof points

1. **Live in production:** https://typhoonfleet.com returns HTTP 200 on a
   custom domain (CNAME in repo) via GitHub Pages, and the deployed page
   matches repo HEAD (verified 2026-08-08).
2. **2,445 lines deleted by one redesign:** commit `c48ef73` (2026-06-23)
   replaced the 2,114-line / 115 KB v1 landing with a 439-line page —
   roughly 80% smaller — while archiving, not deleting, the old site.
3. **Radically self-contained:** the entire site is one 457-line,
   ~24 KB HTML file — no framework, no build system, no JS dependencies;
   the only external resource is Google Fonts.
4. **Truth-labeled roster:** the page's own data marks 3 agents live,
   2 designed, 1 planned — the live three (Life OS, Fitness, Wang Report
   Editor) are the same systems verified running in their own repos.

## 4. Portfolio material

**One-line pitch:** The fleet's front door — a live one-page site that
turns a roster of personal agents into an instrument you can play.

**What it does:** TyphoonFleet.com presents the whole personal-agent stack
as one machine. A sequencer shows the fleet in a loop — Life OS as the
origin track every other agent hangs off — and a pad bank lets a visitor
select each agent to see its job, its status (live, designed, or planned,
honestly labeled), and its autonomy fader, the control that runs from
"advise" to "act." Three principles close the page: you set each agent's
autonomy, you choose each agent's model, and every action lands in one
audit log. It is a single hand-written HTML file, live on its own domain.

**Place in the stack — tested honestly:** The working hypothesis is
"personal data → agentic synthesis → owned, governed media surfaces."
TyphoonFleet is **not a stage in that pipeline** — it captures no personal
data, synthesizes nothing, and publishes none of the pipeline's output. It
fails the hypothesis as a *component*, and the portfolio shouldn't pretend
otherwise. Its honest role is one level up: it is the **brand and thesis
statement for the stack** — an owned surface (own domain, own repo, zero
platform dependency) whose subject is the system rather than the life the
system observes, and whose closing principles (autonomy fader, bring-your-
own-model, audit log) are the "governed" clause of the hypothesis rendered
as product UI. If the roadmap's media modalities ship — daily voice
report, video bulletin, subscribable news agents — this domain is the
natural place they'd be published from, which would make it a real "owned
media surface" then. Today it's the shop window, and should be presented
as exactly that.

## 5. Screenshots to take

1. **The machine, live at the domain** — browser window with
   `typhoonfleet.com` visible in the address bar, scrolled to the machine:
   origin track "LifeOS · origin" with derived tracks indented beneath it
   and the playhead mid-sweep. Proves it's deployed and animated, and shows
   the hierarchy in one frame.
2. **The detail readout with the fader** — a live agent selected (LifeOS or
   Fitness): green status dot, "Live" status row, autonomy fader between
   Advise and Act. This is the governance story in one image.
3. **The roster with honest labels** — "The Agents" section showing
   green/gold/grey dots and Live / Designed / Planned labels side by side.
   Proves the page tells the truth about maturity, which is the portfolio's
   whole credibility posture.

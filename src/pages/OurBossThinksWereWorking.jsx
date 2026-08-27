import { useEffect, useRef } from "react";
import { usePageMeta } from "../hooks/usePageMeta";

// Unlisted page: not linked from any nav, footer, or sub-page list.
// Reachable only by knowing the URL. Content below is embedded verbatim
// from the supplied league-almanac.html (styles + markup), with the tab
// script re-implemented as a React effect since <script> tags inside
// dangerouslySetInnerHTML don't execute.
const ALMANAC_HTML = `
<style>
  #almanac-root {
    --paper: #e7e0cf;
    --paper-deep: #d8cfb8;
    --ink: #1b1915;
    --ink-soft: #4a463d;
    --faded: #8b8474;
    --stamp: #a8342a;
    --tab: #5f6b45;
    --rule: #b7ad93;
    background: var(--paper);
    color: var(--ink);
    font-family: "Courier New", Courier, monospace;
    padding: 0;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }
  #almanac-root * { box-sizing: border-box; }

  .sheet {
    max-width: 1080px;
    margin: 0 auto;
    padding: 34px 30px 60px;
    background:
      repeating-linear-gradient(0deg, rgba(0,0,0,0.012) 0 2px, transparent 2px 4px),
      var(--paper);
    border: 1px solid var(--rule);
  }

  /* ---- masthead ---- */
  .masthead { position: relative; border-bottom: 3px double var(--ink); padding-bottom: 18px; }
  .filecode {
    font-size: 11px; letter-spacing: 0.28em; text-transform: uppercase;
    color: var(--faded); margin-bottom: 10px;
  }
  .masthead h1 {
    margin: 0; font-size: clamp(30px, 6.2vw, 58px); line-height: 0.98;
    letter-spacing: -0.02em; text-transform: uppercase; font-weight: 700;
  }
  .masthead h1 span { display: block; color: var(--stamp); }
  .subhead {
    margin-top: 14px; font-size: 13px; color: var(--ink-soft);
    max-width: 52ch; line-height: 1.65;
  }
  .stamp {
    position: absolute; top: 4px; right: 0;
    border: 3px solid var(--stamp); color: var(--stamp);
    padding: 8px 14px; transform: rotate(-8deg);
    font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
    text-align: center; line-height: 1.35; opacity: 0.85;
  }
  .stamp b { display: block; font-size: 15px; letter-spacing: 0.1em; }
  @media (max-width: 700px) { .stamp { position: static; display: inline-block; margin-top: 18px; transform: rotate(-3deg); } }

  /* ---- tabs ---- */
  .tabs { display: flex; flex-wrap: wrap; gap: 4px; margin: 26px 0 0; }
  .tab {
    font-family: inherit; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
    padding: 9px 15px; background: var(--paper-deep); color: var(--ink-soft);
    border: 1px solid var(--rule); border-bottom: none; cursor: pointer;
    border-radius: 3px 3px 0 0;
  }
  .tab:hover { color: var(--ink); }
  .tab[aria-selected="true"] { background: var(--tab); color: #f2eee1; border-color: var(--tab); }
  .tab:focus-visible { outline: 2px solid var(--stamp); outline-offset: 2px; }
  .panel { border-top: 1px solid var(--rule); padding-top: 26px; }
  .panel[hidden] { display: none; }

  h2.sec {
    font-size: 12px; letter-spacing: 0.24em; text-transform: uppercase;
    color: var(--stamp); margin: 34px 0 12px; padding-bottom: 6px;
    border-bottom: 1px solid var(--rule);
  }
  h2.sec:first-child { margin-top: 0; }
  p.note { font-size: 13px; color: var(--ink-soft); max-width: 66ch; }

  /* ---- tables ---- */
  table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 8px; }
  th {
    text-align: left; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--faded); border-bottom: 1px solid var(--ink); padding: 6px 8px; font-weight: 700;
  }
  td { padding: 7px 8px; border-bottom: 1px dotted var(--rule); vertical-align: top; }
  tbody tr:hover { background: rgba(95,107,69,0.08); }
  .num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .rk { color: var(--faded); width: 30px; }
  .champ td { background: rgba(168,52,42,0.07); }
  .champ td:first-child::after { content: "★"; color: var(--stamp); margin-left: 5px; }
  .who { font-size: 11px; color: var(--faded); display: block; }
  .tablewrap { overflow-x: auto; }

  /* ---- champions ---- */
  .banners { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; }
  .banner { border: 2px solid var(--ink); padding: 16px; background: var(--paper-deep); }
  .banner .yr { font-size: 30px; font-weight: 700; letter-spacing: -0.02em; }
  .banner .nm { font-size: 15px; margin: 6px 0 4px; font-weight: 700; color: var(--stamp); }
  .banner .dt { font-size: 11px; color: var(--ink-soft); line-height: 1.55; }

  /* ---- record cards ---- */
  .records { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 12px; }
  .rec { border-left: 3px solid var(--tab); padding: 10px 0 10px 12px; }
  .rec .lbl { font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--faded); }
  .rec .val { font-size: 21px; font-weight: 700; margin: 3px 0; font-variant-numeric: tabular-nums; }
  .rec .ctx { font-size: 12px; color: var(--ink-soft); line-height: 1.5; }
  .rec.bad { border-left-color: var(--stamp); }

  /* ---- alias cards ---- */
  .aliases { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; }
  .card { border: 1px solid var(--rule); padding: 14px; background: rgba(255,255,255,0.28); }
  .card h3 { margin: 0 0 3px; font-size: 15px; }
  .card .own { font-size: 11px; color: var(--faded); letter-spacing: 0.06em; }
  .card ol { margin: 10px 0 0; padding-left: 18px; font-size: 12px; color: var(--ink-soft); }
  .card ol li { margin-bottom: 3px; }
  .card ol li.cur { color: var(--ink); font-weight: 700; }
  .flag { display: inline-block; margin-top: 9px; font-size: 10px; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--stamp); border: 1px solid var(--stamp); padding: 2px 6px; }

  .bracket { font-size: 13px; }
  .bracket .rd { font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--faded); margin: 14px 0 5px; }
  .bracket .g { padding: 4px 0; border-bottom: 1px dotted var(--rule); display: flex; justify-content: space-between; gap: 14px; }
  .bracket .g .w { font-weight: 700; }
  .bracket .g .s { font-variant-numeric: tabular-nums; color: var(--ink-soft); white-space: nowrap; }

  footer.colophon { margin-top: 44px; border-top: 3px double var(--ink); padding-top: 16px;
                    font-size: 12px; color: var(--ink-soft); }
  footer.colophon h3 { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--stamp); margin: 0 0 8px; }
  footer.colophon ol { padding-left: 18px; margin: 0; }
  footer.colophon li { margin-bottom: 5px; }
</style>

<div class="sheet">

  <header class="masthead">
    <div class="filecode">Case file 04 · "Our boss thinks we're working" · est. 2023</div>
    <h1>The League<span>Almanac</span></h1>
    <p class="subhead">
      A permanent record of every season played, maintained by The Press Box.
      Franchise names change. The record does not.
    </p>
    <div class="stamp">Records through<b>Season 3</b>2025</div>
  </header>

  <div class="tabs" role="tablist">
    <button class="tab" role="tab" aria-selected="true" aria-controls="p-registry" id="t-registry">Registry</button>
    <button class="tab" role="tab" aria-selected="false" aria-controls="p-champs" id="t-champs">Champions</button>
    <button class="tab" role="tab" aria-selected="false" aria-controls="p-records" id="t-records">Record Book</button>
    <button class="tab" role="tab" aria-selected="false" aria-controls="p-alias" id="t-alias">Known Aliases</button>
    <button class="tab" role="tab" aria-selected="false" aria-controls="p-2023" id="t-2023">2023</button>
    <button class="tab" role="tab" aria-selected="false" aria-controls="p-2024" id="t-2024">2024</button>
    <button class="tab" role="tab" aria-selected="false" aria-controls="p-2025" id="t-2025">2025</button>
  </div>

  <!-- ============ REGISTRY ============ -->
  <section class="panel" id="p-registry" role="tabpanel" aria-labelledby="t-registry">
    <h2 class="sec">All-time regular season · 2023–2025</h2>
    <div class="tablewrap">
    <table>
      <thead><tr>
        <th class="rk">#</th><th>Franchise</th>
        <th class="num">W–L</th><th class="num">Win %</th><th class="num">Points for</th>
        <th class="num">Titles</th><th>Best finish</th>
      </tr></thead>
      <tbody>
        <tr><td class="rk">1</td><td>Bustin Jefferson <span class="who">formerly Hawk N Balls, Penix Envy</span></td><td class="num">27–12</td><td class="num">.692</td><td class="num">4,282.56</td><td class="num">0</td><td>2nd (2025)</td></tr>
        <tr><td class="rk">2</td><td>Show Me Them TDs <span class="who">formerly Action Jackson</span></td><td class="num">25–14</td><td class="num">.641</td><td class="num">3,962.08</td><td class="num">0</td><td>3rd (2023)</td></tr>
        <tr class="champ"><td class="rk">3</td><td>Prestige Worldwide <span class="who">unchanged since 2023</span></td><td class="num">24–15</td><td class="num">.615</td><td class="num">4,265.20</td><td class="num">1</td><td>Champion (2023)</td></tr>
        <tr><td class="rk">4</td><td>Tua's Neurology Clinic <span class="who">formerly Papa Sharts, Thielen my balls</span></td><td class="num">24–15</td><td class="num">.615</td><td class="num">4,101.04</td><td class="num">0</td><td>6th (2024)</td></tr>
        <tr><td class="rk">5</td><td>Caleb's Ditka In Your Butkus <span class="who">formerly Pound Town, A La Secon-Dez Nuts, Plie on your Face</span></td><td class="num">20–19</td><td class="num">.513</td><td class="num">4,121.14</td><td class="num">0</td><td>3rd (2024)</td></tr>
        <tr><td class="rk">6</td><td>Krasshole <span class="who">unchanged since 2023</span></td><td class="num">20–19</td><td class="num">.513</td><td class="num">4,074.04</td><td class="num">0</td><td>2nd (2024)</td></tr>
        <tr class="champ"><td class="rk">7</td><td>Hot German Mustard <span class="who">unchanged since 2023</span></td><td class="num">19–20</td><td class="num">.487</td><td class="num">3,955.72</td><td class="num">1</td><td>Champion (2025)</td></tr>
        <tr class="champ"><td class="rk">8</td><td>Gibbs Chase N Wins <span class="who">formerly Goffense</span></td><td class="num">19–20</td><td class="num">.487</td><td class="num">4,058.48</td><td class="num">1</td><td>Champion (2024)</td></tr>
        <tr><td class="rk">9</td><td>Kittle My Balls <span class="who">formerly HockenBallz</span></td><td class="num">17–22</td><td class="num">.436</td><td class="num">3,982.84</td><td class="num">0</td><td>2nd (2023)</td></tr>
        <tr><td class="rk">10</td><td>The Minivan <span class="who">formerly 1st place</span></td><td class="num">12–27</td><td class="num">.308</td><td class="num">3,583.34</td><td class="num">0</td><td>5th (2024)</td></tr>
        <tr><td class="rk">11</td><td>TommyWantWingy <span class="who">unchanged since 2023</span></td><td class="num">12–27</td><td class="num">.308</td><td class="num">3,575.58</td><td class="num">0</td><td>11th (2023)</td></tr>
        <tr><td class="rk">12</td><td>T-Rook <span class="who">joined 2024</span></td><td class="num">11–15</td><td class="num">.423</td><td class="num">2,569.84</td><td class="num">0</td><td>3rd (2025)</td></tr>
      </tbody>
    </table>
    </div>
    <p class="note">
      Frank The Tank played the 2023 season only, finishing 4–9, and was replaced in the 2024 field by T-Rook.
    </p>

    <h2 class="sec">The standing indictment</h2>
    <p class="note">
      The two winningest managers in league history have combined for <strong>52 regular-season wins,
      an 11–2 season, a 10–3 season, and zero championships.</strong> Meanwhile the 2024 title went to a
      manager sitting at 19–20 lifetime, and the 2025 title went to one who opened his career 4–9.
      Tua's Neurology Clinic has 24 wins and has never finished in the top three.
    </p>
  </section>

  <!-- ============ CHAMPIONS ============ -->
  <section class="panel" id="p-champs" role="tabpanel" aria-labelledby="t-champs" hidden>
    <h2 class="sec">Champions</h2>
    <div class="banners">
      <div class="banner">
        <div class="yr">2023</div>
        <div class="nm">Prestige Worldwide</div>
        <div class="dt">11–2 · led league in points<br>Def. HockenBallz 115.58–98.40</div>
      </div>
      <div class="banner">
        <div class="yr">2024</div>
        <div class="nm">Gibbs Chase N Wins</div>
        <div class="dt">8–5<br>Def. Krasshole 138.12–109.66</div>
      </div>
      <div class="banner">
        <div class="yr">2025</div>
        <div class="nm">Hot German Mustard</div>
        <div class="dt">8–5<br>Def. Bustin Jefferson 122.10–81.72</div>
      </div>
    </div>

    <h2 class="sec">Runners-up &amp; third place</h2>
    <div class="tablewrap">
    <table>
      <thead><tr><th>Season</th><th>Champion</th><th>Runner-up</th><th>Third</th></tr></thead>
      <tbody>
        <tr><td>2023</td><td>Prestige Worldwide</td><td>HockenBallz</td><td>Action Jackson</td></tr>
        <tr><td>2024</td><td>Gibbs Chase N Wins</td><td>Krasshole</td><td>A La Secon-Dez Nuts</td></tr>
        <tr><td>2025</td><td>Hot German Mustard</td><td>Bustin Jefferson</td><td>T-Rook</td></tr>
      </tbody>
    </table>
    </div>
    <p class="note">
      Three seasons, three different champions. No manager has repeated, and no champion has
      returned to the final the following year.
    </p>
  </section>

  <!-- ============ RECORDS ============ -->
  <section class="panel" id="p-records" role="tabpanel" aria-labelledby="t-records" hidden>
    <h2 class="sec">The book</h2>
    <div class="records">
      <div class="rec"><div class="lbl">Most wins, all-time</div><div class="val">27</div>
        <div class="ctx">Bustin Jefferson, across three franchise names. No titles.</div></div>
      <div class="rec"><div class="lbl">Most points, all-time</div><div class="val">4,282.56</div>
        <div class="ctx">Bustin Jefferson. Also no titles.</div></div>
      <div class="rec"><div class="lbl">Best regular season</div><div class="val">11–2</div>
        <div class="ctx">Prestige Worldwide and Hawk N Balls, both 2023. One won it all. One scored 68.94 and went home.</div></div>
      <div class="rec"><div class="lbl">Most points, one season</div><div class="val">1,547.80</div>
        <div class="ctx">Hawk N Balls, 2023 — the highest-scoring team in league history, eliminated in the first round.</div></div>
      <div class="rec"><div class="lbl">Highest playoff score</div><div class="val">163.64</div>
        <div class="ctx">Gibbs Chase N Wins over Penix Envy, 2024 semifinal.</div></div>
      <div class="rec"><div class="lbl">Largest playoff margin</div><div class="val">99.40</div>
        <div class="ctx">Prestige Worldwide 158.54, Pound Town 59.14 — 2023 semifinal.</div></div>
      <div class="rec bad"><div class="lbl">Closest playoff game</div><div class="val">0.82</div>
        <div class="ctx">T-Rook 114.72, Prestige Worldwide 113.90 — 2025 first round.</div></div>
      <div class="rec bad"><div class="lbl">Lowest playoff score</div><div class="val">59.14</div>
        <div class="ctx">Pound Town, 2023 semifinal.</div></div>
      <div class="rec bad"><div class="lbl">Worst top-seed exit</div><div class="val">68.94</div>
        <div class="ctx">Hawk N Balls, 11–2, first round 2023. Lost by 67, then lost both consolation games.</div></div>
      <div class="rec bad"><div class="lbl">Best record, no trophy</div><div class="val">10–3</div>
        <div class="ctx">Action Jackson, 2024 — finished seventh.</div></div>
      <div class="rec bad"><div class="lbl">Most points in a playoff loss</div><div class="val">129.58</div>
        <div class="ctx">Action Jackson, 2024 first round. Beaten by a 6–7 team that reached the final.</div></div>
      <div class="rec bad"><div class="lbl">Worst season</div><div class="val">2–11</div>
        <div class="ctx">1st place, 2023 — 958.28 points, the fewest ever scored. The team was named "1st place."</div></div>
    </div>

    <h2 class="sec">Streaks &amp; oddities</h2>
    <p class="note">
      <strong>Worst record to reach a final:</strong> Krasshole, 6–7 in 2024.<br>
      <strong>Consecutive last-place finishes:</strong> TommyWantWingy, 2024 and 2025. Has never finished above tenth.<br>
      <strong>Fastest fall from a title:</strong> Gibbs Chase N Wins, champion in 2024, missed the playoffs in 2025.<br>
      <strong>Longest active title drought:</strong> everyone except Hot German Mustard.
    </p>
  </section>

  <!-- ============ ALIASES ============ -->
  <section class="panel" id="p-alias" role="tabpanel" aria-labelledby="t-alias" hidden>
    <h2 class="sec">Known aliases</h2>
    <p class="note">
      Six of twelve managers have operated under more than one name. The record follows the manager,
      not the branding.
    </p>
    <div class="aliases">
      <div class="card">
        <h3>Caleb's Ditka In Your Butkus</h3><div class="own">4 names in 4 seasons</div>
        <ol><li>Pound Town (2023)</li><li>A La Secon-Dez Nuts (2024)</li><li>Plie on your Face (2025)</li><li class="cur">Caleb's Ditka In Your Butkus (2026)</li></ol>
        <span class="flag">Serial rebrander</span>
      </div>
      <div class="card">
        <h3>Bustin Jefferson</h3><div class="own">3 names, 3 collapses</div>
        <ol><li>Hawk N Balls (2023)</li><li>Penix Envy (2024)</li><li class="cur">Bustin Jefferson (2025–)</li></ol>
        <span class="flag">Witness protection</span>
      </div>
      <div class="card">
        <h3>Tua's Neurology Clinic</h3><div class="own">3 names, 0 podiums</div>
        <ol><li>Papa Sharts (2023)</li><li>Thielen my balls (2024)</li><li class="cur">Tua's Neurology Clinic (2025–)</li></ol>
      </div>
      <div class="card">
        <h3>Gibbs Chase N Wins</h3><div class="own">Renamed, then won</div>
        <ol><li>Goffense (2023)</li><li class="cur">Gibbs Chase N Wins (2024–)</li></ol>
      </div>
      <div class="card">
        <h3>Kittle My Balls</h3><div class="own">Tight ends, always</div>
        <ol><li>HockenBallz (2023–24)</li><li class="cur">Kittle My Balls (2025–)</li></ol>
      </div>
      <div class="card">
        <h3>The Minivan</h3><div class="own">Named it "1st place," went 2-11</div>
        <ol><li>1st place (2023)</li><li class="cur">The Minivan (2024–)</li></ol>
      </div>
      <div class="card">
        <h3>Show Me Them TDs</h3><div class="own">Held out three years</div>
        <ol><li>Action Jackson (2023–25)</li><li class="cur">Show Me Them TDs (2026)</li></ol>
      </div>
      <div class="card">
        <h3>Unchanged since inception</h3><div class="own">The stable minority</div>
        <ol><li class="cur">Prestige Worldwide</li><li class="cur">Krasshole</li><li class="cur">Hot German Mustard</li><li class="cur">TommyWantWingy</li><li class="cur">T-Rook</li></ol>
      </div>
    </div>
  </section>

  <!-- ============ 2023 ============ -->
  <section class="panel" id="p-2023" role="tabpanel" aria-labelledby="t-2023" hidden>
    <h2 class="sec">2023 · Season 1 · Champion: Prestige Worldwide</h2>
    <div class="tablewrap">
    <table>
      <thead><tr><th class="rk">#</th><th>Team</th><th class="num">Rec</th><th class="num">PF</th><th class="num">PA</th><th class="num">Diff</th></tr></thead>
      <tbody>
        <tr class="champ"><td class="rk">1</td><td>Prestige Worldwide</td><td class="num">11–2</td><td class="num">1476.54</td><td class="num">1236.50</td><td class="num">+18.5</td></tr>
        <tr><td class="rk">2</td><td>HockenBallz</td><td class="num">5–8</td><td class="num">1302.90</td><td class="num">1314.54</td><td class="num">−0.9</td></tr>
        <tr><td class="rk">3</td><td>Action Jackson</td><td class="num">8–5</td><td class="num">1261.32</td><td class="num">1320.58</td><td class="num">−4.6</td></tr>
        <tr><td class="rk">4</td><td>Pound Town</td><td class="num">7–6</td><td class="num">1360.70</td><td class="num">1238.20</td><td class="num">+9.4</td></tr>
        <tr><td class="rk">5</td><td>Krasshole</td><td class="num">8–5</td><td class="num">1451.98</td><td class="num">1330.54</td><td class="num">+9.3</td></tr>
        <tr><td class="rk">6</td><td>Papa Sharts</td><td class="num">9–4</td><td class="num">1523.80</td><td class="num">1311.10</td><td class="num">+16.4</td></tr>
        <tr><td class="rk">7</td><td>Goffense</td><td class="num">5–8</td><td class="num">1365.38</td><td class="num">1379.58</td><td class="num">−1.1</td></tr>
        <tr><td class="rk">8</td><td>Hawk N Balls</td><td class="num">11–2</td><td class="num">1547.80</td><td class="num">1207.54</td><td class="num">+26.2</td></tr>
        <tr><td class="rk">9</td><td>Hot German Mustard</td><td class="num">4–9</td><td class="num">1223.38</td><td class="num">1274.04</td><td class="num">−3.9</td></tr>
        <tr><td class="rk">10</td><td>1st place</td><td class="num">2–11</td><td class="num">958.28</td><td class="num">1415.74</td><td class="num">−35.2</td></tr>
        <tr><td class="rk">11</td><td>TommyWantWingy</td><td class="num">4–9</td><td class="num">1110.44</td><td class="num">1346.76</td><td class="num">−18.2</td></tr>
        <tr><td class="rk">12</td><td>Frank The Tank</td><td class="num">4–9</td><td class="num">1145.78</td><td class="num">1353.16</td><td class="num">−16.0</td></tr>
      </tbody>
    </table>
    </div>
    <div class="bracket">
      <div class="rd">First round</div>
      <div class="g"><span><span class="w">HockenBallz</span> def. Hawk N Balls</span><span class="s">136.42–68.94</span></div>
      <div class="g"><span><span class="w">Action Jackson</span> def. Krasshole</span><span class="s">120.54–113.82</span></div>
      <div class="g"><span><span class="w">Pound Town</span> def. Papa Sharts</span><span class="s">109.42–87.24</span></div>
      <div class="g"><span><span class="w">Prestige Worldwide</span> def. Goffense</span><span class="s">113.64–99.68</span></div>
      <div class="rd">Semifinals</div>
      <div class="g"><span><span class="w">HockenBallz</span> def. Action Jackson</span><span class="s">106.38–96.76</span></div>
      <div class="g"><span><span class="w">Prestige Worldwide</span> def. Pound Town</span><span class="s">158.54–59.14</span></div>
      <div class="rd">Championship</div>
      <div class="g"><span><span class="w">Prestige Worldwide</span> def. HockenBallz</span><span class="s">115.58–98.40</span></div>
    </div>
  </section>

  <!-- ============ 2024 ============ -->
  <section class="panel" id="p-2024" role="tabpanel" aria-labelledby="t-2024" hidden>
    <h2 class="sec">2024 · Season 2 · Champion: Gibbs Chase N Wins</h2>
    <div class="tablewrap">
    <table>
      <thead><tr><th class="rk">#</th><th>Team</th><th class="num">Rec</th><th class="num">PF</th><th class="num">PA</th><th class="num">Diff</th></tr></thead>
      <tbody>
        <tr class="champ"><td class="rk">1</td><td>Gibbs Chase N Wins</td><td class="num">8–5</td><td class="num">1442.96</td><td class="num">1356.62</td><td class="num">+6.6</td></tr>
        <tr><td class="rk">2</td><td>Krasshole</td><td class="num">6–7</td><td class="num">1359.30</td><td class="num">1332.32</td><td class="num">+2.1</td></tr>
        <tr><td class="rk">3</td><td>A La Secon-Dez Nuts</td><td class="num">7–6</td><td class="num">1419.28</td><td class="num">1411.00</td><td class="num">+0.6</td></tr>
        <tr><td class="rk">4</td><td>Penix Envy</td><td class="num">8–5</td><td class="num">1336.88</td><td class="num">1210.62</td><td class="num">+9.7</td></tr>
        <tr><td class="rk">5</td><td>The Minivan</td><td class="num">6–7</td><td class="num">1359.36</td><td class="num">1395.52</td><td class="num">−2.8</td></tr>
        <tr><td class="rk">6</td><td>Thielen my balls</td><td class="num">8–5</td><td class="num">1297.34</td><td class="num">1274.54</td><td class="num">+1.8</td></tr>
        <tr><td class="rk">7</td><td>Action Jackson</td><td class="num">10–3</td><td class="num">1364.16</td><td class="num">1289.46</td><td class="num">+5.7</td></tr>
        <tr><td class="rk">8</td><td>Hot German Mustard</td><td class="num">7–6</td><td class="num">1339.56</td><td class="num">1305.80</td><td class="num">+2.6</td></tr>
        <tr><td class="rk">9</td><td>Prestige Worldwide</td><td class="num">6–7</td><td class="num">1358.84</td><td class="num">1300.26</td><td class="num">+4.5</td></tr>
        <tr><td class="rk">10</td><td>HockenBallz</td><td class="num">4–9</td><td class="num">1300.00</td><td class="num">1469.78</td><td class="num">−13.1</td></tr>
        <tr><td class="rk">11</td><td>T-Rook</td><td class="num">4–9</td><td class="num">1214.84</td><td class="num">1343.78</td><td class="num">−9.9</td></tr>
        <tr><td class="rk">12</td><td>TommyWantWingy</td><td class="num">4–9</td><td class="num">1253.96</td><td class="num">1372.44</td><td class="num">−9.1</td></tr>
      </tbody>
    </table>
    </div>
    <div class="bracket">
      <div class="rd">First round</div>
      <div class="g"><span><span class="w">Krasshole</span> def. Action Jackson</span><span class="s">143.68–129.58</span></div>
      <div class="g"><span><span class="w">A La Secon-Dez Nuts</span> def. Thielen my balls</span><span class="s">115.12–79.26</span></div>
      <div class="g"><span><span class="w">Penix Envy</span> def. Hot German Mustard</span><span class="s">124.86–103.42</span></div>
      <div class="g"><span><span class="w">Gibbs Chase N Wins</span> def. The Minivan</span><span class="s">137.72–70.94</span></div>
      <div class="rd">Semifinals</div>
      <div class="g"><span><span class="w">Krasshole</span> def. A La Secon-Dez Nuts</span><span class="s">137.58–115.10</span></div>
      <div class="g"><span><span class="w">Gibbs Chase N Wins</span> def. Penix Envy</span><span class="s">163.64–104.26</span></div>
      <div class="rd">Championship</div>
      <div class="g"><span><span class="w">Gibbs Chase N Wins</span> def. Krasshole</span><span class="s">138.12–109.66</span></div>
    </div>
  </section>

  <!-- ============ 2025 ============ -->
  <section class="panel" id="p-2025" role="tabpanel" aria-labelledby="t-2025" hidden>
    <h2 class="sec">2025 · Season 3 · Champion: Hot German Mustard</h2>
    <div class="tablewrap">
    <table>
      <thead><tr><th class="rk">#</th><th>Team</th><th class="num">Rec</th><th class="num">PF</th><th class="num">PA</th><th class="num">Diff</th></tr></thead>
      <tbody>
        <tr class="champ"><td class="rk">1</td><td>Hot German Mustard</td><td class="num">8–5</td><td class="num">1392.78</td><td class="num">1320.36</td><td class="num">+5.6</td></tr>
        <tr><td class="rk">2</td><td>Bustin Jefferson</td><td class="num">8–5</td><td class="num">1397.88</td><td class="num">1318.94</td><td class="num">+6.1</td></tr>
        <tr><td class="rk">3</td><td>T-Rook</td><td class="num">7–6</td><td class="num">1355.00</td><td class="num">1280.40</td><td class="num">+5.7</td></tr>
        <tr><td class="rk">4</td><td>Kittle My Balls</td><td class="num">8–5</td><td class="num">1379.94</td><td class="num">1287.04</td><td class="num">+7.1</td></tr>
        <tr><td class="rk">5</td><td>Action Jackson</td><td class="num">7–6</td><td class="num">1336.60</td><td class="num">1412.32</td><td class="num">−5.8</td></tr>
        <tr><td class="rk">6</td><td>Plie on your Face</td><td class="num">6–7</td><td class="num">1341.16</td><td class="num">1376.06</td><td class="num">−2.7</td></tr>
        <tr><td class="rk">7</td><td>Prestige Worldwide</td><td class="num">7–6</td><td class="num">1429.82</td><td class="num">1251.36</td><td class="num">+13.7</td></tr>
        <tr><td class="rk">8</td><td>Tua's Neurology Clinic</td><td class="num">7–6</td><td class="num">1279.90</td><td class="num">1395.86</td><td class="num">−8.9</td></tr>
        <tr><td class="rk">9</td><td>Krasshole</td><td class="num">6–7</td><td class="num">1262.76</td><td class="num">1268.14</td><td class="num">−0.4</td></tr>
        <tr><td class="rk">10</td><td>Gibbs Chase N Wins</td><td class="num">6–7</td><td class="num">1250.14</td><td class="num">1302.90</td><td class="num">−4.1</td></tr>
        <tr><td class="rk">11</td><td>The Minivan</td><td class="num">4–9</td><td class="num">1265.70</td><td class="num">1303.96</td><td class="num">−2.9</td></tr>
        <tr><td class="rk">12</td><td>TommyWantWingy</td><td class="num">4–9</td><td class="num">1211.18</td><td class="num">1384.82</td><td class="num">−13.4</td></tr>
      </tbody>
    </table>
    </div>
    <div class="bracket">
      <div class="rd">First round</div>
      <div class="g"><span><span class="w">Bustin Jefferson</span> def. Plie on your Face</span><span class="s">130.74–95.86</span></div>
      <div class="g"><span><span class="w">T-Rook</span> def. Prestige Worldwide</span><span class="s">114.72–113.90</span></div>
      <div class="g"><span><span class="w">Kittle My Balls</span> def. Action Jackson</span><span class="s">121.16–69.36</span></div>
      <div class="g"><span><span class="w">Hot German Mustard</span> def. Tua's Neurology Clinic</span><span class="s">89.00–81.58</span></div>
      <div class="rd">Semifinals</div>
      <div class="g"><span><span class="w">Bustin Jefferson</span> def. T-Rook</span><span class="s">150.86–68.40</span></div>
      <div class="g"><span><span class="w">Hot German Mustard</span> def. Kittle My Balls</span><span class="s">78.90–69.60</span></div>
      <div class="rd">Championship</div>
      <div class="g"><span><span class="w">Hot German Mustard</span> def. Bustin Jefferson</span><span class="s">122.10–81.72</span></div>
    </div>
  </section>

  <footer class="colophon">
    <h3>Updating this almanac</h3>
    <ol>
      <li>After the championship, add a season tab: final standings with records, points for, points against, and the full playoff bracket.</li>
      <li>Add the new champion to the Champions banners and the runner-up table.</li>
      <li>Recalculate the Registry: add each manager's W–L and points for to their career totals, and update "best finish" if it improved.</li>
      <li>Check every entry in the Record Book against the new season. Note which records fell — a broken record is the best material the column gets all year.</li>
      <li>Log any name changes under Known Aliases. The alias list is the whole point: nobody outruns their record here.</li>
    </ol>
  </footer>

</div>
`;

export default function OurBossThinksWereWorking() {
  usePageMeta(
    "Our Boss Thinks We're Working",
    "The League Almanac: a permanent record of every fantasy football season played."
  );
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const tabs = Array.from(root.querySelectorAll(".tab"));

    function show(tab) {
      tabs.forEach((t) => {
        const panel = document.getElementById(t.getAttribute("aria-controls"));
        const on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        if (panel) panel.hidden = !on;
      });
    }

    const listeners = tabs.map((t, i) => {
      const onClick = () => show(t);
      const onKeydown = (e) => {
        const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        const next = tabs[(i + d + tabs.length) % tabs.length];
        next.focus();
        show(next);
      };
      t.addEventListener("click", onClick);
      t.addEventListener("keydown", onKeydown);
      return { t, onClick, onKeydown };
    });

    return () => {
      listeners.forEach(({ t, onClick, onKeydown }) => {
        t.removeEventListener("click", onClick);
        t.removeEventListener("keydown", onKeydown);
      });
    };
  }, []);

  return <div id="almanac-root" ref={rootRef} dangerouslySetInnerHTML={{ __html: ALMANAC_HTML }} />;
}

import { useEffect, useId, useMemo, useState } from "react";
import { usePageMeta } from "../hooks/usePageMeta";

// Unlisted page: each host enters their own Daily Picks here with a personal
// PIN, and the pick is published to the site automatically (see
// api/picks/submit.js). Not linked from any nav; noindex.

const HOSTS = ["Dennis", "Shaun", "Aaron"];
const LEAGUES = ["MLB", "NFL", "NHL", "NBA", "NCAAF", "Other"];
const BET_TYPES = [
  { id: "ml", label: "Moneyline" },
  { id: "spread", label: "Spread" },
  { id: "total", label: "Total" },
  { id: "other", label: "Other" },
];
const STORE_KEY = "rdn-pick-login";

function readStored() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) ?? {};
  } catch {
    return {};
  }
}

function writeStored(value) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(value));
  } catch {
    // private window or blocked storage: the form still works, just asks again next time
  }
}

async function post(body) {
  const res = await fetch("/api/picks/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error ?? "Something went wrong. Please try again.");
  return json;
}

function signed(value) {
  const n = Number(value);
  return n > 0 ? `+${n}` : String(n);
}

const inputClass =
  "mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 shadow-sm focus:border-orange-500 focus:outline-none";
const labelClass = "block text-sm font-semibold text-neutral-900";

export default function SubmitPicks() {
  usePageMeta("Submit Picks", null, { noindex: true });

  const [host, setHost] = useState("");
  const [pin, setPin] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [state, setState] = useState(null); // { day, picks }
  const [loginError, setLoginError] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn(nextHost, nextPin) {
    setBusy(true);
    setLoginError("");
    try {
      const data = await post({ action: "list", host: nextHost, pin: nextPin });
      setState(data);
      setHost(nextHost);
      setPin(nextPin);
      setSignedIn(true);
      writeStored({ host: nextHost, pin: nextPin });
    } catch (err) {
      setLoginError(err.message);
      setSignedIn(false);
    } finally {
      setBusy(false);
    }
  }

  // Remembered on this device so it's one tap next time.
  useEffect(() => {
    const saved = readStored();
    if (saved.host && saved.pin) signIn(saved.host, saved.pin);
    else if (saved.host) setHost(saved.host);
  }, []);

  function signOut() {
    writeStored({ host });
    setSignedIn(false);
    setPin("");
    setState(null);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-black text-neutral-900 sm:text-4xl">Submit Your Picks</h1>
      <p className="mt-3 text-neutral-600">
        Add your Daily Picks here and they go straight to the Dancing With the Odds page. No need to
        send them to anyone.
      </p>

      {!signedIn ? (
        <LoginCard
          host={host}
          pin={pin}
          setHost={setHost}
          setPin={setPin}
          onSubmit={() => signIn(host, pin)}
          busy={busy}
          error={loginError}
        />
      ) : (
        <>
          <div className="mt-6 flex items-center justify-between rounded-lg bg-neutral-900 px-4 py-3 text-white">
            <span className="font-semibold">Signed in as {host}</span>
            <button type="button" onClick={signOut} className="text-sm underline underline-offset-2">
              Not you?
            </button>
          </div>
          <PickForm host={host} pin={pin} setState={setState} />
          <TodayList host={host} pin={pin} state={state} setState={setState} />
        </>
      )}
    </div>
  );
}

function LoginCard({ host, pin, setHost, setPin, onSubmit, busy, error }) {
  const hostId = useId();
  const pinId = useId();
  return (
    <form
      className="mt-8 space-y-5 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        if (host && pin) onSubmit();
      }}
    >
      <div>
        <label htmlFor={hostId} className={labelClass}>
          Who are you?
        </label>
        <select id={hostId} value={host} onChange={(e) => setHost(e.target.value)} className={inputClass}>
          <option value="">Choose…</option>
          {HOSTS.map((h) => (
            <option key={h}>{h}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor={pinId} className={labelClass}>
          Your PIN
        </label>
        <input
          id={pinId}
          type="password"
          inputMode="numeric"
          autoComplete="current-password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className={inputClass}
        />
      </div>
      {error && (
        <p role="alert" className="text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy || !host || !pin}
        className="w-full rounded-lg bg-orange-500 px-4 py-3 font-bold text-white hover:bg-orange-600 disabled:opacity-50"
      >
        {busy ? "Checking…" : "Continue"}
      </button>
    </form>
  );
}

function PickForm({ host, pin, setState }) {
  const ids = { league: useId(), game: useId(), typed: useId(), line: useId(), odds: useId(), note: useId(), sel: useId() };

  const [league, setLeague] = useState("MLB");
  const [games, setGames] = useState([]);
  const [gamesState, setGamesState] = useState("loading"); // loading | ready | error
  const [filter, setFilter] = useState("");
  const [gameId, setGameId] = useState("");
  const [typedGame, setTypedGame] = useState("");
  const [betType, setBetType] = useState("ml");
  const [side, setSide] = useState(""); // "away" | "home"
  const [overUnder, setOverUnder] = useState("OVER");
  const [line, setLine] = useState("");
  const [otherText, setOtherText] = useState("");
  const [odds, setOdds] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [busy, setBusy] = useState(false);

  const typing = league === "Other" || gameId === "__typed";
  const game = typing ? null : games.find((g) => g.id === gameId);

  useEffect(() => {
    setGameId("");
    setSide("");
    if (league === "Other") {
      setGames([]);
      setGamesState("ready");
      return;
    }
    let cancelled = false;
    setGamesState("loading");
    fetch(`/api/picks/games?league=${league}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (cancelled) return;
        setGames(data.games);
        setGamesState("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setGames([]);
        setGamesState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [league]);

  const shown = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return q ? games.filter((g) => g.label.toLowerCase().includes(q)) : games;
  }, [games, filter]);

  function timeLabel(g) {
    const t = new Date(g.startsAt).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/New_York",
    });
    return `${t} ET`;
  }

  // DraftKings numbers from ESPN for the chosen game and bet, used to prefill
  // the line and odds. Hosts can overwrite either one.
  const suggest = (() => {
    const o = game?.odds;
    if (!o) return null;
    if (betType === "ml" && side) return o.ml[side] ? { odds: o.ml[side] } : null;
    if (betType === "spread" && side) return o.spread[side] ? { line: o.spread[side].line, odds: o.spread[side].odds } : null;
    if (betType === "total") {
      const t = o.total[overUnder.toLowerCase()];
      return t ? { line: t.line, odds: t.odds } : null;
    }
    return null;
  })();

  useEffect(() => {
    if (!suggest) return;
    if (suggest.line !== undefined) setLine(String(suggest.line));
    setOdds(suggest.odds ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, betType, side, overUnder, games]);

  // The pick text exactly as it will appear on the site.
  const selection = (() => {
    if (betType === "total") return line !== "" && !Number.isNaN(Number(line)) ? `${overUnder} ${Number(line)}` : "";
    if (betType === "other") return otherText.trim();
    const team = side && game ? game[side] : typing ? otherText.trim() : "";
    if (betType === "ml") return team ? `${team} ML` : "";
    return team && line !== "" && !Number.isNaN(Number(line)) ? `${team} ${signed(line)}` : "";
  })();

  const gameText = typing ? typedGame.trim() : game?.label ?? "";

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSaved("");
    if (!gameText) return setError("Choose a game.");
    if (!selection) return setError("Finish filling in your pick.");
    setBusy(true);
    try {
      const data = await post({
        action: "add",
        host,
        pin,
        pick: { league, game: gameText, selection, odds: odds.trim(), note: note.trim() },
      });
      setState({ day: data.day, picks: data.picks });
      setSaved(`${gameText}: ${selection}`);
      setGameId("");
      setTypedGame("");
      setSide("");
      setLine("");
      setOtherText("");
      setOdds("");
      setNote("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-5 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black text-neutral-900">Add a pick</h2>

      <div>
        <label htmlFor={ids.league} className={labelClass}>
          League
        </label>
        <select id={ids.league} value={league} onChange={(e) => setLeague(e.target.value)} className={inputClass}>
          {LEAGUES.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </div>

      {league !== "Other" && (
        <div>
          <label htmlFor={ids.game} className={labelClass}>
            Game
          </label>
          {games.length > 12 && (
            <input
              type="search"
              placeholder="Search teams…"
              aria-label="Search games"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={inputClass}
            />
          )}
          <select id={ids.game} value={gameId} onChange={(e) => { setGameId(e.target.value); setSide(""); }} className={inputClass}>
            <option value="">
              {gamesState === "loading" ? "Loading today's games…" : shown.length ? "Choose a game…" : "No games found for today"}
            </option>
            {shown.map((g) => (
              <option key={g.id} value={g.id} disabled={g.started}>
                {g.label} ({g.started ? "started" : timeLabel(g)})
              </option>
            ))}
            <option value="__typed">Game isn't listed, I'll type it</option>
          </select>
          {gamesState === "error" && (
            <p className="mt-1 text-sm text-neutral-600">Couldn't load the game list. Choose "I'll type it".</p>
          )}
        </div>
      )}

      {typing && (
        <div>
          <label htmlFor={ids.typed} className={labelClass}>
            Game {league !== "Other" && <span className="font-normal text-neutral-500">(Away @ Home)</span>}
          </label>
          <input
            id={ids.typed}
            value={typedGame}
            onChange={(e) => setTypedGame(e.target.value)}
            placeholder={league === "Other" ? "e.g. UFC 320: Smith vs Jones" : "Away @ Home"}
            className={inputClass}
          />
        </div>
      )}

      <fieldset>
        <legend className={labelClass}>Bet type</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {BET_TYPES.map((t) => (
            <label
              key={t.id}
              className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm font-semibold ${betType === t.id ? "border-orange-500 bg-orange-500 text-white" : "border-neutral-300 bg-white text-neutral-800"}`}
            >
              <input type="radio" name="betType" className="sr-only" checked={betType === t.id} onChange={() => setBetType(t.id)} />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      {(betType === "ml" || betType === "spread") && game && (
        <fieldset>
          <legend className={labelClass}>Which team?</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {["away", "home"].map((s) => (
              <label
                key={s}
                className={`cursor-pointer rounded-lg border px-3 py-2 text-center font-semibold ${side === s ? "border-orange-500 bg-orange-50 text-neutral-900" : "border-neutral-300 bg-white text-neutral-800"}`}
              >
                <input type="radio" name="side" className="sr-only" checked={side === s} onChange={() => setSide(s)} />
                {game[s]} <span className="text-xs font-normal text-neutral-500">({s})</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {(betType === "ml" || betType === "spread") && typing && (
        <div>
          <label htmlFor={ids.sel} className={labelClass}>
            Team
          </label>
          <input id={ids.sel} value={otherText} onChange={(e) => setOtherText(e.target.value)} placeholder="e.g. Brewers" className={inputClass} />
        </div>
      )}

      {betType === "total" && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className={labelClass}>Over or under</span>
            <div className="mt-1 grid grid-cols-2 gap-2">
              {["OVER", "UNDER"].map((o) => (
                <label
                  key={o}
                  className={`cursor-pointer rounded-lg border px-3 py-2 text-center text-sm font-bold ${overUnder === o ? "border-orange-500 bg-orange-50" : "border-neutral-300 bg-white"}`}
                >
                  <input type="radio" name="ou" className="sr-only" checked={overUnder === o} onChange={() => setOverUnder(o)} />
                  {o}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor={ids.line} className={labelClass}>
              Total
            </label>
            <input id={ids.line} inputMode="decimal" value={line} onChange={(e) => setLine(e.target.value)} placeholder="e.g. 5.5" className={inputClass} />
          </div>
        </div>
      )}

      {betType === "spread" && (
        <div>
          <label htmlFor={ids.line} className={labelClass}>
            Spread <span className="font-normal text-neutral-500">(use - for favorite, + for underdog)</span>
          </label>
          <input id={ids.line} inputMode="decimal" value={line} onChange={(e) => setLine(e.target.value)} placeholder="e.g. -1.5 or +3" className={inputClass} />
        </div>
      )}

      {betType === "other" && (
        <div>
          <label htmlFor={ids.sel} className={labelClass}>
            Your pick <span className="font-normal text-neutral-500">(props, first inning, etc.)</span>
          </label>
          <input id={ids.sel} value={otherText} onChange={(e) => setOtherText(e.target.value)} placeholder="e.g. Ohtani over 1.5 total bases" className={inputClass} />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={ids.odds} className={labelClass}>
            Odds <span className="font-normal text-neutral-500">(optional)</span>
          </label>
          <input id={ids.odds} value={odds} onChange={(e) => setOdds(e.target.value)} placeholder="-110" className={inputClass} />
          {suggest?.odds && odds === suggest.odds && (
            <p className="mt-1 text-xs text-neutral-500">DraftKings line. Change it if yours differs.</p>
          )}
        </div>
        <div>
          <label htmlFor={ids.note} className={labelClass}>
            Note <span className="font-normal text-neutral-500">(optional)</span>
          </label>
          <input id={ids.note} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Preseason" maxLength={100} className={inputClass} />
        </div>
      </div>

      <div className="rounded-lg bg-neutral-100 px-4 py-3 text-sm">
        <span className="font-semibold text-neutral-700">Will show as: </span>
        {gameText && selection ? (
          <span className="text-neutral-900">
            {gameText} · <strong>{selection}</strong>
            {odds.trim() && ` (${odds.trim()})`}
          </span>
        ) : (
          <span className="text-neutral-500">Fill in the pick above</span>
        )}
      </div>

      {error && (
        <p role="alert" className="text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
      {saved && (
        <p role="status" className="text-sm font-semibold text-green-700">
          Added: {saved}. It will show on the site in about a minute.
        </p>
      )}

      <button type="submit" disabled={busy} className="w-full rounded-lg bg-orange-500 px-4 py-3 font-bold text-white hover:bg-orange-600 disabled:opacity-50">
        {busy ? "Publishing…" : "Publish pick"}
      </button>
    </form>
  );
}

function TodayList({ host, pin, state, setState }) {
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState("");
  if (!state) return null;

  async function remove(p) {
    setError("");
    setRemoving(`${p.game}|${p.selection}`);
    try {
      const data = await post({ action: "remove", host, pin, index: p.index, game: p.game, selection: p.selection });
      setState({ day: data.day, picks: data.picks });
    } catch (err) {
      setError(err.message);
    } finally {
      setRemoving("");
    }
  }

  return (
    <section className="mt-8">
      <h2 className="text-xl font-black text-neutral-900">Today's picks</h2>
      <div className="mt-3 space-y-4">
        {HOSTS.map((h) => (
          <div key={h} className="rounded-xl border border-neutral-200 bg-white p-4">
            <p className="font-bold text-neutral-900">{h}</p>
            {state.picks[h].length === 0 ? (
              <p className="mt-1 text-sm text-neutral-500">No picks yet</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {state.picks[h].map((p) => (
                  <li key={`${p.game}|${p.selection}`} className="flex items-start justify-between gap-3 text-sm">
                    <span>
                      <span className="font-semibold text-neutral-500">{p.league}</span> {p.game}
                      <br />
                      <strong>{p.selection}</strong>
                      {p.odds && ` (${p.odds})`}
                      {p.note && <span className="text-neutral-500">, {p.note}</span>}
                    </span>
                    {h === host && !p.result && (
                      <button
                        type="button"
                        onClick={() => remove(p)}
                        disabled={removing === `${p.game}|${p.selection}`}
                        className="shrink-0 rounded border border-neutral-300 px-2 py-1 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
    </section>
  );
}

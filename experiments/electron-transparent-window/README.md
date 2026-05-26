# Electron Transparent Window Spike

This experiment is a disposable Kamay Buddy runtime spike. It checks whether an Electron surface can consume the local metrics service contract and request a transparent, always-on-top window without changing the telemetry/service backbone.

It is not product UI, not a HUD commitment, not packaging work, and not a pet/avatar runtime.

## Run

Start the root service first:

```powershell
pnpm service -- --port 8765 --interval-ms 1000
```

Then run the experiment package:

```powershell
pnpm --dir experiments/electron-transparent-window install
pnpm --dir experiments/electron-transparent-window start
```

For a short launch smoke check:

```powershell
pnpm --dir experiments/electron-transparent-window smoke
```

For lifecycle behavior checks:

```powershell
pnpm --dir experiments/electron-transparent-window lifecycle
```

## Boundaries

- Reads only `http://127.0.0.1:8765/metrics/current`.
- Uses a narrow main-process fetch plus preload IPC bridge so the file-loaded renderer does not need direct network access.
- Checks `contractVersion: "metrics.current.v1"`.
- Does not read Codex/provider files.
- Does not add persistence, WebSockets, provider APIs, tray, settings, animation, pet logic, deployment, or Kamay imports.
- Keeps Electron dependency and generated install state inside this experiment directory.

## Feasibility Questions

- Can a transparent window be observed in the local Windows desktop session?
- Does `alwaysOnTop` stay active enough for a future companion surface?
- Is a 2000ms render cadence readable for lightweight local status?
- Does the service contract provide enough state for a minimal companion diagnostic surface?
- Can runtime startup, reconnect, offline/stale transitions, and multi-consumer polling stay service-boundary-only?

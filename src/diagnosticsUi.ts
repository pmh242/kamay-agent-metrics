export const DIAGNOSTICS_UI_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Kamay Agent Metrics Diagnostics</title>
  <style>
    :root {
      color-scheme: light dark;
      --bg: #f7f8f3;
      --panel: #ffffff;
      --text: #1f2520;
      --muted: #5f6b62;
      --line: #d7ddd5;
      --ok: #1f7a4d;
      --warn: #a15c00;
      --bad: #a83232;
      --accent: #1d5f85;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #141713;
        --panel: #1d211c;
        --text: #eef2eb;
        --muted: #abb5a9;
        --line: #384037;
        --ok: #71d19b;
        --warn: #f0b35a;
        --bad: #f08383;
        --accent: #8fc4e6;
      }
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font: 14px/1.45 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    main {
      width: min(1120px, calc(100vw - 32px));
      margin: 24px auto;
    }

    header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 18px;
    }

    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }

    h2 {
      margin: 0 0 12px;
      font-size: 15px;
      font-weight: 700;
    }

    .muted { color: var(--muted); }

    .grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 12px;
    }

    .panel {
      grid-column: span 4;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 14px;
      min-height: 136px;
    }

    .wide { grid-column: span 8; }
    .full { grid-column: 1 / -1; }

    dl {
      display: grid;
      grid-template-columns: minmax(120px, 42%) 1fr;
      gap: 7px 12px;
      margin: 0;
    }

    dt { color: var(--muted); }
    dd {
      margin: 0;
      min-width: 0;
      overflow-wrap: anywhere;
    }

    .status {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-weight: 700;
    }

    .dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: var(--muted);
    }

    .status.ok .dot { background: var(--ok); }
    .status.degraded .dot { background: var(--warn); }
    .status.offline .dot,
    .status.error .dot { background: var(--bad); }

    .status.ok { color: var(--ok); }
    .status.degraded { color: var(--warn); }
    .status.offline,
    .status.error { color: var(--bad); }

    ul {
      margin: 0;
      padding-left: 18px;
    }

    code {
      color: var(--accent);
      overflow-wrap: anywhere;
    }

    @media (max-width: 820px) {
      main { width: min(100vw - 20px, 680px); }
      header { display: block; }
      .panel, .wide { grid-column: 1 / -1; }
      dl { grid-template-columns: 1fr; }
      dt { margin-top: 7px; }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <div>
        <h1>Kamay Agent Metrics Diagnostics</h1>
        <div class="muted">Disposable browser diagnostics for the local service contract</div>
      </div>
      <div class="muted">Polling <code>/metrics/current</code> every 2000ms</div>
    </header>

    <section id="app" class="grid" aria-live="polite">
      <article class="panel full">
        <h2>Loading</h2>
        <p class="muted">Waiting for the first service response.</p>
      </article>
    </section>
  </main>

  <script>
    const EXPECTED_CONTRACT_VERSION = "metrics.current.v1";
    const POLL_INTERVAL_MS = 2000;
    const app = document.getElementById("app");

    function escapeHtml(value) {
      return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
    }

    function status(value) {
      const normalized = value || "unknown";
      const className = ["ok", "degraded", "offline"].includes(normalized) ? normalized : "error";
      return '<span class="status ' + className + '"><span class="dot"></span>' + escapeHtml(normalized) + '</span>';
    }

    function valueOrUnknown(value) {
      return value === undefined || value === null || value === "" ? "unknown" : value;
    }

    function countSources(snapshot) {
      const counts = { discovered: 0, problem: 0 };
      for (const source of snapshot.sources || []) {
        if (source.status === "discovered") {
          counts.discovered += 1;
        } else {
          counts.problem += 1;
        }
      }
      return counts;
    }

    function renderList(items) {
      if (!items || items.length === 0) {
        return '<span class="muted">none</span>';
      }
      return '<ul>' + items.map((item) => '<li>' + escapeHtml(item) + '</li>').join("") + '</ul>';
    }

    function metricPanel(snapshot) {
      const metrics = snapshot.metrics || {};
      const sourceCounts = countSources(snapshot);
      return '<article class="panel">' +
        '<h2>Counters</h2>' +
        '<dl>' +
        '<dt>Sources</dt><dd>' + sourceCounts.discovered + ' discovered, ' + sourceCounts.problem + ' problem</dd>' +
        '<dt>Session rows</dt><dd>' + escapeHtml(valueOrUnknown(metrics.sessionIndexRows)) + '</dd>' +
        '<dt>Session files</dt><dd>' + escapeHtml(valueOrUnknown(metrics.sessionJsonlFiles)) + '</dd>' +
        '<dt>Session events</dt><dd>' + escapeHtml(valueOrUnknown(metrics.sessionJsonlEvents)) + '</dd>' +
        '<dt>Malformed lines</dt><dd>' + escapeHtml(valueOrUnknown(metrics.malformedJsonlLines)) + '</dd>' +
        '</dl>' +
      '</article>';
    }

    function renderMetrics(data, receivedAt) {
      if (data.contractVersion !== EXPECTED_CONTRACT_VERSION) {
        renderError('Unsupported contract version: ' + valueOrUnknown(data.contractVersion), receivedAt);
        return;
      }

      const service = data.service;
      const health = data.sourceHealth;
      const snapshot = data.snapshot;
      const activeThread = snapshot && snapshot.activeThread;

      app.innerHTML =
        '<article class="panel">' +
          '<h2>Service</h2>' +
          '<dl>' +
            '<dt>Status</dt><dd>' + status(service.status) + '</dd>' +
            '<dt>Contract</dt><dd><code>' + escapeHtml(data.contractVersion) + '</code></dd>' +
            '<dt>Last update</dt><dd>' + escapeHtml(valueOrUnknown(service.lastUpdatedAt)) + '</dd>' +
            '<dt>Last error</dt><dd>' + escapeHtml(valueOrUnknown(service.lastError)) + '</dd>' +
            '<dt>Received</dt><dd>' + escapeHtml(receivedAt) + '</dd>' +
          '</dl>' +
        '</article>' +
        '<article class="panel">' +
          '<h2>Source Health</h2>' +
          '<dl>' +
            '<dt>Status</dt><dd>' + status(health.status) + '</dd>' +
            '<dt>Warnings</dt><dd>' + escapeHtml((health.warnings || []).length) + '</dd>' +
          '</dl>' +
        '</article>' +
        '<article class="panel">' +
          '<h2>Snapshot</h2>' +
          '<dl>' +
            '<dt>Observed</dt><dd>' + escapeHtml(snapshot ? valueOrUnknown(snapshot.observedAt) : 'unavailable') + '</dd>' +
            '<dt>Freshness</dt><dd>' + escapeHtml(activeThread ? valueOrUnknown(activeThread.staleness) : 'unknown') + '</dd>' +
            '<dt>Provider</dt><dd>' + escapeHtml(activeThread ? valueOrUnknown(activeThread.modelProvider) : 'unknown') + '</dd>' +
            '<dt>Model</dt><dd>' + escapeHtml(activeThread ? valueOrUnknown(activeThread.model) : 'unknown') + '</dd>' +
          '</dl>' +
        '</article>' +
        '<article class="panel wide">' +
          '<h2>Active Thread</h2>' +
          '<dl>' +
            '<dt>ID</dt><dd>' + escapeHtml(activeThread ? valueOrUnknown(activeThread.id) : 'none') + '</dd>' +
            '<dt>Source</dt><dd>' + escapeHtml(activeThread ? valueOrUnknown(activeThread.resolvedFrom) : 'unknown') + '</dd>' +
            '<dt>CWD</dt><dd>' + escapeHtml(activeThread ? valueOrUnknown(activeThread.cwd) : 'unknown') + '</dd>' +
          '</dl>' +
        '</article>' +
        (snapshot ? metricPanel(snapshot) : '<article class="panel"><h2>Counters</h2><p class="muted">No snapshot available.</p></article>') +
        '<article class="panel full">' +
          '<h2>Warnings</h2>' +
          renderList([...(health.warnings || []), ...((snapshot && snapshot.warnings) || [])]) +
        '</article>';
    }

    function renderError(message, receivedAt) {
      app.innerHTML =
        '<article class="panel full">' +
          '<h2>Service Unreachable</h2>' +
          '<dl>' +
            '<dt>Status</dt><dd>' + status('offline') + '</dd>' +
            '<dt>Error</dt><dd>' + escapeHtml(message) + '</dd>' +
            '<dt>Received</dt><dd>' + escapeHtml(receivedAt) + '</dd>' +
          '</dl>' +
        '</article>';
    }

    async function refresh() {
      const receivedAt = new Date().toISOString();
      try {
        const response = await fetch('/metrics/current', { cache: 'no-store' });
        if (!response.ok) {
          renderError('HTTP ' + response.status, receivedAt);
          return;
        }
        const data = await response.json();
        if (!data || typeof data !== 'object') {
          renderError('Malformed metrics response', receivedAt);
          return;
        }
        renderMetrics(data, receivedAt);
      } catch (error) {
        renderError(error instanceof Error ? error.message : String(error), receivedAt);
      }
    }

    refresh();
    setInterval(refresh, POLL_INTERVAL_MS);
  </script>
</body>
</html>`;

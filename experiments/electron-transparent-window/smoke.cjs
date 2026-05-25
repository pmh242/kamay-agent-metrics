const { spawn } = require("node:child_process");
const electronPath = require("electron");

const child = spawn(electronPath, ["."], {
  cwd: __dirname,
  env: {
    ...process.env,
    KAMAY_SPIKE_SMOKE: "1"
  },
  stdio: "inherit"
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});

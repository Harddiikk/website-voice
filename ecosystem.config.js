// pm2 process definition for the AURELIA Next.js standalone server.
// Secrets live in /var/www/aurelia/.env (chmod 600) — never in this file.
// Adjust `cwd` to wherever you deploy.
module.exports = {
  apps: [
    {
      name: "aurelia",
      script: ".next/standalone/server.js",
      cwd: "/var/www/aurelia",
      // Node >=20.6 loads the env file itself, keeping GEMINI_API_KEY out of pm2's dump.
      node_args: "--env-file=/var/www/aurelia/.env",
      instances: 1, // single instance => local ISR/disk cache stays coherent
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
        HOSTNAME: "127.0.0.1",
      },
      kill_timeout: 30000, // graceful drain
    },
  ],
};

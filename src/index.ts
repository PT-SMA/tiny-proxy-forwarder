import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config({ path: [".env", ".env.local"], debug: true });

const CONFIG_PATH = path.resolve("./proxy.config.json");
const proxyRules = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));

const app = express();
const PORT = process.env.PORT || 9876;

function interpolateEnv(str: string): string {
  return str.replace(/\$\{([^}]+)\}/g, (_, key) => process.env[key] || "");
}

proxyRules.forEach((rule: any) => {
  const { source, target, rewrite } = rule;
  app.use(source, (req: Request, res: Response, next: NextFunction) => {
    try {
      const { env } = req.params;

      if (!target[env]) {
        res.status(400).json({ error: `Invalid environment: ${env}` });
        return;
      }

      const resolvedTarget = interpolateEnv(target[env]);

      const proxy = createProxyMiddleware({
        target: resolvedTarget,
        changeOrigin: true,
        pathRewrite: (path) => path.replace(new RegExp(rewrite), ""),
      });

      proxy(req, res, next);
    } catch (err) {
      next(err);
    }
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "Proxy Service UP",
    rules: proxyRules,
  });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Proxy Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server running on port ${PORT}`);
  console.log("Loaded routes:");
  proxyRules.forEach((r: any) => console.log(`- ${r.source}`));
});

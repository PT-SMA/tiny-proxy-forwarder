import fs from "node:fs";
import path from "node:path";
import { Express, Request, Response, NextFunction } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

import { DEFAULT_SETTINGS } from "../constants";
import { ProxyRuleType, rulesSchema } from "./rules.schema";

const CONFIG_PATH = path.resolve(process.cwd(), "proxy.config.json");

function interpolateEnv(str: string): string {
  return str.replace(/\$\{([^}]+)\}/g, (_, key) => process.env[key] || "");
}

export const proxyRules: ProxyRuleType[] = rulesSchema.parse(
  (JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8")) as ProxyRuleType[]).map(
    (rule) => ({
      ...rule,
      settings: {
        ...DEFAULT_SETTINGS,
        ...rule.settings,
      },
    }),
  ),
);

export const proxyRulesController = (app: Express) => {
  proxyRules.forEach((rule) => {
    const { source, target, rewrite, settings } = rule;

    app.use(source, (req: Request, res: Response, next: NextFunction) => {
      try {
        const { env } = req.params as { env?: string };

        if (!env || !target[env]) {
          return res.status(400).json({ error: `Invalid environment: ${env}` });
        }

        const resolvedTarget = interpolateEnv(target[env]);

        console.log(
          new Date().toISOString(),
          `[Resolved Target]\n- original: ${target[env]}\n- resolved: ${resolvedTarget}`,
        );

        const proxy = createProxyMiddleware({
          target: resolvedTarget,
          changeOrigin: true,
          pathRewrite: rewrite
            ? (pathname) => pathname.replace(new RegExp(rewrite), "")
            : undefined,
          proxyTimeout: settings.proxyTimeout,
          timeout: settings.timeout,
          logger: console,
        });

        return proxy(req, res, next);
      } catch (err) {
        next(err);
      }
    });
  });
};

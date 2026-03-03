import { z } from "zod";

export const ruleSchema = z.object({
  source: z.string(),
  target: z.record(z.string(), z.string()),
  rewrite: z.string(),
  settings: z.object({
    proxyTimeout: z.number(),
    timeout: z.number(),
  }),
});

export const rulesSchema = z.array(ruleSchema);

export type ProxyRuleSettingType = ProxyRuleType["settings"];

export type ProxyRuleType = z.infer<typeof ruleSchema>;

import { readFileSync } from "node:fs";
import { PackageJsonType } from "./types";
import { ProxyRuleSettingType } from "./middleware/rules.schema";

export const DEFAULT_SETTINGS: ProxyRuleSettingType = {
  proxyTimeout: 2 * 60 * 1000,
  timeout: 2 * 60 * 1000,
};

export const PACKAGE_JSON = JSON.parse(
  readFileSync("package.json", "utf8"),
) as PackageJsonType;

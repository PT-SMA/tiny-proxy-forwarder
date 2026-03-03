import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import { proxyRules, proxyRulesController } from "./middleware/rules";

dotenv.config({ path: [".env", ".env.local"], debug: true, override: true });

const app = express();

const PORT = process.env.PORT || 9876;

proxyRulesController(app);

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

import { z } from "zod";

import { readFileSync } from "node:fs";

const configSchema = z.object({
  version: z.string(),
  versionName: z.string(),
});

const json = readFileSync("./package.json", "utf8");

const packageJson = configSchema.parse(JSON.parse(json));

export default packageJson;

import { z, ZodError } from "zod";
import { readFileSync } from "node:fs";
import { Client, DiscordjsError, WebhookClient } from "discord.js";
import {
  InvalidConfigValueError,
  InvalidTokenError,
  InvalidWebhookUrlError,
  SomethingFuckedUpError,
} from "./errors";

const configSchema = z.object({
  token: z.string(),
  clientId: z.string(),
  guildId: z.string(),
  ticketChannelWebhook: z.string(),
  allRoleIds: z.array(z.string()),
  applicationRequestsId: z.string(),
  maxRolesSelectable: z.number(),
  roleSelectionOptions: z.array(
    z.object({
      label: z.string(),
      description: z.string(),
      value: z.string(),
    })
  ),
  generalFooter: z.string(),
  ageDisplayChannelId: z.string(),
  peopleDisplayChannelId: z.string(),
  verifiedRoleId: z.string(),
  countingChannelId: z.string(),
  ticketChannelId: z.string(),
  welcomeChannelId: z.string(),
  verificationChannelId: z.string(),
  modId: z.string(),
  adminId: z.string(),
});

const json = readFileSync("./config.json", "utf8");

// Catch all possible parsing erros
try {
  configSchema.parse(JSON.parse(json));
} catch (error) {
  if (error instanceof ZodError) {
    throw new InvalidConfigValueError(
      error.issues[0] === undefined
        ? ""
        : error.issues[0].path[0] === undefined
        ? ""
        : error.issues[0].path[0].toString(),
      error.issues[0] === undefined ? "" : error.issues[0].message.toString()
    );
  }
}
// Parse
const config = configSchema.parse(JSON.parse(json));

function testId(id: string, idName: string) {
  if (!/^\d+$/.test(id)) {
    throw new InvalidConfigValueError(idName, "Value must be numerical", id);
  }
  if (!(id.length >= 17 && id.length <= 19)) {
    throw new InvalidConfigValueError(
      idName,
      "Value must be between 17 and 19 characters long",
      id.length.toString()
    );
  }
}

// Token test
const client = new Client({ intents: [] });
try {
  async () => {
    await client.login(config.token);
  };
} catch (error) {
  throw error instanceof DiscordjsError
    ? new InvalidTokenError()
    : new SomethingFuckedUpError(
        `something at discord. Unable to login with provided client.`
      );
}

// IDs tests
testId(config.clientId, "clientId");
testId(config.guildId, "guildId");
testId(config.applicationRequestsId, "applicationRequestsId");
testId(config.ageDisplayChannelId, "ageDisplayChannelId");
testId(config.peopleDisplayChannelId, "peopleDisplayChannelId");
testId(config.verifiedRoleId, "verifiedRoleId");
testId(config.countingChannelId, "countingChannelId");
testId(config.ticketChannelId, "ticketChannelId");
testId(config.welcomeChannelId, "welcomeChannelId");
testId(config.verificationChannelId, "verificationChannelId");
testId(config.modId, "modId");
testId(config.adminId, "adminId");

// roleSelectionOptions test
for (const element of config.roleSelectionOptions) {
  if (element.value === "1") continue;
  testId(element.value, `roleSelectionOptions:${element.label}`);
}

// WebHook test
try {
  void new WebhookClient({ url: config.ticketChannelWebhook });
} catch (error) {
  if (error instanceof DiscordjsError) {
    throw new InvalidWebhookUrlError();
  }
}

export default config;

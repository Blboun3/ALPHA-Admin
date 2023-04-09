import { Client, Events } from "discord.js";
import ready from "./ready";
import interactionCreate from "./interaction-create";
import messageCreate from "./message-create";
import { AlphaError } from "../utils/errors";
import logger from "../utils/logger";

function eventErrorWrapper<T>(func: (arg: T) => Promise<void> | void) {
  return async (arg: T) => {
    try {
      await func(arg);
    } catch (error) {
      if (error instanceof AlphaError) {
        const child = logger.child({ error: error });
        child.error("An error occured in event.");
      }
    }
  };
}

export default function bindEvents(client: Client) {
  client.once(Events.ClientReady, eventErrorWrapper(ready));
  client.on(Events.InteractionCreate, eventErrorWrapper(interactionCreate));
  client.on(Events.MessageCreate, eventErrorWrapper(messageCreate));
}

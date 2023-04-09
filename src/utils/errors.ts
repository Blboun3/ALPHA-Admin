export class AlphaError extends Error {
  constructor(txt: string) {
    super(`ALPHA => ${txt}`);
  }
}

export class InvalidChannelTypeError extends AlphaError {
  constructor(
    public expectedChannelType: string,
    public gotChannelType: string,
    public channelID: string
  ) {
    super(
      `Invalid channel type, expected ${expectedChannelType} got ${gotChannelType}. ChannelID: ${channelID}`
    );
  }
}

export class UnableToSendApplicationRequestError extends AlphaError {
  constructor(public roleID: string, public userID: string) {
    super(`Unable to send application for role ${roleID} by user ${userID}.`);
  }
}

export class RoleChangeFailedError extends AlphaError {
  constructor(public userID: string) {
    super(`Unable to change roles for user ${userID}.`);
  }
}

export class ChannelNotFoundError extends AlphaError {
  constructor(public channelName: string, public channelID: string) {
    super(`Channel ${channelName} with id ${channelID} was not found.`);
  }
}

export class CommandArgumentError extends AlphaError {
  constructor(public msg: string) {
    super(msg);
  }
}

export class InvalidCommandArgumentError extends AlphaError {
  constructor(public got: string, public where: string) {
    super(`Command argument had unexpected value of ${got} in ${where}.`);
  }
}

export class RoleNotFoundError extends AlphaError {
  constructor(public roleID: string) {
    super(`Role ${roleID} was not found.`);
  }
}

export class TicketNotFound extends AlphaError {
  constructor(public ticketID: string) {
    super(`Ticket ${ticketID} was not found in database.`);
  }
}

export class SomethingFuckedUpError extends AlphaError {
  constructor(public whatFuckedUp: string) {
    super(`Something fucked up. It says ${whatFuckedUp}`);
  }
}

export class InvalidTokenError extends AlphaError {
  constructor() {
    super(`An invalid token was provided in config.json!`);
  }
}

export class InvalidWebhookUrlError extends AlphaError {
  constructor() {
    super(
      `An invalid webhook URL (ticketChannelWebhook) was provided in config.json!`
    );
  }
}

export class InvalidConfigValueError extends AlphaError {
  constructor(
    public value: string,
    public problem: string,
    public got?: string
  ) {
    const gotPart = got === undefined ? `.` : `, got ${got}.`;
    super(`Wrong value ${value} provided in config.json. ${problem}${gotPart}`);
  }
}

export class CountingError extends AlphaError {
  constructor() {
    super("An error happened in counting.");
  }
}

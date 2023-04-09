import pino from "pino";

/*
const transport = pino.transport({
  targets: [
    {
      target: "pino/file",
      level: "debug",
      options: { destination: "./log.json" },
    },
    {
      target: "pino-pretty",
      level: "debug",
      options: {},
    },
  ],
});
const logger = pino(transport);
*/

const logger = pino();
console.log("Logger initialized.");
export default logger;

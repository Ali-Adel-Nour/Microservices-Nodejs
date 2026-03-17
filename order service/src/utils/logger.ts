import { createLogger, format, transports } from "winston";

const { combine, timestamp, errors, json, colorize, printf } = format;

const devFormat = combine(
  colorize(),
  timestamp(),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack, ...meta }) => {
    const metadata = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    const errorStack = stack ? `\n${stack}` : "";
    return `${timestamp} [${level}] ${message}${metadata}${errorStack}`;
  }),
);

const prodFormat = combine(timestamp(), errors({ stack: true }), json());

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: process.env.NODE_ENV === "production" ? prodFormat : devFormat,
  defaultMeta: { service: "order-service" },
  transports: [new transports.Console()],
});

export default logger;
import "winston-daily-rotate-file";
import { Injectable } from "@nestjs/common";
import { format, createLogger, Logger, transports } from "winston";

@Injectable()
export class LoggerService {
  private loggerInfo: Logger;
  private loggerError: Logger;
  private loggerAll: Logger;

  constructor() {
    this.createLoggers();
    this.replaceConsole();
  }

  // ^ Create Logs
  createLoggers() {
    // * Text format
    const textFormat = format.printf((log) => {
      return `${log.timestamp} - [${log.level.toUpperCase().charAt(0)}] ${log.message}`;
    });

    // * Date format
    const dateFormat = format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    });

    // * Info Logger
    this.loggerInfo = createLogger({
      level: "info",
      format: format.combine(dateFormat, textFormat),
      transports: [
        new transports.DailyRotateFile({
          filename: "log/info/info-%DATE%.log",
          datePattern: "YYYY-MM-DD",
          maxFiles: "7d"
        })
      ]
    });

    // * Error Logger
    this.loggerError = createLogger({
      level: "error",
      format: format.combine(dateFormat, textFormat),
      transports: [
        new transports.DailyRotateFile({
          filename: "log/error/error-%DATE%.log",
          datePattern: "YYYY-MM-DD",
          maxFiles: "7d"
        })
      ]
    });

    // * Logger where we store everything, in addition to the console.
    this.loggerAll = createLogger({
      format: format.combine(dateFormat, textFormat),
      transports: [
        new transports.DailyRotateFile({
          filename: "log/all/all-%DATE%.log",
          datePattern: "YYYY-MM-DD",
          maxFiles: "7d"
        }),
        new transports.Console()
      ]
    });
  }

  // * Replaces console.log, console.error and console.warn functionality
  replaceConsole() {
    // * Console.log
    console.log = (message: any, params: any) => {
      if (params) {
        this.loggerInfo.info(message + " " + JSON.stringify(params));
        this.loggerAll.info(message + " " + JSON.stringify(params));
      } else {
        this.loggerInfo.info(message);
        this.loggerAll.info(message);
      }
    };

    // * Console.error
    console.error = (message: any, params: any) => {
      if (params) {
        this.loggerError.error(message + " " + JSON.stringify(params));
        this.loggerAll.error(message + " " + JSON.stringify(params));
      } else {
        this.loggerError.error(message);
        this.loggerAll.error(message);
      }
    };
  }

  log(message: string) {
    this.loggerInfo.info(message);
    this.loggerAll.info(message);
  }

  error(message: string) {
    this.loggerError.error(message);
    this.loggerAll.error(message);
  }

  warn(message: string) {}

  debug(message: string) {}

  verbose(message: string) {}
}

import { Response } from "express";
import * as pino from "pino";
// import expressPino from "pino-http";


const Pino: pino.Logger = pino.pino({
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            ignore: "pid,hostname",
            minimumLevel: "trace",
            useLevelLabels: true,
        },
    }
});

let currentDate: Date;

/**
 * Returns the current date and time
 * @returns The current updated date
 */
function getCurrentDate(): Date {
    if (!currentDate) {
        currentDate = new Date();
    }
    return currentDate;
}


// FIXME: remove this once I'm done testing
Pino.level = "trace";

export function logError(message: string): void {

    const error = new Error();
    const stack = error.stack?.split("\n");

    const stackInfo = stack!
        .slice(2) // Skip the first two stack entries (which are the logWithStackTrace function and the Error constructor)
        .map((line: string) => line.trim())
        .join("\n");

    Pino.error(`${message} | STACK: ${stackInfo} `);
}

export {
    getCurrentDate, Pino as default,
};

export const {
    trace,
    debug,
    info,
    warn,
    error,
    fatal,
} = Pino;
import { ConsoleLogger } from '@nestjs/common';
import { access, mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { createWriteStream, statSync } from 'fs';
import 'dotenv/config';

import { LOGGING_LEVELS } from '../constants';

const LOGGING_LEVEL = process.env.LOG_LEVEL ?? 2;
const MAX_FILE_SIZE = process.env.FILE_MAX_SIZE ?? 10000;

const FILES_ORDERS = {
  error: 0,
  warn: 0,
  log: 0,
  debug: 0,
  verbose: 0,
  common: 0,
};

const logsFolderPath = join(dirname(__dirname), 'logs');

access(logsFolderPath)
  .then(() => {
    console.log('folder "logs" exists');
  })
  .catch(() => {
    mkdir(logsFolderPath)
      .then(() => {
        console.log('have just created a folder');
      })
      .catch(() => {
        console.log('Something went wrong while creating a folder for logs');
      });
  });

const pathToFile = (fileNameType: string): string =>
  join(
    logsFolderPath,
    `./${fileNameType}${FILES_ORDERS[fileNameType] ?? 0}.log`,
  );

export class MyLogger extends ConsoleLogger {
  log(message: any, context?: string) {
    const logType = 'log';
    const logLevel = LOGGING_LEVELS[logType];
    const fileName = logLevel <= LOGGING_LEVEL ? 'log' : 'common';
    const filePath = pathToFile(fileName);

    access(filePath)
      .then(() => {
        const fileSize = statSync(filePath).size;
        if (fileSize > MAX_FILE_SIZE) {
          FILES_ORDERS[fileName] = FILES_ORDERS[fileName] + 1;
        }

        const logger = createWriteStream(pathToFile(fileName), {
          flags: 'a',
        });
        logger.write(message);
      })
      .catch(() => {
        writeFile(filePath, message).catch(() => {
          console.log(`Something went wrong while writting the ${logType}.log`);
        });
      });

    if (logLevel <= LOGGING_LEVEL) {
      super[logType](message, context);
    }
  }

  error(message: any, stack?: string, context?: string) {
    const logType = 'error';
    const logLevel = LOGGING_LEVELS[logType];
    const fileName = logLevel <= LOGGING_LEVEL ? 'log' : 'common';
    const filePath = pathToFile(fileName);

    access(filePath)
      .then(() => {
        const fileSize = statSync(filePath).size;
        if (fileSize > MAX_FILE_SIZE) {
          FILES_ORDERS[fileName] = FILES_ORDERS[fileName] + 1;
        }

        const logger = createWriteStream(pathToFile(fileName), {
          flags: 'a',
        });
        logger.write(message);
      })
      .catch(() => {
        writeFile(filePath, message).catch(() => {
          console.log(`Something went wrong while writting the ${logType}.log`);
        });
      });

    if (logLevel <= LOGGING_LEVEL) {
      super[logType](message, context);
    }
  }

  warn(message: any, context?: string) {
    const logType = 'warn';
    const logLevel = LOGGING_LEVELS[logType];
    const fileName = logLevel <= LOGGING_LEVEL ? 'log' : 'common';
    const filePath = pathToFile(fileName);

    access(filePath)
      .then(() => {
        const fileSize = statSync(filePath).size;
        if (fileSize > MAX_FILE_SIZE) {
          FILES_ORDERS[fileName] = FILES_ORDERS[fileName] + 1;
        }

        const logger = createWriteStream(pathToFile(fileName), {
          flags: 'a',
        });
        logger.write(message);
      })
      .catch(() => {
        writeFile(filePath, message).catch(() => {
          console.log(`Something went wrong while writting the ${logType}.log`);
        });
      });

    if (logLevel <= LOGGING_LEVEL) {
      super[logType](message, context);
    }
  }

  debug(message: any, context?: string) {
    const logType = 'debug';
    const logLevel = LOGGING_LEVELS[logType];
    const fileName = logLevel <= LOGGING_LEVEL ? 'log' : 'common';
    const filePath = pathToFile(fileName);

    access(filePath)
      .then(() => {
        const fileSize = statSync(filePath).size;
        if (fileSize > MAX_FILE_SIZE) {
          FILES_ORDERS[fileName] = FILES_ORDERS[fileName] + 1;
        }

        const logger = createWriteStream(pathToFile(fileName), {
          flags: 'a',
        });
        logger.write(message);
      })
      .catch(() => {
        writeFile(filePath, message).catch(() => {
          console.log(`Something went wrong while writting the ${logType}.log`);
        });
      });

    if (logLevel <= LOGGING_LEVEL) {
      super[logType](message, context);
    }
  }

  verbose(message: any, context?: string) {
    const logType = 'verbose';
    const logLevel = LOGGING_LEVELS[logType];
    const fileName = logLevel <= LOGGING_LEVEL ? 'log' : 'common';
    const filePath = pathToFile(fileName);

    access(filePath)
      .then(() => {
        const fileSize = statSync(filePath).size;
        if (fileSize > MAX_FILE_SIZE) {
          FILES_ORDERS[fileName] = FILES_ORDERS[fileName] + 1;
        }

        const logger = createWriteStream(pathToFile(fileName), {
          flags: 'a',
        });
        logger.write(message);
      })
      .catch(() => {
        writeFile(filePath, message).catch(() => {
          console.log(`Something went wrong while writting the ${logType}.log`);
        });
      });

    if (logLevel <= LOGGING_LEVEL) {
      super[logType](message, context);
    }
  }
}

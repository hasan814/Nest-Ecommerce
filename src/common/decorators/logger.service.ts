import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  log(message: string): void {
    console.log(`[LOG]: ${message}`);
  }

  error(message: string): void {
    console.error(`[ERROR]: ${message}`);
  }

  warn(message: string): void {
    console.warn(`[WARN]: ${message}`);
  }

  debug(message: string): void {
    console.debug(`[DEBUG]: ${message}`);
  }

  verbose(message: string): void {
    console.log(`[VERBOSE]: ${message}`);
  }
}

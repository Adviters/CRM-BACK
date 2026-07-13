import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AuthRepository } from './auth.repository';

const REVOKED_RETENTION_DAYS = 7;

@Injectable()
export class RefreshTokenCleanupService {
  private readonly logger = new Logger(RefreshTokenCleanupService.name);

  constructor(private readonly authRepository: AuthRepository) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async purgeStaleTokens(): Promise<void> {
    const revokedBefore = new Date(
      Date.now() - REVOKED_RETENTION_DAYS * 24 * 60 * 60 * 1000,
    );

    const deleted =
      await this.authRepository.deleteExpiredAndRevoked(revokedBefore);

    if (deleted > 0) {
      this.logger.log(`Purged ${deleted} stale refresh token(s)`);
    }
  }
}

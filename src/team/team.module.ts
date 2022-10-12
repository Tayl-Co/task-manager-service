import { Module } from '@nestjs/common';
import { TeamResolver } from './team.resolver';

@Module({
  providers: [TeamResolver]
})
export class TeamModule {}

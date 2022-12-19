import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from '@activity/entity/activity.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Activity])],
    providers: [ActivityService, ActivityService],
    exports: [ActivityService],
})
export class ActivityModule {}

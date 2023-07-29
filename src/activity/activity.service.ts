import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from '@activity/entity/activity.entity';
import { Repository } from 'typeorm';
import { ActivityDto } from '@activity/dtos/activity.dto';

@Injectable()
export class ActivityService {
    constructor(
        @InjectRepository(Activity)
        private activityRepository: Repository<Activity>,
    ) {}

    /**
     * Creates an activity and returns the creates activity
     * @param activity Activity Data
     * @return Activity created
     */
    create(activity: ActivityDto): Promise<Activity> {
        const newActivity = this.activityRepository.create({
            ...activity,
            date: new Date(),
        });

        return this.activityRepository.save(newActivity);
    }
}

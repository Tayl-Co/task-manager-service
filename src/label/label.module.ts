import { Module } from '@nestjs/common';
import { LabelService } from './label.service';
import { LabelResolver } from './label.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Label } from '@label/entity/label.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Label])],
    providers: [LabelService, LabelResolver],
})
export class LabelModule {}

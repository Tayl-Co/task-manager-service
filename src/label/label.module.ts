import { Module } from '@nestjs/common';
import { LabelService } from './label.service';
import { LabelResolver } from './label.resolver';
import { LabelRepository } from '@label/repository/label.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Label } from '@label/entity/label.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Label])],
    providers: [LabelService, LabelResolver, LabelRepository],
})
export class LabelModule {}

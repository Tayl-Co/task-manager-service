import { InjectRepository } from '@nestjs/typeorm';
import { Label } from '@label/entity/label.entity';
import { Repository } from 'typeorm';
import { LabelDto } from '@label/dtos/label.dto';

export class LabelRepository {
    constructor(
        @InjectRepository(Label) private labelRepository: Repository<Label>,
    ) {}

    create(labelInput: LabelDto) {
        const label = this.labelRepository.create(labelInput);

        return this.labelRepository.save(label);
    }
}

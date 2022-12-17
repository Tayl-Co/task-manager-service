import { Injectable } from '@nestjs/common';
import { LabelRepository } from '@label/repository/label.repository';
import { Label } from '@label/entity/label.entity';
import { LabelDto } from '@label/dtos/label.dto';

@Injectable()
export class LabelService {
    constructor(private labelRepository: LabelRepository) {}

    create(labelInput: LabelDto): Promise<Label> {
        return this.labelRepository.create(labelInput);
    }
}

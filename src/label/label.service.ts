import { Injectable, NotFoundException } from '@nestjs/common';
import { LabelRepository } from '@label/repository/label.repository';
import { Label } from '@label/entity/label.entity';
import { LabelDto } from '@label/dtos/label.dto';

@Injectable()
export class LabelService {
    constructor(private labelRepository: LabelRepository) {}

    create(labelInput: LabelDto): Promise<Label> {
        return this.labelRepository.create(labelInput);
    }

    async findOne(id: number): Promise<Label> {
        const label = await this.labelRepository.findOne(id);

        if (!label) throw new NotFoundException(`Label ${id} not found`);

        return label;
    }
}

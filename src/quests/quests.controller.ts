import { Controller, Body, Post, Get, Param } from '@nestjs/common';
import { QuestsService } from './quests.service';
import { QuestsCreateManyDto } from './dto/quests-create-many.dto';
import { QuestsResponseDto } from './dto/quests-response.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('quests')
export class QuestsController {
  constructor(private readonly questsService: QuestsService) { }

  @Post('batch')
  async insertMany(@Body() dto: QuestsCreateManyDto): Promise<QuestsResponseDto[]> {
    const created = await this.questsService.insertMany(dto.quests);
    return created.map((quest) => new QuestsResponseDto(quest));
  }

  @Public()
  @Get()
  async getAllQuests(): Promise<QuestsResponseDto[]> {
    const quests = await this.questsService.findAll();
    return quests.map((quest) => new QuestsResponseDto(quest));
  }

  @Public()
  @Get(':id')
  async getQuestById(@Param('id') id: string): Promise<QuestsResponseDto> {
    const quest = await this.questsService.findOne(id);
    return new QuestsResponseDto(quest);
  }
}

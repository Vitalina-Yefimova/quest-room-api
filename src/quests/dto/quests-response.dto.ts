import { QuestsResponse, QuestsDocument } from '../interfaces';
import { BaseResponseDto } from '../../common/dto/base-response.dto';

export class QuestsResponseDto extends BaseResponseDto<QuestsResponse> implements QuestsResponse {
  id: string;
  title: string;
  description: string;
  genres: { genreName: string }[];
  players: {
    min: number;
    max: number;
  };
  difficulty: string;
  duration: string;
  price: number;
  image: string;
  imageBg: string;

  constructor(data: QuestsDocument) {
    super({
      id: data._id.toString(),
      title: data.title,
      description: data.description,
      genres: data.genres,
      players: data.players,
      difficulty: data.difficulty,
      duration: data.duration,
      price: data.price,
      image: data.image,
      imageBg: data.imageBg,
    });
  }
}

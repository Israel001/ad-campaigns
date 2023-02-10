import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Campaign } from "./campaigns.entity";
import { CampaignDto } from "./campaigns.dto";
import { Injectable } from "@nestjs/common";
import { Mapper, MappingProfile } from "@automapper/types";

@Injectable()
export class CampaignProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  mapProfile(): MappingProfile {
    return mapper => {
      mapper.createMap(Campaign, CampaignDto)
    }
  }
}
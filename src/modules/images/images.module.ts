import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Campaign } from "../campaigns/campaigns.entity";
import { Image } from "./images.entity";
import { ImagesService } from "./images.service";

@Module({
  imports: [TypeOrmModule.forFeature([Image, Campaign])],
  providers: [ImagesService],
  exports: [ImagesService]
})
export class ImagesModule {}
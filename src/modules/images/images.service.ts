import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from '../campaigns/campaigns.entity';
import { Image } from './images.entity';
import util from 'util';
import fs from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';
import { CampaignImage } from '../campaigns/campaigns.dto';

@Injectable()
export class ImagesService {
  public logger = new Logger(ImagesService.name);
  private basePath = path.join(__dirname, '..', '..', '..', 'images');

  @InjectRepository(Image) public imageRepository: Repository<Image>;
  @InjectRepository(Campaign) public campaignRepository: Repository<Campaign>;

  constructor() {}

  async upload(images: CampaignImage[], campaignId: number) {
    const writeFile = util.promisify(fs.writeFile);
    const imagePromises = [];
    const imagesPath = [];
    for (const image of images) {
      const splittedMime = image.mimetype.split('/');
      const imageName = `${nanoid()}.${splittedMime[splittedMime.length - 1]}`;
      const imagePath = `${this.basePath}/${imageName}`;
      imagesPath.push(imageName);
      imagePromises.push(writeFile(imagePath, image.buffer));
    }
    await Promise.all(imagePromises);

    this.logger.debug(
      `Successfully uploaded ${imagesPath.length} images for campaign with ID: ${campaignId}`,
    );

    const campaign = await this.campaignRepository.findOne({
      where: { id: campaignId },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');

    const imageModelPromises = [];
    for (const image of imagesPath) {
      const imageModel = this.imageRepository.create({
        imagePath: image,
      });
      imageModel.campaign = Promise.resolve(campaign);
      imageModelPromises.push(imageModel.save());
    }

    await Promise.all(imageModelPromises);

    this.logger.debug(
      `Successfully saved ${imagesPath.length} images for campaign with ID: ${campaignId}`,
    );
  }

  async fetch(campaignId: number) {
    return this.imageRepository
      .createQueryBuilder()
      .where('campaign_id = :campaignId', { campaignId })
      .getMany();
  }

  async delete(images: string[], campaignId: number) {
    await this.imageRepository
      .createQueryBuilder()
      .delete()
      .where('campaign_id = :campaignId', { campaignId })
      .andWhere(`image_path IN (${"'" + images.join("','") + "'"})`)
      .execute();

    const deleteFile = util.promisify(fs.unlink);
    const imagePromises = [];
    for (const image of images) {
      imagePromises.push(deleteFile(`${this.basePath}/${image}`));
    }
    await Promise.all(imagePromises);

    this.logger.debug(
      `Successfully deleted the following images: ${images.join(
        ',',
      )} for campaign with ID: ${campaignId}`,
    );
  }
}

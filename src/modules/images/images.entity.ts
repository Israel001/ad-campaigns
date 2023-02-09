import { BaseEntity } from "src/base/entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Campaign } from "../campaigns/campaigns.entity";

@Entity('images', { synchronize: true })
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Campaign, campaign => campaign.images)
  campaign: Promise<Campaign>;

  @Column()
  imagePath: string;
}
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubscribeAuctionDto } from './dto/subscribe-auction.dto';

@Injectable()
export class AuctionService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAuctionDto: CreateAuctionDto) {
    try {
      const product = this.prisma.product.findUnique({
        where: {
          id: createAuctionDto.productId
        }
      })
      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND)
      }
      return this.prisma.auction.create({
        data: {
          ...createAuctionDto,
          endTime: new Date(createAuctionDto.endTime).toISOString()
        }
      })
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }
  }

  async findAll() {
    try {
      return this.prisma.auction.findMany({
        include: {
          product: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string) {
    try {
      return this.prisma.auction.findUnique({
        where: { id },
        include: {
          product: {
            select: {
              name: true,
              image: true,
              description: true,
            },
          },
          subscribers: {
            orderBy: {
              price: 'desc',
            },
            take: 1,
          },
        },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  update(id: string, updateAuctionDto: UpdateAuctionDto) {
    try {
      return this.prisma.auction.update({
        where: {
          id
        },
        data: updateAuctionDto
      })
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }
  }

  remove(id: string) {
    try {
      return this.prisma.auction.delete({
        where: {
          id
        }
      })
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }
  }

  async subscribe(id: string, subscribeAuctionDto: SubscribeAuctionDto) {
    try {
      const auction = await this.prisma.auction.findUnique({
        where: { id },
        include: {
          subscribers: {
            orderBy: {
              price: 'desc',
            },
            take: 1,
          },
        },
      });

      if (!auction) {
        throw new HttpException('Auction not found', HttpStatus.NOT_FOUND);
      }

      if (new Date() > new Date(auction.endTime)) {
        throw new HttpException('Auction has ended', HttpStatus.BAD_REQUEST);
      }

      const lastBid = auction.subscribers[0]?.price || auction.startPrice;

      if (subscribeAuctionDto.price <= lastBid) {
        throw new HttpException('Bid must be higher than the current highest bid', HttpStatus.BAD_REQUEST);
      }

      if (subscribeAuctionDto.price >= auction.endPrice) {
        // End the auction if the bid reaches or exceeds the end price
        await this.prisma.auction.update({
          where: { id },
          data: { endTime: new Date() },
        });
      }

      return this.prisma.auctionSubscriber.create({
        data: {
          ...subscribeAuctionDto,
          auctionId: id,
        },
      });
    } catch (error) {
      throw new HttpException(error.message || 'Failed to subscribe to auction', HttpStatus.BAD_REQUEST);
    }
  }
}

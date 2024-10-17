import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubscribeAuctionDto } from './dto/subscribe-auction.dto';

@Injectable()
export class AuctionService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

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
        where: { isActive: true },
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
        where: { id, isActive: true },
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
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
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

  async canUserSubscribe(userId: string, auctionId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const auction = await this.prisma.auction.findUnique({ where: { id: auctionId } });

    if (!user || !auction) {
      throw new HttpException('User or Auction not found', HttpStatus.NOT_FOUND);
    }

    return user.points >= auction.minPointsToSubscribe;
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

      const user = await this.prisma.user.findUnique({
        where: { id: subscribeAuctionDto.userId },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const lastBid = auction.subscribers[0]?.price || auction.startPrice;

      if (subscribeAuctionDto.price <= lastBid) {
        throw new HttpException('Bid must be higher than the current highest bid', HttpStatus.BAD_REQUEST);
      }

      const isFirstBid = !await this.prisma.auctionSubscriber.findFirst({
        where: { userId: subscribeAuctionDto.userId, auctionId: id },
      });

      if (isFirstBid) {
        if (user.points < auction.minPointsToSubscribe) {
          throw new HttpException('Insufficient points to join the auction', HttpStatus.FORBIDDEN);
        }

        // Deduct points for the first bid
        await this.prisma.user.update({
          where: { id: subscribeAuctionDto.userId },
          data: { points: { decrement: auction.minPointsToSubscribe } },
        });
      }

      if (subscribeAuctionDto.price >= auction.endPrice) {
        // End the auction if the bid reaches or exceeds the end price
        await this.endAuction(id, subscribeAuctionDto.userId, subscribeAuctionDto.price);
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

  async endAuction(auctionId: string, winnerId: string, winningPrice: number) {
    const auction = await this.prisma.auction.findUnique({
      where: { id: auctionId },
      include: { product: true },
    });

    if (!auction) {
      throw new HttpException('Auction not found', HttpStatus.NOT_FOUND);
    }

    // End the auction
    await this.prisma.auction.update({
      where: { id: auctionId },
      data: { isActive: false },
    });

    // Create an order for the winning bid
    await this.prisma.order.create({
      data: {
        userId: winnerId,
        total: winningPrice,
        phoneNumber: '', // You might want to get this from the user's profile
        address: '', // You might want to get this from the user's profile
        orderItems: {
          create: {
            productId: auction.productId,
            quantity: 1,
            price: winningPrice,
          },
        },
      },
    });

    // Return points to all other subscribers
    await this.prisma.auctionSubscriber.findMany({
      where: { auctionId, userId: { not: winnerId } },
      distinct: ['userId'],
    }).then(subscribers => {
      subscribers.forEach(async (subscriber) => {
        await this.prisma.user.update({
          where: { id: subscriber.userId },
          data: { points: { increment: auction.minPointsToSubscribe } },
        });
      });
    });

  }


  async createAuction(createAuctionDto: CreateAuctionDto) {
    const auction = await this.prisma.auction.create({
      data: createAuctionDto,
    });
    return auction;
  }
}

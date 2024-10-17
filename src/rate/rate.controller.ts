import { Controller, Get, Post, Body, Param, Delete, Req, UseGuards, Put, Query } from '@nestjs/common';
import { RateService } from './rate.service';
import { CreateRateDto } from './dto/create-rate.dto';
import { UpdateRateDto } from './dto/update-rate.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
type RequestWithUser = Request & { user: { id: string } };
@Controller('rate')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createRateDto: CreateRateDto, @Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.rateService.create(createRateDto, userId);
  }

  @Get()
  findAll() {
    return this.rateService.findAll();
  }

  @Get()
  findAllByProductId(@Query('productId') productId: string) {
    return this.rateService.findAllByProductId(productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rateService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() updateRateDto: UpdateRateDto, @Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.rateService.update(id, updateRateDto, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.rateService.remove(id, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('check/:productId')
  async checkUserRating(@Param('productId') productId: string, @Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.rateService.hasUserRatedProduct(userId, productId);
  }
}

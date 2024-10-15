import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StaticsService } from './statics.service';


@Controller('statics')
export class StaticsController {
  constructor(private readonly staticsService: StaticsService) {}
  @Get('categories')
  getCategories() {
    return this.staticsService.getCategories();
  }

  @Get('order-statuses')
  getOrderStatuses() {
    return this.staticsService.getOrderStatuses();
  }

  @Get('roles')
  getRoles() {
    return this.staticsService.getRoles();
  }

  @Get('order-stats')
  getOrderStats() {
    return this.staticsService.getOrderStats();
  }

  @Get('revenue-stats')
  getRevenueStats() {
    return this.staticsService.getRevenueStats();
  }

  @Get('sales-stats')
  getSalesStats() {
    return this.staticsService.getSalesStats();
  }

  @Get('recent-sales')
  getRecentSales() {
    return this.staticsService.getRecentSales();
  }

  @Get('monthly-revenue')
  getMonthlyRevenue() {
    return this.staticsService.getMonthlyRevenue();
  }
}

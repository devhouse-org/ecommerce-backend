import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Roles, OrderStatus } from '@prisma/client';

@Injectable()
export class StaticsService {
  constructor(private prisma: PrismaService) {}

  async getCategories() {
    return this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  getOrderStatuses() {
    return Object.values(OrderStatus);
  }

  getRoles() {
    return Object.values(Roles);
  }

  async getOrderStats() {
    const totalOrders = await this.prisma.order.count();
    const pendingOrders = await this.prisma.order.count({
      where: { status: OrderStatus.PENDING },
    });
    const shippedOrders = await this.prisma.order.count({
      where: { status: OrderStatus.SHIPPED },
    });
    const deliveredOrders = await this.prisma.order.count({
      where: { status: OrderStatus.DELIVERED },
    });
    // total products
    const totalProducts = await this.prisma.product.count();
    return {
      totalOrders,
      pendingOrders,
      shippedOrders,
      deliveredOrders,
      totalProducts,
    };
  }

  async getRevenueStats() {
    const result = await this.prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: {
          in: [OrderStatus.SHIPPED, OrderStatus.DELIVERED],
        },
      },
    });

    return {
      totalRevenue: result._sum.total || 0,
    };
  }

  async getSalesStats() {
    const result = await this.prisma.orderItem.aggregate({
      _sum: {
        quantity: true,
      },
      where: {
        order: {
          status: {
            in: [OrderStatus.SHIPPED, OrderStatus.DELIVERED],
          },
        },
      },
    });

    return {
      totalSales: result._sum.quantity || 0,
    };
  }

  async getRecentSales() {
    const recentSales = await this.prisma.order.findMany({
      where: {
        status: {
          in: [OrderStatus.SHIPPED, OrderStatus.DELIVERED],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
      select: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        total: true,
      },
    });

    return recentSales.map(sale => ({
      id: sale.user.id,
      name: sale.user.name,
      image: sale.user.image ? `data:image/jpeg;base64,${sale.user.image.toString('base64')}` : null,
      email: sale.user.email,
      salesAmount: sale.total.toFixed(2),
    }));
  }

  async getMonthlyRevenue() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

    const monthlyRevenue = await this.prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
        status: {
          in: [OrderStatus.SHIPPED, OrderStatus.DELIVERED],
        },
      },
      _sum: {
        total: true,
      },
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const groupedRevenue = monthlyRevenue.reduce((acc, item) => {
      const monthName = monthNames[new Date(item.createdAt).getMonth()];
      const total = Number(item._sum.total.toFixed(2));

      if (!acc[monthName]) {
        acc[monthName] = total;
      } else {
        acc[monthName] += total;
      }

      return acc;
    }, {});

    return Object.entries(groupedRevenue).map(([month, total]) => ({
      month,
      totalRevenueInThisMonth: typeof total === 'number' ? Number(total.toFixed(2)) : 0,
    }));
  }
}

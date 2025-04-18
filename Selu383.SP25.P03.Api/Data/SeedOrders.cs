using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Orders;
using Selu383.SP25.P03.Api.Features.Payments;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedOrders
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using var context = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>());

            context.Payments.RemoveRange(context.Payments);
            context.OrderFoodItems.RemoveRange(context.OrderFoodItems);
            context.Orders.RemoveRange(context.Orders);
            context.SaveChanges();

            context.Database.ExecuteSqlRaw("DBCC CHECKIDENT ('Orders', RESEED, 0)");

            Console.WriteLine("Orders wiped and identity reseeded to 0.");
        }
    }
}

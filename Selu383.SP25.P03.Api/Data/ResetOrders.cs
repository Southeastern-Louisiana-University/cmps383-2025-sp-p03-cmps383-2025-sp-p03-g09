using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Orders;
using Selu383.SP25.P03.Api.Features.Payments;
using Selu383.SP25.P03.Api.Features.Tickets;

namespace Selu383.SP25.P03.Api.Data
{
    public static class ResetOrders
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using var context = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>());

            var ticketIds = context.Tickets.Select(t => t.Id).ToHashSet();

            var badOrders = context.Orders
                .Where(o => o.TicketId == 0 || !ticketIds.Contains(o.TicketId))
                .ToList();

            if (badOrders.Any())
            {
                Console.WriteLine($"🧨 Found {badOrders.Count} orders with invalid TicketIds. Nuking them...");
                context.Orders.RemoveRange(badOrders);
                context.SaveChanges();
            }

            var payments = context.Payments.ToList();
            var foodLinks = context.OrderFoodItems.ToList();
            var allOrders = context.Orders.ToList();

            Console.WriteLine($"🧹 Wiping clean: {payments.Count} payments, {foodLinks.Count} food links, {allOrders.Count} orders.");

            context.Payments.RemoveRange(payments);
            context.OrderFoodItems.RemoveRange(foodLinks);
            context.Orders.RemoveRange(allOrders);
            context.SaveChanges();

            try
            {
                context.Database.ExecuteSqlRaw("DBCC CHECKIDENT ('Orders', RESEED, 0)");
                Console.WriteLine("✅ Order identity reseeded to 0.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"⚠️ Couldn't reseed Orders identity. This is normal on Azure SQL: {ex.Message}");
            }
        }
    }
}

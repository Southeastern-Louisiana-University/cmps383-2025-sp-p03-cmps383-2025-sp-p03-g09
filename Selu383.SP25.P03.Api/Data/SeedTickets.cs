using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Tickets;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedTickets
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using var context = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>());

            if (context.Tickets.Any())
            {
                return; // DB already seeded
            }

            var locations = context.Locations.ToList();

            var nyLocation = locations.FirstOrDefault(l => l.Name.Contains("New York"));
            var noLocation = locations.FirstOrDefault(l => l.Name.Contains("New Orleans"));
            var laLocation = locations.FirstOrDefault(l => l.Name.Contains("Los Angeles"));

            context.Tickets.AddRange(
                new Ticket
                {
                    Price = 12.99m,
                    LocationId = nyLocation?.Id ?? 1,
                    TheaterId = 1,
                    SeatId = 1,
                    MovieId = 1,
                    Showtime = "2025-03-01T14:00:00"
                },
                new Ticket
                {
                    Price = 14.99m,
                    LocationId = noLocation?.Id ?? 1,
                    TheaterId = 2,
                    SeatId = 2,
                    MovieId = 2,
                    Showtime = "2025-03-01T18:00:00"
                },
                new Ticket
                {
                    Price = 10.99m,
                    LocationId = laLocation?.Id ?? 1,
                    TheaterId = 3,
                    SeatId = 3,
                    MovieId = 3,
                    Showtime = "2025-03-01T20:00:00"
                }
            );

            context.SaveChanges();
        }
    }
}

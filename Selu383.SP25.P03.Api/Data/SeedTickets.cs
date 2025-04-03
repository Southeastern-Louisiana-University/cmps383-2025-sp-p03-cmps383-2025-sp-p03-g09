using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Tickets;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedTickets
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
            {
                // Look for any tickets.
                if (context.Tickets.Any())
                {
                    return; // DB has been seeded
                }

                context.Tickets.AddRange(
                    new Ticket
                    {
                        Price = 12.99m,
                        LocationId = 1, // Assuming this corresponds to a seeded location
                        TheaterId = 1, // Assuming this corresponds to a seeded theater
                        SeatId = 1,    // Assuming this corresponds to a seeded seat
                        MovieId = 1,   // Assuming this corresponds to a seeded movie
                        Showtime = "2025-03-01T14:00:00"
                    },
                    new Ticket
                    {
                        Price = 14.99m,
                        LocationId = 2,
                        TheaterId = 2,
                        SeatId = 2,
                        MovieId = 2,
                        Showtime = "2025-03-01T18:00:00"
                    },
                    new Ticket
                    {
                        Price = 10.99m,
                        LocationId = 3,
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
}

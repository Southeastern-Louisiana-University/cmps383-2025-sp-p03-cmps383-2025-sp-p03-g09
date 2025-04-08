using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Seats;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedSeats
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
            {
                context.Seats.RemoveRange(context.Seats);
                context.SaveChanges();

                context.Database.ExecuteSqlRaw("DBCC CHECKIDENT ('Seats', RESEED, 0)");

                var theaters = context.Theaters.ToList();
                foreach (var theater in theaters)
                {
                    int totalSeats = theater.SeatCount > 0 ? theater.SeatCount : 200;
                    int rows = (int)Math.Sqrt(totalSeats);
                    int cols = (int)Math.Ceiling((double)totalSeats / rows);

                    var seats = new List<Seat>();
                    for (int row = 1; row <= rows; row++)
                    {
                        for (int col = 1; col <= cols; col++)
                        {
                            if (seats.Count >= totalSeats)
                                break;

                            seats.Add(new Seat
                            {
                                TheaterId = theater.Id,
                                Row = row,
                                Column = col,
                                IsReserved = false
                            });
                        }
                    }

                    context.Seats.AddRange(seats);
                }

                context.SaveChanges();
            }
        }
    }
}

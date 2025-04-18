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
                    var seatLayout = new List<int> { 9, 11, 13, 13, 13, 13, 13, 13 };
                    var seats = new List<Seat>();

                    for (int i = 0; i < seatLayout.Count; i++)
                    {
                        int rowIndex = i + 1;
                        int columns = seatLayout[i];

                        for (int col = 1; col <= columns; col++)
                        {
                            seats.Add(new Seat
                            {
                                TheaterId = theater.Id,
                                Row = rowIndex,
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

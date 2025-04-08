using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Seats;
using Microsoft.EntityFrameworkCore;

namespace Selu383.SP25.P03.Api.Data
{
    public static class TheaterSeatGeneration
    {
        public static void AddSeatsToExistingTheaters(DataContext context)
        {
            var theatersWithoutSeats = context.Theaters
                .Include(t => t.Seats)
                .Where(t => !t.Seats.Any())
                .ToList();

            foreach (var theater in theatersWithoutSeats)
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

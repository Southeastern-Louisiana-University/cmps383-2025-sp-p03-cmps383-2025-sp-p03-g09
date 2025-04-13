using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Features.Locations;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedTheaters
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
            {
                var ny = context.Locations.FirstOrDefault(l => l.Name.Contains("New York"));
                var no = context.Locations.FirstOrDefault(l => l.Name.Contains("New Orleans"));
                var la = context.Locations.FirstOrDefault(l => l.Name.Contains("Los Angeles"));

                if (ny == null || no == null || la == null)
                {
                    throw new InvalidOperationException("Required locations are missing.");
                }

                context.Theaters.RemoveRange(context.Theaters);
                context.SaveChanges();
                context.Database.ExecuteSqlRaw("DBCC CHECKIDENT ('Theaters', RESEED, 0)");

                var theaters = new List<Theater>();
                int seatCount = 150;

                void AddTheaters(Location loc)
                {
                    for (int i = 1; i <= 8; i++)
                    {
                        theaters.Add(new Theater
                        {
                            TheaterNumber = i,
                            SeatCount = seatCount,
                            LocationId = loc.Id
                        });
                    }
                }

                AddTheaters(ny);
                AddTheaters(no);
                AddTheaters(la);

                context.Theaters.AddRange(theaters);
                context.SaveChanges();
            }
        }
    }
}

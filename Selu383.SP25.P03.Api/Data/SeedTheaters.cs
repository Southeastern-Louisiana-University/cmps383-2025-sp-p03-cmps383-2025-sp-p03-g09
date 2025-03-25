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
                // Ensure Locations are seeded first
                if (!context.Locations.Any())
                {
                    context.Locations.AddRange(
                        new Location { Name = "Downtown Cinema", Address = "123 Main St" },
                        new Location { Name = "Uptown Cinema", Address = "456 Elm St" }
                    );
                    context.SaveChanges();
                }

                // Fetch the locations dynamically
                var downtown = context.Locations.FirstOrDefault(l => l.Name == "Downtown Cinema");
                var uptown = context.Locations.FirstOrDefault(l => l.Name == "Uptown Cinema");

                if (downtown == null || uptown == null)
                {
                    throw new InvalidOperationException("Required locations are missing.");
                }

                // Remove invalid theaters (those with invalid LocationId)
                var invalidTheaters = context.Theaters.Where(t => !context.Locations.Any(l => l.Id == t.LocationId)).ToList();
                if (invalidTheaters.Any())
                {
                    context.Theaters.RemoveRange(invalidTheaters);
                    context.SaveChanges();
                }

                // Clear existing theaters before reseeding
                context.Theaters.RemoveRange(context.Theaters);
                context.SaveChanges();

                // Add new theaters
                context.Theaters.AddRange(
                    new Theater
                    {
                        TheaterNumber = 1,
                        SeatCount = 150,
                        LocationId = downtown.Id
                    },
                    new Theater
                    {
                        TheaterNumber = 2,
                        SeatCount = 200,
                        LocationId = uptown.Id
                    },
                    new Theater
                    {
                        TheaterNumber = 3,
                        SeatCount = 300,
                        LocationId = downtown.Id
                    },
                    new Theater
                    {
                        TheaterNumber = 4,
                        SeatCount = 75,
                        LocationId = uptown.Id
                    }
                );

                // Save changes to commit the new theaters to the database
                context.SaveChanges();
            }
        }
    }
}

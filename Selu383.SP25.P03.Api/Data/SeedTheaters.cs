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
                // Ensure Locations are already seeded
                var downtown = context.Locations.FirstOrDefault(l => l.Name.Contains("New York"));
                var uptown = context.Locations.FirstOrDefault(l => l.Name.Contains("New Orleans"));

                // If locations are missing, throw an exception
                if (downtown == null || uptown == null)
                {
                    throw new InvalidOperationException("Required locations are missing. Ensure SeedLocations.Initialize is called first.");
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

                // Reset identity (SQL Server example)
                context.Database.ExecuteSqlRaw("DBCC CHECKIDENT ('Theaters', RESEED, 0)");

                // Add new theaters connected to the correct Location Ids
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

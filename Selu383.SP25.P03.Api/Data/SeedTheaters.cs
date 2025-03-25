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
                // Delete all existing theaters first
                context.Theaters.RemoveRange(context.Theaters);

                // Reset the identity column to start from 1 (or the appropriate starting point)
                context.Database.ExecuteSqlRaw("DBCC CHECKIDENT ('Theaters', RESEED, 0)");

                // Fetch all locations
                var locations = context.Locations.ToList();
                if (!locations.Any())
                {
                    throw new InvalidOperationException("No locations found to associate with theaters.");
                }

                // Find specific locations
                var newyork = locations.FirstOrDefault(l => l.Name.Contains("New York"));
                var neworleans = locations.FirstOrDefault(l => l.Name.Contains("New Orleans"));
                var losangeles = locations.FirstOrDefault(l => l.Name.Contains("Los Angeles"));

                // Seed new theaters, associating the Location directly to the Theater
                context.Theaters.AddRange(
                    // New York Theaters
                    new Theater
                    {
                        TheaterNumber = 1,
                        SeatCount = 300,
                        Location = newyork
                    },
                    new Theater
                    {
                        TheaterNumber = 2,
                        SeatCount = 300,
                        Location = newyork
                    },
                    new Theater
                    {
                        TheaterNumber = 3,
                        SeatCount = 300,
                        Location = newyork
                    },
                    new Theater
                    {
                        TheaterNumber = 4,
                        SeatCount = 300,
                        Location = newyork
                    },
                    new Theater
                    {
                        TheaterNumber = 5,
                        SeatCount = 300,
                        Location = newyork
                    },

                    // New Orleans Theaters
                    new Theater
                    {
                        TheaterNumber = 1,
                        SeatCount = 200,
                        Location = neworleans
                    },
                    new Theater
                    {
                        TheaterNumber = 2,
                        SeatCount = 200,
                        Location = neworleans
                    },
                    new Theater
                    {
                        TheaterNumber = 3,
                        SeatCount = 200,
                        Location = neworleans
                    },
                    new Theater
                    {
                        TheaterNumber = 4,
                        SeatCount = 200,
                        Location = neworleans
                    },
                    new Theater
                    {
                        TheaterNumber = 5,
                        SeatCount = 200,
                        Location = neworleans
                    },
                    // Los Angeles Theaters
                    new Theater
                    {
                        TheaterNumber = 1,
                        SeatCount = 250,
                        Location = losangeles
                    },
                    new Theater
                    {
                        TheaterNumber = 2,
                        SeatCount = 250,
                        Location = losangeles
                    },
                    new Theater
                    {
                        TheaterNumber = 3,
                        SeatCount = 250,
                        Location = losangeles
                    },
                    new Theater
                    {
                        TheaterNumber = 4,
                        SeatCount = 250,
                        Location = losangeles
                    },
                    new Theater
                    {
                        TheaterNumber = 5,
                        SeatCount = 250,
                        Location = losangeles
                    }


                );

                context.SaveChanges();
            }
        }
    }
}

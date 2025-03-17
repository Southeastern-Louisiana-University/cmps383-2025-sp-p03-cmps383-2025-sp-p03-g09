using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Locations;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedLocations
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
            {
                // Look for any locations.
                if (context.Locations.Any())
                {
                    return; // DB has been seeded
                }

                context.Locations.AddRange(
                    new Location
                    {
                        Name = "Downtown Cinema",
                        Address = "123 Main St, Springfield"
                    },
                    new Location
                    {
                        Name = "Uptown Theater",
                        Address = "456 Elm St, Shelbyville"
                    },
                    new Location
                    {
                        Name = "Suburban Multiplex",
                        Address = "789 Broadway Ave, Metropolis"
                    }
                );

                context.SaveChanges();
            }
        }
    }
}

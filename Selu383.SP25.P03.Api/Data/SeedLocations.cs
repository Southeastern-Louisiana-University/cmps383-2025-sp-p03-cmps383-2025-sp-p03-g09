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
                // Remove invalid locations (if any exist without a valid ID)
                var invalidLocations = context.Locations.Where(l => l.Id <= 0).ToList();
                if (invalidLocations.Any())
                {
                    context.Locations.RemoveRange(invalidLocations);
                    context.SaveChanges();
                }

                // Clear existing locations before reseeding
                context.Locations.RemoveRange(context.Locations);
                context.SaveChanges();

                // Reset identity (SQL Server example)
                context.Database.ExecuteSqlRaw("DBCC CHECKIDENT ('Locations', RESEED, 0)");

                // Add new locations
                context.Locations.AddRange(
                    new Location
                    {
                        Name = "Lion's Den New York",
                        Address = "570 2nd Ave, New York, NY 10016"
                    },
                    new Location
                    {
                        Name = "Lion's Den New Orleans",
                        Address = "636 N Broad St, New Orleans, LA 70119"
                    },
                    new Location
                    {
                        Name = "Lion's Den Los Angeles",
                        Address = "4020 Marlton Ave, Los Angeles, CA 90008"
                    }
                );

                // Save changes to commit the new locations to the database
                context.SaveChanges();
            }
        }
    }
}

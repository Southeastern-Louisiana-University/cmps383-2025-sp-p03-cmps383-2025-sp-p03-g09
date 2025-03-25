using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.FoodItems;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedFoodItems
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
            {
                // Delete all existing food items first
                context.FoodItems.RemoveRange(context.FoodItems);

                // Reset the identity column to start from 1 (or the appropriate starting point)
                context.Database.ExecuteSqlRaw("DBCC CHECKIDENT ('FoodItems', RESEED, 0)");

                // Fetch all locations
                var locations = context.Locations.ToList();
                if (!locations.Any())
                {
                    throw new InvalidOperationException("No locations found to associate with food items.");
                }

                // Find the specific location
                var downtown = locations.FirstOrDefault(l => l.Name == "Downtown Cinema");

                // If the location doesn't exist, handle the error
                if (downtown == null)
                {
                    throw new InvalidOperationException("Location 'Downtown Cinema' not found.");
                }

                // Seed new food items
                context.FoodItems.AddRange(
                    new FoodItem
                    {
                        Name = "Popcorn",
                        Price = 5.99m,
                        Description = "Classic buttered popcorn.",
                        IsVegan = true,
                        ImageUrl = "https://i.imgur.com/CzDUZ7s.jpeg",
                        Location = downtown
                    },
                    new FoodItem
                    {
                        Name = "Nachos",
                        Price = 6.99m,
                        Description = "Cheesy nachos with jalapenos.",
                        IsVegan = false,
                        ImageUrl = "https://i.imgur.com/rGDhMHP.jpeg",
                        Location = downtown
                    },
                     new FoodItem
                     {
                         Name = "Soft Pretzel",
                         Price = 4.99m,
                         Description = "A warm, salted soft pretzel.",
                         IsVegan = true,
                         ImageUrl = "https://i.imgur.com/RYJEv4L.jpeg",
                         Location = downtown
                     }
                );

                // Save changes to the database
                context.SaveChanges();
            }
        }
    }
}

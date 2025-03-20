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
                if (context.FoodItems.Any())
                {
                    return; // DB has been seeded
                }

                var locations = context.Locations.ToList(); // Fetch all locations
                if (!locations.Any())
                {
                    throw new InvalidOperationException("No locations found to associate with food items.");
                }

                var downtown = locations.FirstOrDefault(l => l.Name == "Downtown Cinema");

                context.FoodItems.AddRange(
                    new FoodItem
                    {
                        Name = "Popcorn",
                        Price = 5.99m,
                        Description = "Classic buttered popcorn.",
                        IsVegan = true,
                        Location = downtown
                    }
                    // new FoodItem
                    // {
                    //     Name = "Nachos",
                    //     Price = 6.99m,
                    //     Description = "Cheesy nachos with jalapenos.",
                    //     IsVegan = false,
                    //     LocationId = 2
                    // }.
                    
                );

                context.SaveChanges();
            }
        }
    }
}

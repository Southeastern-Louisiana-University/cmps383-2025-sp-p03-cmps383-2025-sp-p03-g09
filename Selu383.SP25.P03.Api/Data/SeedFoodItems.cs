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
                // Look for any food items.
                if (context.FoodItems.Any())
                {
                    return; // DB has been seeded
                }

                context.FoodItems.AddRange(
                    new FoodItem
                    {
                        Name = "Popcorn",
                        Price = 5.99m,
                        Description = "Classic buttered popcorn.",
                        IsVegan = true,
                        LocationId = 1 // Assuming this corresponds to a seeded location
                    },
                    new FoodItem
                    {
                        Name = "Nachos",
                        Price = 6.99m,
                        Description = "Cheesy nachos with jalapenos.",
                        IsVegan = false,
                        LocationId = 2
                    },
                    new FoodItem
                    {
                        Name = "Soda",
                        Price = 2.99m,
                        Description = "Refreshing soft drink.",
                        IsVegan = true,
                        LocationId = 3
                    }
                );

                context.SaveChanges();
            }
        }
    }
}

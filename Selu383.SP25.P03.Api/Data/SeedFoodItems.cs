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
                // Wipe old data
                context.FoodItems.RemoveRange(context.FoodItems);
                context.Database.ExecuteSqlRaw("DBCC CHECKIDENT ('FoodItems', RESEED, 0)");

                var locations = context.Locations.ToList();
                if (!locations.Any())
                {
                    throw new InvalidOperationException("No locations found to associate with food items.");
                }

                var universalItems = new List<FoodItem>
                {
                    new() { Name = "Popcorn", Price = 5.99m, Description = "Classic buttered popcorn.", IsVegan = true, ImageUrl = "https://i.imgur.com/CzDUZ7s.jpeg" },
                    new() { Name = "Nachos", Price = 6.99m, Description = "Cheesy nachos with jalapenos.", IsVegan = false, ImageUrl = "https://i.imgur.com/rGDhMHP.jpeg" },
                    new() { Name = "Mozzarella Sticks", Price = 6.49m, Description = "Golden-fried and gooey inside. Served hot with marinara.", IsVegan = false, ImageUrl = "https://i.imgur.com/0A4JK0b.jpeg" },
                    new() { Name = "Buffalo Wings", Price = 7.99m, Description = "Crispy wings tossed in spicy buffalo sauce.", IsVegan = false, ImageUrl = "https://i.imgur.com/x8ycNs5.jpeg" },
                    new() { Name = "Soft Pretzel", Price = 4.99m, Description = "A warm, salted soft pretzel.", IsVegan = true, ImageUrl = "https://i.imgur.com/RYJEv4L.jpeg" },
                    new() { Name = "Coca-Cola", Price = 3.99m, Description = "The original ice-cold refreshing taste.", IsVegan = true, ImageUrl = "https://i.imgur.com/Hry2TEc.jpeg" },
                    new() { Name = "Diet Coke", Price = 3.99m, Description = "No sugar, same classic taste.", IsVegan = true, ImageUrl = "https://i.imgur.com/74OL4g5.jpeg" },
                    new() { Name = "Sprite", Price = 3.99m, Description = "Crisp lemon-lime soda.", IsVegan = true, ImageUrl = "https://i.imgur.com/h0uxM4W.jpeg" },
                    new() { Name = "Fanta Orange", Price = 3.99m, Description = "Fruity and sweet.", IsVegan = true, ImageUrl = "https://i.imgur.com/HFTgo4u.jpeg" },
                    new() { Name = "Minute Maid Lemonade", Price = 3.99m, Description = "Citrus blast of joy.", IsVegan = true, ImageUrl = "https://i.imgur.com/2L816jC.jpeg" },
                    new() { Name = "Barq's Root Beer", Price = 3.99m, Description = "Bold and bubbly root beer.", IsVegan = true, ImageUrl = "https://i.imgur.com/iFi42E3.jpeg" },
                    new() { Name = "Dr Pepper", Price = 3.99m, Description = "A signature blend of 23 flavors.", IsVegan = true, ImageUrl = "https://i.imgur.com/Yd6NaZh.jpeg" },
                    

                };

                foreach (var loc in locations)
                {
                    switch (loc.Name)
                    {
                        case "Lion's Den New Orleans":
                            context.FoodItems.AddRange(
                                new FoodItem
                                {
                                    Name = "Boudin Balls",
                                    Price = 5.49m,
                                    Description = "Fried balls of spicy Cajun sausage and rice.",
                                    IsVegan = false,
                                    ImageUrl = "https://i.imgur.com/L37ivuU.jpeg",
                                    Location = loc
                                },
                                new FoodItem
                                {
                                    Name = "Cajun Fries",
                                    Price = 3.99m,
                                    Description = "Seasoned fries with a kick.",
                                    IsVegan = true,
                                    ImageUrl = "https://i.imgur.com/hUOrzMw.jpeg",
                                    Location = loc
                                }
                            );
                            break;

                        case "Lion's Den New York":
                            context.FoodItems.AddRange(
                                new FoodItem
                                {
                                    Name = "New York Slice",
                                    Price = 5.99m,
                                    Description = "Classic thin-crust cheese pizza slice.",
                                    IsVegan = false,
                                    ImageUrl = "https://i.imgur.com/saw145c.jpeg",
                                    Location = loc
                                },
                                new FoodItem
                                {
                                    Name = "NYC Hot Dog",
                                    Price = 3.49m,
                                    Description = "Street cart style hot dog in a soft bun.",
                                    IsVegan = false,
                                    ImageUrl = "https://i.imgur.com/yCf8FfN.jpeg",
                                    Location = loc
                                }
                            );
                            break;

                        case "Lion's Den Los Angeles":
                            context.FoodItems.AddRange(
                                new FoodItem
                                {
                                    Name = "Avocado Toast Bites",
                                    Price = 6.49m,
                                    Description = "Mini toasts with avocado spread and chili flake.",
                                    IsVegan = true,
                                    ImageUrl = "https://i.imgur.com/HlNCoB6.jpeg",
                                    Location = loc
                                },
                                new FoodItem
                                {
                                    Name = "Sriracha Cauliflower Bites",
                                    Price = 5.49m,
                                    Description = "Spicy roasted cauliflower bites glazed with sriracha.",
                                    IsVegan = true,
                                    ImageUrl = "https://i.imgur.com/gaZbWVl.jpeg",
                                    Location = loc
                                }
                            );
                            break;
                    }

                    foreach (var baseItem in universalItems)
                    {
                        context.FoodItems.Add(new FoodItem
                        {
                            Name = baseItem.Name,
                            Price = baseItem.Price,
                            Description = baseItem.Description,
                            IsVegan = baseItem.IsVegan,
                            ImageUrl = baseItem.ImageUrl,
                            Location = loc
                        });
                    }
                }


                context.SaveChanges();
            }
        }
    }
}
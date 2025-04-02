using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Users;
using Selu383.SP25.P03.Api.Features.Theaters;

namespace Selu383.SP25.P03.Api.Features.Orders
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Order> Orders { get; set; }
        public DbSet<FoodItem> FoodItems { get; set; }
        public DbSet<User> Users { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<FoodItem>().HasData(
                new FoodItem { Id = 1, Name = "Large Popcorn", Description = "A large bucket of popcorn.", Price = 9.99m, Category = "Popcorn" },
                new FoodItem { Id = 2, Name = "Small Popcorn", Description = "A small bag of popcorn.", Price = 5.99m, Category = "Popcorn" },
                new FoodItem { Id = 3, Name = "Large drink", Description = "A large cup for a fountain drink.", Price = 4.99m, Category = "Drink" },
                new FoodItem { Id = 4, Name = "Small drink", Description = "A small cup for a fountain drink.", Price = 2.99m, Category = "Drink" },
                new FoodItem { Id = 5, Name = "Candy", Description = "A bag of candy. Several options available.", Price = 4.99m, Category = "Candy" },
                new FoodItem { Id = 6, Name = "Pretzel Bites", Description = "A box of pretzel bites. Comes with nacho cheese.", Price = 8.99m, Category = "Pretzel" }

            );

            modelBuilder.Entity<Order>().HasData(
                new Order { Id = 1, UserId = 1, Status = "Pending", OrderDate = DateTime.UtcNow, FoodItemIds = new List<int> { 1, 2 } }
            );
        }
    }
}

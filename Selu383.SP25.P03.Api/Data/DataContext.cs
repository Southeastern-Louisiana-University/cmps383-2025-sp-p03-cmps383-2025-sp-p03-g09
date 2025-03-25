using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Users;
using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Features.Seats;
using Selu383.SP25.P03.Api.Features.Movies;
using Selu383.SP25.P03.Api.Features.Tickets;
using Selu383.SP25.P03.Api.Features.Orders;
using Selu383.SP25.P03.Api.Features.FoodItems;
using Selu383.SP25.P03.Api.Features.OrderFoodItems;
using Selu383.SP25.P03.Api.Features.Payments;
using Selu383.SP25.P03.Api.Features.Locations;

namespace Selu383.SP25.P03.Api.Data
{
    public class DataContext : IdentityDbContext<User, Role, int, IdentityUserClaim<int>, UserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<Theater> Theaters { get; set; }
        public DbSet<Seat> Seats { get; set; }
        public DbSet<Movie> Movies { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<FoodItem> FoodItems { get; set; }
        public DbSet<OrderFoodItem> OrderFoodItems { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Location> Locations { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UserRole>().HasKey(x => new { x.UserId, x.RoleId });

            builder.Entity<User>()
                .HasMany(e => e.UserRoles)
                .WithOne(x => x.User)
                .HasForeignKey(e => e.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Role>()
                .HasMany(e => e.UserRoles)
                .WithOne(x => x.Role)
                .HasForeignKey(e => e.RoleId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Seat>()
                .HasOne(s => s.Theater)
                .WithMany(t => t.Seats)
                .HasForeignKey(s => s.TheaterId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Ticket>()
                .HasOne(t => t.Location)
                .WithMany()
                .HasForeignKey(t => t.LocationId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Ticket>()
                .HasOne(t => t.Theater)
                .WithMany()
                .HasForeignKey(t => t.TheaterId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Ticket>()
                .HasOne(t => t.Seat)
                .WithMany()
                .HasForeignKey(t => t.SeatId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Ticket>()
                .HasOne(t => t.Movie)
                .WithMany(m => m.Tickets)
                .HasForeignKey(t => t.MovieId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Order>()
                .HasOne(o => o.Theater)
                .WithMany()
                .HasForeignKey(o => o.TheaterId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Order>()
                .HasOne(o => o.Seat)
                .WithMany(s => s.Orders)
                .HasForeignKey(o => o.SeatId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<OrderFoodItem>().HasKey(ofi => new { ofi.OrderId, ofi.FoodItemId });

            builder.Entity<OrderFoodItem>()
                .HasOne(ofi => ofi.Order)
                .WithMany(o => o.OrderFoodItems)
                .HasForeignKey(ofi => ofi.OrderId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<OrderFoodItem>()
                .HasOne(ofi => ofi.FoodItem)
                .WithMany(fi => fi.OrderFoodItems)
                .HasForeignKey(ofi => ofi.FoodItemId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Payment>()
                .HasOne(p => p.Order)
                .WithMany()
                .HasForeignKey(p => p.OrderId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Payment>()
                .HasOne(p => p.User)
                .WithMany()
                .HasForeignKey(p => p.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<FoodItem>()
                .HasOne(fi => fi.Location)
                .WithMany()
                .HasForeignKey(fi => fi.LocationId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<FoodItem>()
                .Property(f => f.Price)
                .HasPrecision(18, 2);

            builder.Entity<Order>()
                .Property(o => o.Price)
                .HasPrecision(18, 2);

            builder.Entity<Payment>()
                .Property(p => p.Price)
                .HasPrecision(18, 2);

            builder.Entity<Ticket>()
                .Property(t => t.Price)
                .HasPrecision(18, 2);

            builder.Entity<Location>()
                .Property(l => l.Name)
                .HasMaxLength(120)
                .IsRequired();

            builder.Entity<Location>()
                .Property(l => l.Address)
                .IsRequired();

            builder.Entity<Theater>()
                .HasOne(t => t.Location)
                .WithMany(l => l.Theaters)
                .HasForeignKey(t => t.LocationId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}

using Selu383.SP25.P03.Api.Features.Users;
<<<<<<< HEAD
=======
using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Features.Seats;
using Selu383.SP25.P03.Api.Features.OrderFoodItems;
using System.ComponentModel.DataAnnotations;
>>>>>>> origin/master

namespace Selu383.SP25.P03.Api.Features.Orders
{
    public class Order
    {
        public int Id { get; set; }
<<<<<<< HEAD
        public int UserId { get; set; }
        public List<int>? FoodItemIds { get; set; }
        public DateTime OrderDate { get; set; }
        public string? Status { get; set; } 
        // The ?'s should allow the options to be null so that the user is not forced to buy.
    }

        public class FoodItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Category { get; set; }        
        public string Description { get; set; }
    }
}
=======
        public decimal Price { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int TheaterId { get; set; }
        public Theater Theater { get; set; }
        public int SeatId { get; set; }
        public Seat Seat { get; set; }
        public ICollection<OrderFoodItem> OrderFoodItems { get; set; } = new List<OrderFoodItem>();
    }
}
>>>>>>> origin/master

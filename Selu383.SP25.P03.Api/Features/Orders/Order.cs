using Selu383.SP25.P03.Api.Features.Users;
using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Features.Seats;
using Selu383.SP25.P03.Api.Features.OrderFoodItems;
using System.ComponentModel.DataAnnotations;

namespace Selu383.SP25.P03.Api.Features.Orders
{
    public class Order
    {
        public int Id { get; set; }
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

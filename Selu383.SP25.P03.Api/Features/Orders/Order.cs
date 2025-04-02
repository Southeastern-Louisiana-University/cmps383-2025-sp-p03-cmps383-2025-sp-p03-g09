using Selu383.SP25.P03.Api.Features.Users;

namespace Selu383.SP25.P03.Api.Features.Orders
{
    public class Order
    {
        public int Id { get; set; }
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
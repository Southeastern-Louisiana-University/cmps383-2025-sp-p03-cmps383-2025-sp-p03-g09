namespace Selu383.SP25.P03.Api.Features.Orders
{
    public class OrderDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public List<int>? FoodItemIds { get; set; }
         public DateTime OrderDate { get; set; }
        public string? Status { get; set; } 
    }
}

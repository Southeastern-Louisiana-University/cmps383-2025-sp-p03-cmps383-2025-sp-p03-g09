namespace Selu383.SP25.P03.Api.Features.Orders
{
    public class OrderDto
    {
        public int Id { get; set; }
        public decimal Price { get; set; }
        public int UserId { get; set; }
        public int TheaterId { get; set; }
        public int SeatId { get; set; }
        public List<int> FoodItemIds { get; set; } = new List<int>();
    }
}

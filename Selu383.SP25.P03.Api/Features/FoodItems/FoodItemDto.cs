namespace Selu383.SP25.P03.Api.Features.FoodItems
{
    public class FoodItemDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public decimal Price { get; set; }
        public required string Description { get; set; }
        public bool IsVegan { get; set; }
        public int LocationId { get; set; }
    }
}

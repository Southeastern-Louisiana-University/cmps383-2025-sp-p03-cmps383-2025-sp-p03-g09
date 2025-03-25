using Selu383.SP25.P03.Api.Features.Locations;
using Selu383.SP25.P03.Api.Features.OrderFoodItems;
using System.ComponentModel.DataAnnotations;

namespace Selu383.SP25.P03.Api.Features.FoodItems
{
    public class FoodItem
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public decimal Price { get; set; }
        public required string Description { get; set; }
        public bool IsVegan { get; set; }
        public required string ImageUrl { get; set; }
        public int LocationId { get; set; }
        public Location Location { get; set; }
        public ICollection<OrderFoodItem> OrderFoodItems { get; set; } = new List<OrderFoodItem>();
    }
}

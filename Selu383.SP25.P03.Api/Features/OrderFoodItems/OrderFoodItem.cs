using Selu383.SP25.P03.Api.Features.Orders;
using Selu383.SP25.P03.Api.Features.FoodItems;

namespace Selu383.SP25.P03.Api.Features.OrderFoodItems
{
    public class OrderFoodItem
    {
        public int Id { get; set; }

        public int OrderId { get; set; }
        public Order Order { get; set; }

        public int FoodItemId { get; set; }
        public FoodItem FoodItem { get; set; }
    }
}

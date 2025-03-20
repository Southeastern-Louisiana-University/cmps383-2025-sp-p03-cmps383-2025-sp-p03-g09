using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Orders;
using Selu383.SP25.P03.Api.Features.FoodItems;
using Selu383.SP25.P03.Api.Features.OrderFoodItems;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/orders")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly DbSet<Order> orders;
        private readonly DbSet<FoodItem> foodItems;
        private readonly DbSet<OrderFoodItem> orderFoodItems;
        private readonly DataContext dataContext;

        public OrdersController(DataContext dataContext)
        {
            this.dataContext = dataContext;
            orders = dataContext.Set<Order>();
            foodItems = dataContext.Set<FoodItem>();
            orderFoodItems = dataContext.Set<OrderFoodItem>();
        }

        [HttpGet]
        public IQueryable<OrderDto> GetAllOrders()
        {
            return GetOrderDtos(orders);
        }

        [HttpGet]
        [Route("{id}")]
        public ActionResult<OrderDto> GetOrderById(int id)
        {
            var result = GetOrderDtos(orders.Where(x => x.Id == id)).FirstOrDefault();
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        public ActionResult<OrderDto> CreateOrder(OrderDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest();
            }

            var order = new Order
            {
                Price = dto.Price,
                UserId = dto.UserId,
                TheaterId = dto.TheaterId,
                SeatId = dto.SeatId
            };

            orders.Add(order);
            dataContext.SaveChanges();

            foreach (var foodItemId in dto.FoodItemIds)
            {
                var foodItem = foodItems.FirstOrDefault(x => x.Id == foodItemId);
                if (foodItem != null)
                {
                    var orderFoodItem = new OrderFoodItem
                    {
                        OrderId = order.Id,
                        FoodItemId = foodItem.Id
                    };
                    orderFoodItems.Add(orderFoodItem);
                }
            }

            dataContext.SaveChanges();

            dto.Id = order.Id;

            return CreatedAtAction(nameof(GetOrderById), new { id = dto.Id }, dto);
        }

        [HttpPut]
        [Route("{id}")]
        [Authorize]
        public ActionResult<OrderDto> UpdateOrder(int id, OrderDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest();
            }

            var order = orders.Include(o => o.OrderFoodItems).FirstOrDefault(x => x.Id == id);
            if (order == null)
            {
                return NotFound();
            }

            order.Price = dto.Price;
            order.UserId = dto.UserId;
            order.TheaterId = dto.TheaterId;
            order.SeatId = dto.SeatId;

            orderFoodItems.RemoveRange(order.OrderFoodItems);
            foreach (var foodItemId in dto.FoodItemIds)
            {
                var foodItem = foodItems.FirstOrDefault(x => x.Id == foodItemId);
                if (foodItem != null)
                {
                    var orderFoodItem = new OrderFoodItem
                    {
                        OrderId = order.Id,
                        FoodItemId = foodItem.Id
                    };
                    orderFoodItems.Add(orderFoodItem);
                }
            }

            dataContext.SaveChanges();

            dto.Id = order.Id;

            return Ok(dto);
        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize(Roles = Features.Users.UserRoleNames.Admin)]
        public ActionResult DeleteOrder(int id)
        {
            var order = orders.FirstOrDefault(x => x.Id == id);
            if (order == null)
            {
                return NotFound();
            }

            orderFoodItems.RemoveRange(order.OrderFoodItems);
            orders.Remove(order);
            dataContext.SaveChanges();

            return Ok();
        }

        private bool IsInvalid(OrderDto dto)
        {
            return dto.Price <= 0 ||
                   dto.UserId <= 0 ||
                   dto.TheaterId <= 0 ||
                   dto.SeatId <= 0 ||
                   !dto.FoodItemIds.Any();
        }

        private static IQueryable<OrderDto> GetOrderDtos(IQueryable<Order> orders)
        {
            return orders
                .Select(x => new OrderDto
                {
                    Id = x.Id,
                    Price = x.Price,
                    UserId = x.UserId,
                    TheaterId = x.TheaterId,
                    SeatId = x.SeatId,
                    FoodItemIds = x.OrderFoodItems.Select(ofi => ofi.FoodItemId).ToList()
                });
        }
    }
}

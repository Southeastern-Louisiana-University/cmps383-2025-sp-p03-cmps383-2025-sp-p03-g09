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
            Console.WriteLine("Received order payload:");
            Console.WriteLine($"Price: {dto.Price}, UserId: {dto.UserId}, TheaterId: {dto.TheaterId}, SeatId: {dto.SeatId}, FoodItemIds: {string.Join(", ", dto.FoodItemIds)}");

            if (IsInvalid(dto))
            {
                Console.WriteLine("Invalid order data:");
                Console.WriteLine($"Price: {dto.Price}, UserId: {dto.UserId}, TheaterId: {dto.TheaterId}, SeatId: {dto.SeatId}, FoodItemIds: {string.Join(", ", dto.FoodItemIds)}");
                return BadRequest(new { Message = "Invalid order data provided." });
            }

            try
            {
                var order = new Order
                {
                    Price = dto.Price,
                    UserId = dto.UserId,
                    TheaterId = dto.TheaterId,
                    SeatId = dto.SeatId
                };

                orders.Add(order);
                dataContext.SaveChanges(); // Save the order to generate its ID

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
                    else
                    {
                        Console.WriteLine($"Food item with ID {foodItemId} not found.");
                    }
                }

                dataContext.SaveChanges(); // Save the associated food items

                dto.Id = order.Id;

                return CreatedAtAction(nameof(GetOrderById), new { id = dto.Id }, dto);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error creating order:");
                Console.WriteLine(ex); // Log the full exception details
                return StatusCode(500, new { Message = "An error occurred while creating the order." });
            }
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

        [HttpGet]
        [Route("user")]
        [Authorize]
        public async Task<ActionResult<List<OrderDto>>> GetOrdersForUser()
        {
            try
            {
                var currentUser = await dataContext.Users.FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);
                if (currentUser == null)
                {
                    return Unauthorized(new { Message = "User not found." });
                }

                var userOrders = await orders
                    .Where(o => o.UserId == currentUser.Id)
                    .Select(o => new OrderDto
                    {
                        Id = o.Id,
                        Price = o.Price,
                        UserId = o.UserId,
                        TheaterId = o.TheaterId,
                        SeatId = o.SeatId,
                        FoodItemIds = o.OrderFoodItems.Select(ofi => ofi.FoodItemId).ToList()
                    })
                    .ToListAsync();

                return Ok(userOrders);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error fetching user orders:", ex);
                return StatusCode(500, new { Message = "An error occurred while fetching orders." });
            }
        }

        private bool IsInvalid(OrderDto dto)
{
                if (dto.Price <= 0)
                {
                    Console.WriteLine("❌ [LOG] Invalid order: Price must be > 0");
                    return true;
                }
                if (dto.UserId <= 0)
                {
                    Console.WriteLine("❌ [LOG] Invalid order: UserId must be > 0");
                    return true;
                }
                if (dto.TheaterId <= 0)
                {
                    Console.WriteLine("❌ [LOG] Invalid order: TheaterId must be > 0");
                    return true;
                }
                if (dto.SeatId <= 0)
                {
                    Console.WriteLine("❌ [LOG] Invalid order: SeatId must be > 0");
                    return true;
                }
                return false;
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

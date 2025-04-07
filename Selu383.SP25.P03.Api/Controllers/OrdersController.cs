using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.OrderFoodItems;
using Selu383.SP25.P03.Api.Features.Orders;
using Selu383.SP25.P03.Api.Features.Tickets;
using System.Text.Json;

namespace Selu383.SP25.P03.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly DataContext context;

        public OrdersController(DataContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public IQueryable<OrderDto> GetAll()
        {
            return context.Orders
                .Include(o => o.OrderFoodItems)
                .Select(o => new OrderDto
                {
                    Id = o.Id,
                    Price = o.Price,
                    UserId = o.UserId,
                    TheaterId = o.TheaterId,
                    SeatId = o.SeatId,
                    TicketId = o.TicketId,
                    FoodItemIds = o.OrderFoodItems.Select(of => of.FoodItemId).ToList(),
                    PurchaseTime = o.PurchaseTime
                });
        }

        [HttpGet("user")]
public async Task<ActionResult<IEnumerable<object>>> GetOrdersForUser()
{
    var user = await context.Users
        .Include(u => u.Orders)
            .ThenInclude(o => o.OrderFoodItems)
                .ThenInclude(of => of.FoodItem)
        .Include(u => u.Orders)
            .ThenInclude(o => o.Ticket)
                .ThenInclude(t => t.Movie)
        .Include(u => u.Orders)
            .ThenInclude(o => o.Ticket)
                .ThenInclude(t => t.Location)
        .FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);

    if (user == null)
    {
        return Unauthorized();
    }

    var orders = user.Orders.Select(o => new
    {
        o.Id,
        o.Price,
        o.UserId,
        o.TheaterId,
        o.SeatId,
        o.TicketId,
        o.PurchaseTime,
        Ticket = o.Ticket == null ? null : new
        {
            o.Ticket.Id,
            o.Ticket.Showtime,
            Movie = o.Ticket.Movie == null ? null : new
            {
                o.Ticket.Movie.Title
            },
            Location = o.Ticket.Location == null ? null : new
            {
                o.Ticket.Location.Name
            }
        },
        FoodItems = o.OrderFoodItems.Select(of => new
        {
            of.FoodItemId,
            of.FoodItem.Name,
            of.FoodItem.Price,
            Quantity = 1
        }).ToList()
    }).ToList();

    return Ok(orders);
}



        [HttpPost]
        public async Task<IActionResult> CreateOrder()
        {
            using var reader = new StreamReader(Request.Body);
            var body = await reader.ReadToEndAsync();
            var json = JsonDocument.Parse(body).RootElement;

            if (!json.TryGetProperty("movieId", out var movieIdProp) ||
                !json.TryGetProperty("locationId", out var locationIdProp) ||
                !json.TryGetProperty("showtime", out var showtimeProp))
            {
                return BadRequest("Missing required ticket creation fields.");
            }

            var movieId = movieIdProp.GetInt32();
            var locationId = locationIdProp.GetInt32();
            var showtime = showtimeProp.GetString();

            var dto = JsonSerializer.Deserialize<OrderDto>(body, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (dto == null)
            {
                return BadRequest("Invalid order format.");
            }

            // 🎯 Pick the first available unused seat
            var usedSeatIds = await context.Tickets.Select(t => t.SeatId).ToListAsync();
            var seat = await context.Seats.FirstOrDefaultAsync(s => !usedSeatIds.Contains(s.Id));

            if (seat == null)
            {
                return BadRequest("No available seats.");
            }

            // 🏛️ Pick the first available theater (can be randomized if needed)
            var theater = await context.Theaters.FirstOrDefaultAsync();
            if (theater == null)
            {
                return BadRequest("No theaters available.");
            }

            // 🎟️ Create ticket
            var ticket = new Ticket
            {
                MovieId = movieId,
                LocationId = locationId,
                TheaterId = theater.Id,
                SeatId = seat.Id,
                Price = dto.Price,
                Showtime = showtime ?? "UNKNOWN"
            };

            context.Tickets.Add(ticket);
            await context.SaveChangesAsync();

          
var order = new Order
{
    Price = dto.Price,
    UserId = dto.UserId,
    TheaterId = ticket.TheaterId,
    SeatId = ticket.SeatId,
    TicketId = ticket.Id,
    PurchaseTime = DateTime.UtcNow,
    OrderFoodItems = dto.FoodItemIds != null
        ? dto.FoodItemIds.Select(id => new OrderFoodItem { FoodItemId = id }).ToList()
        : new List<OrderFoodItem>()
};


            context.Orders.Add(order);
            await context.SaveChangesAsync();

            return Ok(new
{
    order.Id,
    seatId = order.SeatId,
    theaterId = order.TheaterId
});
        }
    }
}

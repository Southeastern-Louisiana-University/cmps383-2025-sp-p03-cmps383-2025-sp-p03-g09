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

            var orders = user.Orders.Select(o =>
            {
                var allMatchingTickets = context.Tickets
                    .Where(t =>
                        t.TheaterId == o.TheaterId &&
                        t.Showtime == o.Ticket.Showtime &&
                        t.MovieId == o.Ticket.MovieId &&
                        t.LocationId == o.Ticket.LocationId &&
                        t.Price == 12.99m
                    )
                    .Select(t => t.SeatId)
                    .ToList();

                var foodItemsGrouped = o.OrderFoodItems
                    .GroupBy(of => new { of.FoodItemId, of.FoodItem.Name, of.FoodItem.Price })
                    .Select(g => new
                    {
                        g.Key.FoodItemId,
                        Name = g.Key.Name,
                        Price = g.Key.Price,
                        Quantity = g.Count()
                    }).ToList();

                return new
                {
                    o.Id,
                    o.Price,
                    o.UserId,
                    o.TheaterId,
                    SeatIds = allMatchingTickets,
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
                    FoodItems = foodItemsGrouped
                };
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
        !json.TryGetProperty("showtime", out var showtimeProp) ||
        !json.TryGetProperty("ticketQuantity", out var ticketQtyProp))
    {
        return BadRequest("Missing required ticket creation fields.");
    }

    var movieId = movieIdProp.GetInt32();
    var locationId = locationIdProp.GetInt32();
    var showtime = showtimeProp.GetString();
    var ticketQuantity = ticketQtyProp.GetInt32(); // 💥 Use real value

    var dto = JsonSerializer.Deserialize<OrderDto>(body, new JsonSerializerOptions
    {
        PropertyNameCaseInsensitive = true
    });

    if (dto == null)
    {
        return BadRequest("Invalid order format.");
    }

    // 🪑 Get available seats
    var usedSeatIds = await context.Tickets.Select(t => t.SeatId).ToListAsync();
    var availableSeats = await context.Seats
        .Where(s => !usedSeatIds.Contains(s.Id))
        .Take(ticketQuantity)
        .ToListAsync();

    if (availableSeats.Count < ticketQuantity)
    {
        return BadRequest("Not enough available seats.");
    }

    // 🎭 Get theater
    var theater = await context.Theaters.FirstOrDefaultAsync();
    if (theater == null)
    {
        return BadRequest("No theaters available.");
    }

    // 🎟️ Create multiple tickets
    var ticketUnitPrice = 12.99m;
    var tickets = availableSeats.Select(seat => new Ticket
    {
        MovieId = movieId,
        LocationId = locationId,
        TheaterId = theater.Id,
        SeatId = seat.Id,
        Price = ticketUnitPrice,
        Showtime = showtime ?? "UNKNOWN"
    }).ToList();

    context.Tickets.AddRange(tickets);
    await context.SaveChangesAsync();

    // 📦 Create one order for the first ticket
    var order = new Order
    {
        Price = dto.Price,
        UserId = dto.UserId,
        TheaterId = theater.Id,
        SeatId = tickets[0].SeatId,
        TicketId = tickets[0].Id,
        PurchaseTime = DateTime.UtcNow
    };

    context.Orders.Add(order);
    await context.SaveChangesAsync();

    // 🍿 Add unique food items only (quantity handled client-side)
    var uniqueFoodItemIds = dto.FoodItemIds.Distinct();
    var orderFoodItems = uniqueFoodItemIds
        .Select(id => new OrderFoodItem
        {
            OrderId = order.Id,
            FoodItemId = id
        })
        .ToList();

    context.OrderFoodItems.AddRange(orderFoodItems);
    await context.SaveChangesAsync();

    return Ok(new
    {
        order.Id,
        theaterId = theater.Id,
        seatIds = tickets.Select(t => t.SeatId).ToList()
    });
}


    }
}

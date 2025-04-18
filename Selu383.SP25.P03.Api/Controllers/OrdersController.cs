using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.OrderFoodItems;
using Selu383.SP25.P03.Api.Features.Orders;
using Selu383.SP25.P03.Api.Features.Tickets;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;


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
                var allMatchingTickets = new List<object>();
if (o.TicketId != 0)
{
    var matchingTickets = context.Tickets
    .Include(t => t.Seat)
    .Where(t =>
        t.MovieId == o.Ticket.MovieId &&
        t.LocationId == o.Ticket.LocationId &&
        t.Showtime == o.Ticket.Showtime &&
        t.TheaterId == o.TheaterId
    )
    .ToList();



foreach (var ticket in matchingTickets)
{
    if (ticket.Seat != null)
    {
        allMatchingTickets.Add(new
        {
            ticket.SeatId,
            Row = ticket.Seat.Row,
            Column = ticket.Seat.Column
        });
    }
}

}



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
                    Seats = allMatchingTickets,
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

  [HttpGet("guest/{guestId}")]
public async Task<ActionResult<IEnumerable<object>>> GetOrdersForGuest(string guestId)
{
    try
    {
        var orders = await context.Orders
            .Where(o => o.GuestId == guestId)
            .Include(o => o.OrderFoodItems)
                .ThenInclude(of => of.FoodItem)
            .Include(o => o.Ticket)
                .ThenInclude(t => t.Movie)
            .Include(o => o.Ticket)
                .ThenInclude(t => t.Location)
            .Include(o => o.Ticket)
                .ThenInclude(t => t.Seat)
            .ToListAsync();

        var guestOrders = orders.Select(o =>
        {
            var matchingTickets = context.Tickets
    .Include(t => t.Seat)
    .Where(t =>
        t.MovieId == o.Ticket.MovieId &&
        t.LocationId == o.Ticket.LocationId &&
        t.Showtime == o.Ticket.Showtime &&
        t.TheaterId == o.TheaterId
    )
    .ToList();



var seatList = matchingTickets
    .Where(t => t.Seat != null)
    .Select(t => new
    {
        SeatId = t.Seat.Id,
        Row = t.Seat.Row,
        Column = t.Seat.Column
    })
    .ToList();


            var foodItems = new List<object>();

if (o.OrderFoodItems != null)
{
    foodItems = o.OrderFoodItems
        .Where(of => of.FoodItem != null)
        .GroupBy(of => new { of.FoodItem.Id, of.FoodItem.Name, of.FoodItem.Price })
        .Select(g => (object)new
        {
            FoodItemId = g.Key.Id,
            Name = g.Key.Name,
            Price = g.Key.Price,
            Quantity = g.Count()
        })
        .ToList();
}


            return new
            {
                o.Id,
                o.Price,
                o.UserId,
                o.TheaterId,
                Seats = seatList,
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
                FoodItems = foodItems
            };
        });

        return Ok(guestOrders);
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"SERVER EXPLODED:\n{ex.Message}\n\n{ex.StackTrace}");
    }
}






        [HttpPost]
[AllowAnonymous]
public async Task<IActionResult> CreateOrder()
{
    using var reader = new StreamReader(Request.Body);
    var body = await reader.ReadToEndAsync();
    var json = JsonDocument.Parse(body).RootElement;

    if (!json.TryGetProperty("movieId", out var movieIdProp) ||
        !json.TryGetProperty("locationId", out var locationIdProp) ||
        !json.TryGetProperty("showtime", out var showtimeProp) ||
        !json.TryGetProperty("seatIds", out var seatIdsProp) ||
        !seatIdsProp.EnumerateArray().Any())
    {
        return BadRequest("Missing required ticket info, including seat IDs.");
    }

    var movieId = movieIdProp.GetInt32();
    var locationId = locationIdProp.GetInt32();
    var showtime = showtimeProp.GetString();
    var seatIds = seatIdsProp.EnumerateArray().Select(x => x.GetInt32()).ToList();

    var dto = JsonSerializer.Deserialize<OrderDto>(body, new JsonSerializerOptions
    {
        PropertyNameCaseInsensitive = true
    });

    if (dto == null)
    {
        return BadRequest("Invalid order format.");
    }

    if (dto.UserId == null && !Request.Headers.ContainsKey("X-Guest-ID"))
    {
        return Unauthorized("Missing user or guest identity.");
    }

    var theater = await context.Theaters.FirstOrDefaultAsync(t => t.Id == dto.TheaterId);
    if (theater == null)
    {
        return BadRequest($"No theater found with ID {dto.TheaterId}.");
    }

    var alreadyTaken = await context.Tickets
        .Where(t => seatIds.Contains(t.SeatId))
        .Select(t => t.SeatId)
        .ToListAsync();

    var unavailable = seatIds.Intersect(alreadyTaken).ToList();
    if (unavailable.Any())
    {
        return BadRequest($"These seats are already reserved: {string.Join(", ", unavailable)}");
    }

    var ticketUnitPrice = 12.99m;
    var newTickets = seatIds.Select(sid => new Ticket
    {
        MovieId = movieId,
        LocationId = locationId,
        TheaterId = theater.Id,
        SeatId = sid,
        Price = ticketUnitPrice,
        Showtime = showtime ?? "UNKNOWN"
    }).ToList();

    context.Tickets.AddRange(newTickets);
    await context.SaveChangesAsync();

    var guestId = Request.Headers.ContainsKey("X-Guest-ID")
        ? Request.Headers["X-Guest-ID"].ToString()
        : null;

    var sharedTime = DateTime.UtcNow;

    var ordersToCreate = new List<Order>();
    foreach (var tk in newTickets)
    {
        ordersToCreate.Add(new Order
        {
            Price = dto.Price,
            UserId = dto.UserId,
            GuestId = guestId,
            TheaterId = theater.Id,
            SeatId = tk.SeatId,
            TicketId = tk.Id,
            PurchaseTime = sharedTime
        });
    }

    context.Orders.AddRange(ordersToCreate);
    await context.SaveChangesAsync();

    var orderFoodItems = dto.FoodItemIds
        .Select(fid => new OrderFoodItem
        {
            OrderId = ordersToCreate[0].Id,
            FoodItemId = fid
        }).ToList();

    context.OrderFoodItems.AddRange(orderFoodItems);
    await context.SaveChangesAsync();

    return Ok(new
    {
        orders = ordersToCreate.Select(o => o.Id).ToList(),
        theaterId = theater.Id,
        seatIds = newTickets.Select(t => t.SeatId).ToList()
    });
}
}

}

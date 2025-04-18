using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Seats;
using Selu383.SP25.P03.Api.Features.Tickets;
using Selu383.SP25.P03.Api.Features.Users;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/tickets")]
    [ApiController]
    public class TicketsController : ControllerBase
    {
        private readonly DbSet<Ticket> tickets;
        private readonly DbSet<Seat> seats;
        private readonly DataContext dataContext;
        private readonly UserManager<User> userManager;

        public TicketsController(DataContext dataContext, UserManager<User> userManager)
        {
            this.dataContext = dataContext;
            this.userManager = userManager;
            tickets = dataContext.Set<Ticket>();
            seats = dataContext.Set<Seat>();
        }

        [HttpGet]
        public IQueryable<TicketDto> GetAllTickets()
        {
            return GetTicketDtos(tickets);
        }

        [HttpGet("{id}")]
        public ActionResult<TicketDto> GetTicketById(int id)
        {
            var result = GetTicketDtos(tickets.Where(x => x.Id == id)).FirstOrDefault();
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }



        [HttpGet("byshowtime")]
public async Task<ActionResult<IEnumerable<object>>> GetTicketsByShowtime(
    [FromQuery] int movieId,
    [FromQuery] int locationId,
    [FromQuery] string showtime)
{
    var ticketsForShowtime = await tickets
        .Where(t =>
            t.MovieId == movieId &&
            t.LocationId == locationId &&
            t.Showtime == showtime)
        .Select(t => new
        {
            t.SeatId
        })
        .ToListAsync();
foreach (var t in ticketsForShowtime)
{
    Console.WriteLine($" - SeatId: {t.SeatId}");
}


    return Ok(ticketsForShowtime);
}


        [HttpPost]
[AllowAnonymous]
public async Task<ActionResult<TicketDto>> CreateTicket(TicketDto dto)
{
    if (IsInvalid(dto))
    {
        return BadRequest("Invalid ticket data.");
    }

    var seat = await seats.FirstOrDefaultAsync(s => s.Id == dto.SeatId);
    if (seat == null)
    {
        return BadRequest($"Seat with ID {dto.SeatId} does not exist.");
    }

    var seatTaken = await tickets.AnyAsync(t =>
        t.SeatId == dto.SeatId &&
        t.Showtime == dto.Showtime &&
        t.TheaterId == dto.TheaterId &&
        t.LocationId == dto.LocationId &&
        t.MovieId == dto.MovieId
    );

    if (seatTaken)
    {
        return Conflict("That seat is already taken for this showtime.");
    }

    var ticket = new Ticket
    {
        Price = dto.Price,
        LocationId = dto.LocationId,
        TheaterId = dto.TheaterId,
        SeatId = dto.SeatId,
        MovieId = dto.MovieId,
        Showtime = dto.Showtime
    };

    tickets.Add(ticket);
    await dataContext.SaveChangesAsync();

    dto.Id = ticket.Id;
    return CreatedAtAction(nameof(GetTicketById), new { id = dto.Id }, dto);
}


        [HttpPut("{id}")]
        [Authorize(Roles = UserRoleNames.Admin)]
        public ActionResult<TicketDto> UpdateTicket(int id, TicketDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest("Invalid ticket data.");
            }

            var ticket = tickets.FirstOrDefault(x => x.Id == id);
            if (ticket == null)
            {
                return NotFound();
            }

            var seat = seats.FirstOrDefault(s => s.Id == dto.SeatId);
            if (seat == null)
            {
                return BadRequest($"Seat with ID {dto.SeatId} does not exist.");
            }

            var conflictingTicket = tickets
                .FirstOrDefault(t => t.SeatId == dto.SeatId && t.Showtime == dto.Showtime && t.Id != id);
            if (conflictingTicket != null)
            {
                return Conflict("Another ticket already exists for that seat and showtime.");
            }

            ticket.Price = dto.Price;
            ticket.LocationId = dto.LocationId;
            ticket.TheaterId = dto.TheaterId;
            ticket.SeatId = dto.SeatId;
            ticket.MovieId = dto.MovieId;
            ticket.Showtime = dto.Showtime;


            dataContext.SaveChanges();
            dto.Id = ticket.Id;

            return Ok(dto);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = UserRoleNames.Admin)]
        public ActionResult DeleteTicket(int id)
        {
            var ticket = tickets.FirstOrDefault(x => x.Id == id);
            if (ticket == null)
            {
                return NotFound();
            }

            var seat = seats.FirstOrDefault(s => s.Id == ticket.SeatId);
            
            tickets.Remove(ticket);
            dataContext.SaveChanges();

            return Ok();
        }

        private bool IsInvalid(TicketDto dto)
        {
            return dto.Price <= 0 ||
                   dto.LocationId <= 0 ||
                   dto.TheaterId <= 0 ||
                   dto.SeatId <= 0 ||
                   dto.MovieId <= 0 ||
                   string.IsNullOrWhiteSpace(dto.Showtime);
        }

        private static IQueryable<TicketDto> GetTicketDtos(IQueryable<Ticket> tickets)
        {
            return tickets
                .Select(x => new TicketDto
                {
                    Id = x.Id,
                    Price = x.Price,
                    LocationId = x.LocationId,
                    TheaterId = x.TheaterId,
                    SeatId = x.SeatId,
                    MovieId = x.MovieId,
                    Showtime = x.Showtime
                });
        }

        [HttpGet("taken")]
public async Task<ActionResult<IEnumerable<int>>> GetTakenSeatIds(
    [FromQuery] int theaterId,
    [FromQuery] string showtime)
{
    var takenSeatIds = await tickets
        .Where(t =>
            t.TheaterId == theaterId &&
            t.Showtime == showtime)
        .Select(t => t.SeatId)
        .ToListAsync();

    return Ok(takenSeatIds);
}


    }
}

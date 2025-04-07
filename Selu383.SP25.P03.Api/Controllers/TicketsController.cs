using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Tickets;
using Selu383.SP25.P03.Api.Features.Seats;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/tickets")]
    [ApiController]
    public class TicketsController : ControllerBase
    {
        private readonly DbSet<Ticket> tickets;
        private readonly DbSet<Seat> seats;
        private readonly DataContext dataContext;

        public TicketsController(DataContext dataContext)
        {
            this.dataContext = dataContext;
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

        [HttpPost]
        [Authorize(Roles = Features.Users.UserRoleNames.Admin)]
        public ActionResult<TicketDto> CreateTicket(TicketDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest("Invalid ticket data.");
            }

            var seat = seats.FirstOrDefault(s => s.Id == dto.SeatId);
            if (seat == null)
            {
                return BadRequest($"Seat with ID {dto.SeatId} does not exist.");
            }

            var seatTaken = tickets.Any(t => t.SeatId == dto.SeatId && t.Showtime == dto.Showtime);
            if (seatTaken)
            {
                return Conflict("That seat is already taken for this showtime. Try again, clown.");
            }

            if (seat.IsReserved)
            {
                return Conflict("Seat is already reserved. Better luck next time.");
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
            seat.IsReserved = true;
            dataContext.SaveChanges();

            dto.Id = ticket.Id;

            return CreatedAtAction(nameof(GetTicketById), new { id = dto.Id }, dto);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = Features.Users.UserRoleNames.Admin)]
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

            // Ensure seat exists
            var seat = seats.FirstOrDefault(s => s.Id == dto.SeatId);
            if (seat == null)
            {
                return BadRequest($"Seat with ID {dto.SeatId} does not exist.");
            }

            // Prevent seat reassignment to already taken seat
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

            seat.IsReserved = true;

            dataContext.SaveChanges();
            dto.Id = ticket.Id;

            return Ok(dto);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = Features.Users.UserRoleNames.Admin)]
        public ActionResult DeleteTicket(int id)
        {
            var ticket = tickets.FirstOrDefault(x => x.Id == id);
            if (ticket == null)
            {
                return NotFound();
            }

            var seat = seats.FirstOrDefault(s => s.Id == ticket.SeatId);
            if (seat != null)
            {
                seat.IsReserved = false;
            }

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
    }
}

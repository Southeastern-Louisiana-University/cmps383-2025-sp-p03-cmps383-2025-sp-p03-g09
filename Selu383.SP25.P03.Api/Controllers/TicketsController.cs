using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Tickets;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/tickets")]
    [ApiController]
    public class TicketsController : ControllerBase
    {
        private readonly DbSet<Ticket> tickets;
        private readonly DataContext dataContext;

        public TicketsController(DataContext dataContext)
        {
            this.dataContext = dataContext;
            tickets = dataContext.Set<Ticket>();
        }

        [HttpGet]
        public IQueryable<TicketDto> GetAllTickets()
        {
            return GetTicketDtos(tickets);
        }

        [HttpGet]
        [Route("{id}")]
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
        [Authorize(Roles = UserRoleNames.Admin)]
        public ActionResult<TicketDto> CreateTicket(TicketDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest();
            }

            var ticket = new Ticket
            {
                Price = dto.Price,
                LocationId = dto.LocationId,
                TheaterId = dto.TheaterId,
                SeatId = dto.SeatId,
                MovieId = dto.MovieId
            };
            tickets.Add(ticket);

            dataContext.SaveChanges();

            dto.Id = ticket.Id;

            return CreatedAtAction(nameof(GetTicketById), new { id = dto.Id }, dto);
        }

        [HttpPut]
        [Route("{id}")]
        [Authorize(Roles = UserRoleNames.Admin)]
        public ActionResult<TicketDto> UpdateTicket(int id, TicketDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest();
            }

            var ticket = tickets.FirstOrDefault(x => x.Id == id);
            if (ticket == null)
            {
                return NotFound();
            }

            ticket.Price = dto.Price;
            ticket.LocationId = dto.LocationId;
            ticket.TheaterId = dto.TheaterId;
            ticket.SeatId = dto.SeatId;
            ticket.MovieId = dto.MovieId;

            dataContext.SaveChanges();

            dto.Id = ticket.Id;

            return Ok(dto);
        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize(Roles = UserRoleNames.Admin)]
        public ActionResult DeleteTicket(int id)
        {
            var ticket = tickets.FirstOrDefault(x => x.Id == id);
            if (ticket == null)
            {
                return NotFound();
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
                   dto.MovieId <= 0;
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
                    MovieId = x.MovieId
                });
        }
    }
}

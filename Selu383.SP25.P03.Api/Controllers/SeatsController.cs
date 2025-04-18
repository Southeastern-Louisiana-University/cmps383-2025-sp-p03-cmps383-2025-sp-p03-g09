using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Seats;
using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Features.Users;
using Selu383.SP25.P03.Api.Features.Tickets;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/seats")]
    [ApiController]
    public class SeatController : ControllerBase
    {
        private readonly DataContext dataContext;
        private readonly UserManager<User> userManager;
        private readonly DbSet<Seat> seats;
        private readonly DbSet<Ticket> tickets;

        public SeatController(DataContext dataContext, UserManager<User> userManager)
        {
            this.dataContext = dataContext;
            this.userManager = userManager;
            seats = dataContext.Set<Seat>();
            tickets = dataContext.Set<Ticket>();
        }

        [HttpGet("theater/{theaterId}")]
        public async Task<ActionResult<List<SeatDto>>> GetSeatsByTheater(int theaterId)
        {
            var soldSeatIds = await tickets
                .Where(t => t.TheaterId == theaterId)
                .Select(t => t.SeatId)
                .ToListAsync();

            var seatList = await seats
                .Where(s => s.TheaterId == theaterId)
                .Select(s => new SeatDto
                {
                    Id = s.Id,
                    Row = s.Row,
                    Column = s.Column,
                    IsReserved = soldSeatIds.Contains(s.Id),
                    ReservedByUserId = s.ReservedByUserId
                })
                .ToListAsync();

            return Ok(seatList);
        }

        [HttpGet("theater/{theaterId}/available")]
        public async Task<ActionResult<List<SeatDto>>> GetAvailableSeats(int theaterId)
        {
            var soldSeatIds = await tickets
                .Where(t => t.TheaterId == theaterId)
                .Select(t => t.SeatId)
                .ToListAsync();

            var availableSeats = await seats
                .Where(s => s.TheaterId == theaterId && !soldSeatIds.Contains(s.Id))
                .Select(s => new SeatDto
                {
                    Id = s.Id,
                    Row = s.Row,
                    Column = s.Column,
                    IsReserved = false
                })
                .ToListAsync();

            return Ok(availableSeats);
        }

        [HttpPost("{theaterId}/reserve")]
        [AllowAnonymous]
        public async Task<ActionResult> ReserveSeat(int theaterId, [FromBody] SeatDto seatDto)
        {
            var currentUser = await userManager.GetUserAsync(User);
            var guestId = Request.Headers["X-Guest-ID"].ToString();

            if (currentUser == null && string.IsNullOrWhiteSpace(guestId))
            {
                return Unauthorized("No user or guest ID provided.");
            }

            var seat = await seats
                .FirstOrDefaultAsync(s => s.TheaterId == theaterId && s.Row == seatDto.Row && s.Column == seatDto.Column);

            if (seat == null)
            {
                return NotFound("Seat does not exist.");
            }

            var alreadyTaken = await tickets.AnyAsync(t => t.SeatId == seat.Id);
            if (alreadyTaken)
            {
                return BadRequest("Seat has already been purchased.");
            }

            if (currentUser != null)
            {
                seat.ReservedByUserId = currentUser.Id;
                seat.ReservedByGuestId = null;
            }
            else
            {
                seat.ReservedByUserId = null;
                seat.ReservedByGuestId = guestId;
            }

            await dataContext.SaveChangesAsync();

            return Ok(new { Message = "Seat reserved successfully", SeatId = seat.Id });
        }

        [HttpPost("{theaterId}/release")]
        [AllowAnonymous]
        public async Task<ActionResult> ReleaseSeat(int theaterId, [FromBody] SeatDto seatDto)
        {
            var currentUser = await userManager.GetUserAsync(User);
            var guestId = Request.Headers["X-Guest-ID"].ToString();

            if (currentUser == null && string.IsNullOrWhiteSpace(guestId))
            {
                return Unauthorized("No user or guest ID provided.");
            }

            var seat = await seats
                .FirstOrDefaultAsync(s => s.TheaterId == theaterId && s.Row == seatDto.Row && s.Column == seatDto.Column);

            if (seat == null)
            {
                return NotFound("Seat does not exist.");
            }

            bool isOwner = currentUser != null
                ? seat.ReservedByUserId == currentUser.Id
                : seat.ReservedByGuestId == guestId;

            if (!isOwner)
            {
                return BadRequest("You do not have permission to release this seat.");
            }

            seat.ReservedByUserId = null;
            seat.ReservedByGuestId = null;

            await dataContext.SaveChangesAsync();

            return Ok(new { Message = "Seat released successfully" });
        }

        [HttpPost("theater/{theaterId}/add")]
        [Authorize(Roles = UserRoleNames.Admin)]
        public async Task<ActionResult> AddSeats(int theaterId, [FromBody] List<SeatDto> seatDtos)
        {
            var theater = await dataContext.Set<Theater>().FindAsync(theaterId);
            if (theater == null)
            {
                return NotFound("Theater not found.");
            }

            var newSeats = seatDtos.Select(dto => new Seat
            {
                TheaterId = theaterId,
                Row = dto.Row,
                Column = dto.Column,
                IsReserved = false
            }).ToList();

            await seats.AddRangeAsync(newSeats);
            await dataContext.SaveChangesAsync();

            return Ok(new { Message = "Seats added successfully", Count = newSeats.Count });
        }
    }
}

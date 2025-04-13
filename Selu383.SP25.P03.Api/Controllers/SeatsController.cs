using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Seats;
using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Features.Users;
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

        public SeatController(DataContext dataContext, UserManager<User> userManager)
        {
            this.dataContext = dataContext;
            this.userManager = userManager;
            seats = dataContext.Set<Seat>();
        }

        // Get all seats for a specific theater
        [HttpGet("theater/{theaterId}")]
        public async Task<ActionResult<List<SeatDto>>> GetSeatsByTheater(int theaterId)
        {
            var seatList = await seats
                .Where(s => s.TheaterId == theaterId)
                .Select(s => new SeatDto
                {
                    Id = s.Id,
                    Row = s.Row,
                    Column = s.Column,
                    IsReserved = s.IsReserved,
                    ReservedByUserId = s.ReservedByUserId
                })
                .ToListAsync();

            return Ok(seatList);
        }

        [HttpGet("theater/{theaterId}/available")]
        public async Task<ActionResult<List<SeatDto>>> GetAvailableSeats(int theaterId)
        {
            var availableSeats = await seats
                .Where(s => s.TheaterId == theaterId && !s.IsReserved)
                .Select(s => new SeatDto
                {
                    Id = s.Id,
                    Row = s.Row,
                    Column = s.Column,
                    IsReserved = s.IsReserved
                })
                .ToListAsync();

            return Ok(availableSeats);
        }

        // ✅ Reserve a seat (guest or user)
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

            if (seat.IsReserved)
            {
                return BadRequest("Seat is already reserved.");
            }

            seat.IsReserved = true;

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

        // ✅ Release a reserved seat
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

            if (!seat.IsReserved || !isOwner)
            {
                return BadRequest("You do not have permission to release this seat.");
            }

            seat.IsReserved = false;
            seat.ReservedByUserId = null;
            seat.ReservedByGuestId = null;

            await dataContext.SaveChangesAsync();

            return Ok(new { Message = "Seat released successfully" });
        }

        // Admin: Add new seats manually
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

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
        [HttpGet]
        [Route("theater/{theaterId}")]
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

        // Get available seats in a theater
        [HttpGet]
        [Route("theater/{theaterId}/available")]
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

        // Reserve a seat
        [HttpPost]
        [Route("{theaterId}/reserve")]
        [Authorize]
        public async Task<ActionResult> ReserveSeat(int theaterId, [FromBody] SeatDto seatDto)
        {
            var currentUser = await userManager.GetUserAsync(User);
            if (currentUser == null)
            {
                return Unauthorized();
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
            seat.ReservedByUserId = currentUser.Id;

            await dataContext.SaveChangesAsync();

            return Ok(new { Message = "Seat reserved successfully", SeatId = seat.Id });
        }

        // Release a reserved seat
        [HttpPost]
        [Route("{theaterId}/release")]
        [Authorize]
        public async Task<ActionResult> ReleaseSeat(int theaterId, [FromBody] SeatDto seatDto)
        {
            var currentUser = await userManager.GetUserAsync(User);
            if (currentUser == null)
            {
                return Unauthorized();
            }

            var seat = await seats
                .FirstOrDefaultAsync(s => s.TheaterId == theaterId && s.Row == seatDto.Row && s.Column == seatDto.Column);

            if (seat == null)
            {
                return NotFound("Seat does not exist.");
            }

            if (!seat.IsReserved || seat.ReservedByUserId != currentUser.Id)
            {
                return BadRequest("You can only release a seat you reserved.");
            }

            seat.IsReserved = false;
            seat.ReservedByUserId = null;

            await dataContext.SaveChangesAsync();

            return Ok(new { Message = "Seat released successfully" });
        }

        // Admin-only: Create new seats for a theater
        [HttpPost]
        [Route("theater/{theaterId}/add")]
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

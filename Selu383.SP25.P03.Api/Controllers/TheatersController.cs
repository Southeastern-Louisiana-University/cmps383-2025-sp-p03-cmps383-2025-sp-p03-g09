using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Features.Users;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/theaters")]
    [ApiController]
    public class TheatersController : ControllerBase
    {
        private readonly DbSet<Theater> theaters;
        private readonly DataContext dataContext;
        private readonly DbSet<User> users;
        private readonly UserManager<User> userManager;

        public TheatersController(DataContext dataContext, UserManager<User> userManager)
        {
            this.dataContext = dataContext;
            theaters = dataContext.Set<Theater>();
            users = dataContext.Set<User>();
            this.userManager = userManager;
        }

        [HttpGet]
        public IEnumerable<TheaterDto> GetAllTheaters()
        {
            return GetTheaterDtos(theaters.ToList());
        }

        [HttpGet]
        [Route("{id}")]
        public ActionResult<TheaterDto> GetTheaterById(int id)
        {
            var result = GetTheaterDtos(theaters.Where(x => x.Id == id).ToList()).FirstOrDefault();
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = UserRoleNames.Admin)]
        public ActionResult<TheaterDto> CreateTheater(TheaterDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest();
            }

            var theater = new Theater
            {
                TheaterNumber = dto.TheaterNumber,
                SeatCount = dto.SeatCount,
                LocationId = dto.LocationId > 0 ? dto.LocationId : null
            };
            theaters.Add(theater);

            dataContext.SaveChanges();

            dto.Id = theater.Id;

            return CreatedAtAction(nameof(GetTheaterById), new { id = dto.Id }, dto);
        }

        [HttpPut]
        [Route("{id}")]
        [Authorize]
        public async Task<ActionResult<TheaterDto>> UpdateTheater(int id, TheaterDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest();
            }

            var theater = theaters.FirstOrDefault(x => x.Id == id);
            if (theater == null)
            {
                return NotFound();
            }

            theater.TheaterNumber = dto.TheaterNumber;
            theater.SeatCount = dto.SeatCount;
            theater.LocationId = dto.LocationId > 0 ? dto.LocationId : null;

            dataContext.SaveChanges();

            dto.Id = theater.Id;

            return Ok(dto);
        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize(Roles = UserRoleNames.Admin)]
        public ActionResult DeleteTheater(int id)
        {
            var theater = theaters.FirstOrDefault(x => x.Id == id);
            if (theater == null)
            {
                return NotFound();
            }

            theaters.Remove(theater);

            dataContext.SaveChanges();

            return Ok();
        }

        private bool IsInvalid(TheaterDto dto)
        {
            return dto.TheaterNumber <= 0 ||
                   dto.SeatCount <= 0 ||
                   (dto.LocationId > 0 && !dataContext.Locations.Any(x => x.Id == dto.LocationId));
        }

        private static IEnumerable<TheaterDto> GetTheaterDtos(IEnumerable<Theater> theaters)
        {
            return theaters
                .Select(x => new TheaterDto
                {
                    Id = x.Id,
                    TheaterNumber = x.TheaterNumber,
                    SeatCount = x.SeatCount,
                    LocationId = x.LocationId ?? 0
                });
        }
    }
}

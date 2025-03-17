using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Locations;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/locations")]
    [ApiController]
    public class LocationsController : ControllerBase
    {
        private readonly DbSet<Location> locations;
        private readonly DataContext dataContext;

        public LocationsController(DataContext dataContext)
        {
            this.dataContext = dataContext;
            locations = dataContext.Set<Location>();
        }

        [HttpGet]
        public IQueryable<LocationDto> GetAllLocations()
        {
            return GetLocationDtos(locations);
        }

        [HttpGet]
        [Route("{id}")]
        public ActionResult<LocationDto> GetLocationById(int id)
        {
            var result = GetLocationDtos(locations.Where(x => x.Id == id)).FirstOrDefault();
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = UserRoleNames.Admin)]
        public ActionResult<LocationDto> CreateLocation(LocationDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest();
            }

            var location = new Location
            {
                Name = dto.Name,
                Address = dto.Address
            };
            locations.Add(location);

            dataContext.SaveChanges();

            dto.Id = location.Id;

            return CreatedAtAction(nameof(GetLocationById), new { id = dto.Id }, dto);
        }

        [HttpPut]
        [Route("{id}")]
        [Authorize(Roles = UserRoleNames.Admin)]
        public ActionResult<LocationDto> UpdateLocation(int id, LocationDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest();
            }

            var location = locations.FirstOrDefault(x => x.Id == id);
            if (location == null)
            {
                return NotFound();
            }

            location.Name = dto.Name;
            location.Address = dto.Address;

            dataContext.SaveChanges();

            dto.Id = location.Id;

            return Ok(dto);
        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize(Roles = UserRoleNames.Admin)]
        public ActionResult DeleteLocation(int id)
        {
            var location = locations.FirstOrDefault(x => x.Id == id);
            if (location == null)
            {
                return NotFound();
            }

            locations.Remove(location);

            dataContext.SaveChanges();

            return Ok();
        }

        private bool IsInvalid(LocationDto dto)
        {
            return string.IsNullOrWhiteSpace(dto.Name) ||
                   dto.Name.Length > 120 ||
                   string.IsNullOrWhiteSpace(dto.Address);
        }

        private static IQueryable<LocationDto> GetLocationDtos(IQueryable<Location> locations)
        {
            return locations
                .Select(x => new LocationDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Address = x.Address
                });
        }
    }
}

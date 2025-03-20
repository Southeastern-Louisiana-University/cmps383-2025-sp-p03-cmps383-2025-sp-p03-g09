using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.FoodItems;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/fooditems")]
    [ApiController]
    public class FoodItemsController : ControllerBase
    {
        private readonly DbSet<FoodItem> foodItems;
        private readonly DataContext dataContext;

        public FoodItemsController(DataContext dataContext)
        {
            this.dataContext = dataContext;
            foodItems = dataContext.Set<FoodItem>();
        }

        [HttpGet]
        public IQueryable<FoodItemDto> GetAllFoodItems()
        {
            return GetFoodItemDtos(foodItems);
        }

        [HttpGet]
        [Route("{id}")]
        public ActionResult<FoodItemDto> GetFoodItemById(int id)
        {
            var result = GetFoodItemDtos(foodItems.Where(x => x.Id == id)).FirstOrDefault();
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = Features.Users.UserRoleNames.Admin)]
        public ActionResult<FoodItemDto> CreateFoodItem(FoodItemDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest();
            }

            var foodItem = new FoodItem
            {
                Name = dto.Name,
                Price = dto.Price,
                Description = dto.Description,
                IsVegan = dto.IsVegan,
                LocationId = dto.LocationId
            };
            foodItems.Add(foodItem);

            dataContext.SaveChanges();

            dto.Id = foodItem.Id;

            return CreatedAtAction(nameof(GetFoodItemById), new { id = dto.Id }, dto);
        }

        [HttpPut]
        [Route("{id}")]
        [Authorize(Roles = Features.Users.UserRoleNames.Admin)]
        public ActionResult<FoodItemDto> UpdateFoodItem(int id, FoodItemDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest();
            }

            var foodItem = foodItems.FirstOrDefault(x => x.Id == id);
            if (foodItem == null)
            {
                return NotFound();
            }

            foodItem.Name = dto.Name;
            foodItem.Price = dto.Price;
            foodItem.Description = dto.Description;
            foodItem.IsVegan = dto.IsVegan;
            foodItem.LocationId = dto.LocationId;

            dataContext.SaveChanges();

            dto.Id = foodItem.Id;

            return Ok(dto);
        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize(Roles = Features.Users.UserRoleNames.Admin)]
        public ActionResult DeleteFoodItem(int id)
        {
            var foodItem = foodItems.FirstOrDefault(x => x.Id == id);
            if (foodItem == null)
            {
                return NotFound();
            }

            foodItems.Remove(foodItem);

            dataContext.SaveChanges();

            return Ok();
        }

        private bool IsInvalid(FoodItemDto dto)
        {
            return string.IsNullOrWhiteSpace(dto.Name) ||
                   dto.Price <= 0 ||
                   string.IsNullOrWhiteSpace(dto.Description) ||
                   dto.LocationId <= 0;
        }

        private static IQueryable<FoodItemDto> GetFoodItemDtos(IQueryable<FoodItem> foodItems)
        {
            return foodItems
                .Select(x => new FoodItemDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Price = x.Price,
                    Description = x.Description,
                    IsVegan = x.IsVegan,
                    LocationId = x.LocationId
                });
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Users;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> userManager;
        private readonly RoleManager<Role> roleManager;
        private readonly DataContext dataContext;
        private DbSet<Role> roles;

        public UsersController(
            RoleManager<Role> roleManager,
            UserManager<User> userManager,
            DataContext dataContext)
        {
            this.roleManager = roleManager;
            this.userManager = userManager;
            this.dataContext = dataContext;
            roles = dataContext.Set<Role>();
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserDto dto)
        {
            var rolesArray = new string[] { "Admin", "User" }; // Example array
            var rolesList = rolesArray.ToList(); // Convert array to List<string>

            // Ensure dto.Roles is converted to a List<string> for comparison
            var dtoRolesList = dto.Roles.ToList();

            if (!dtoRolesList.Any() || !dtoRolesList.All(x => rolesList.Any(y => x == y)))
            {
                return BadRequest();
            }

            var result = await userManager.CreateAsync(new User { UserName = dto.Username }, dto.Password);
            if (result.Succeeded)
            {
                await userManager.AddToRolesAsync(await userManager.FindByNameAsync(dto.Username), dtoRolesList);

                var user = await userManager.FindByNameAsync(dto.Username);
                return new UserDto
                {
                    Id = user.Id,
                    UserName = dto.Username,
                    Roles = dtoRolesList
                };
            }
            return BadRequest();
        }
    }
}

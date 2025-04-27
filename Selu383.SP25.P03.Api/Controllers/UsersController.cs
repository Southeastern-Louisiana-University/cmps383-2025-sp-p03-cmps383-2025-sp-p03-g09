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
public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserDto dto)
{
    var allowedRoles = new List<string> { "Admin", "User" };

    // Default to "User" role if none provided
    var dtoRolesList = dto.Roles?.Any() == true ? dto.Roles : new List<string> { "User" };

    // Validate that all requested roles are allowed
    if (!dtoRolesList.All(role => allowedRoles.Contains(role)))
    {
        return BadRequest(new { error = $"Invalid roles provided. Must be one of: {string.Join(", ", allowedRoles)}" });
    }

    var user = new User
    {
        UserName = dto.Username
    };

    var result = await userManager.CreateAsync(user, dto.Password);

    if (!result.Succeeded)
    {
        return BadRequest(new { errors = result.Errors.Select(e => e.Description).ToList() });
    }

    await userManager.AddToRolesAsync(user, dtoRolesList);

    return new UserDto
    {
        Id = user.Id,
        UserName = user.UserName,
        Roles = dtoRolesList
    };
}

    }
}

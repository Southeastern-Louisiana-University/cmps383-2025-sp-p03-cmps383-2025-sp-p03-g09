using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Users;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;


namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/authentication")]
    public class AuthenticationController : ControllerBase
    {
        private readonly SignInManager<User> signInManager;
        private readonly UserManager<User> userManager;
        private readonly DataContext dataContext;
        private DbSet<User> users;

        public AuthenticationController(SignInManager<User> signInManager, UserManager<User> userManager, DataContext dataContext)
        {
            this.signInManager = signInManager;
            this.userManager = userManager;
            this.dataContext = dataContext;
            users = dataContext.Set<User>();
        }

        [HttpPost("login")]
public async Task<ActionResult<object>> Login([FromBody] LoginDto dto)
{
    var result = await signInManager.PasswordSignInAsync(dto.UserName, dto.Password, false, false);
    if (!result.Succeeded)
    {
        return BadRequest("Invalid username or password.");
    }

    var user = await userManager.FindByNameAsync(dto.UserName);
    if (user == null)
    {
        return BadRequest();
    }

    var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.UserName)
    };

    var roles = await userManager.GetRolesAsync(user);
    claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

    var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes("YOUR_SUPER_SECRET_32CHAR_KEY1234567890"));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(claims),
        Expires = DateTime.UtcNow.AddDays(7),
        SigningCredentials = creds
    };

    var tokenHandler = new JwtSecurityTokenHandler();
    var token = tokenHandler.CreateToken(tokenDescriptor);
    var jwt = tokenHandler.WriteToken(token);

    // 🚨 THIS IS THE IMPORTANT PART
    return Ok(new
    {
        id = user.Id,
        username = user.UserName,
        token = jwt
    });
}




        [HttpGet]
        [Route("me")]
        [Authorize]
        public async Task<ActionResult<UserDto>> Me()
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null)
            {
                return BadRequest();
            }
            return new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Roles = (await userManager.GetRolesAsync(user)).ToList()
            };
        }

        [HttpPost]
        [Route("logout")]
        [Authorize]
        public async Task<ActionResult> Logout()
        {
            await signInManager.SignOutAsync();
            return Ok();
        }
    }
}

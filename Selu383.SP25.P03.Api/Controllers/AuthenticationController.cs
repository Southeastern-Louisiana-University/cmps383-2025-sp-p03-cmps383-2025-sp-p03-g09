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
        private readonly DbSet<User> users;

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
            var user = await userManager.FindByNameAsync(dto.UserName);
            if (user == null || !await userManager.CheckPasswordAsync(user, dto.Password))
            {
                return BadRequest("Invalid username or password.");
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName)
            };

            var roles = await userManager.GetRolesAsync(user);
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            // Use environment variable to store the JWT secret key
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_SECRET") ?? "d9f8e23ab1c643f2bc4b8c9fd452a6df2f5e7a11bbd44c73a8e5fa9ed120c5cf"));
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

            // Set the JWT in a cookie
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true, // Ensure this is true in production
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            Response.Cookies.Append("AuthToken", jwt, cookieOptions);

            return Ok(new 
            {
                id = user.Id,
                username = user.UserName,
                token = jwt,
                roles = roles
            });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<UserDto>> Me()
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized("User not found.");
            }
            return new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Roles = (await userManager.GetRolesAsync(user)).ToList()
            };
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<ActionResult> Logout()
        {
            // Clear the auth token cookie
            Response.Cookies.Delete("AuthToken");
            await signInManager.SignOutAsync();
            return Ok("Successfully logged out.");
        }
    }
}
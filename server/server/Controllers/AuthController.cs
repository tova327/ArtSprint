using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Server.Core.models;
using Server.Core.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IAuthService _authService;

        public AuthController(IConfiguration configuration,IAuthService authService)
        {
            _configuration = configuration;
            _authService=authService;
        }

        // Example: Call AuthService from AuthController
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {
            var token =await _authService.Authenticate(loginModel.UserName, loginModel.Password);
            if (token == null)
                return Unauthorized();
            return Ok(new { Token = token });
        }
    }
}

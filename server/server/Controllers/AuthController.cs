using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using server.Post_Models;
using Server.Core.models;
using Server.Core.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Server.Core.DTOs;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IAuthService _authService;
        private readonly IUserService _userService; // Add IUserService to handle user registration
        private readonly IMapper _mapper; // Add IUserService to handle user registration

        public AuthController(IConfiguration configuration, IAuthService authService, IUserService userService,IMapper mapper)
        {
            _configuration = configuration;
            _authService = authService;
            _userService = userService; 
            _mapper = mapper;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {
            var token = await _authService.Authenticate(loginModel.UserName, loginModel.Password);
            if (token == null)
                return Unauthorized();
            return Ok(new { Token = token });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserPostModel userPostModel)
        {
            // Step 1: Validate the user model (you can add more validation as needed)
            if (userPostModel == null || string.IsNullOrWhiteSpace(userPostModel.Name) || string.IsNullOrWhiteSpace(userPostModel.Password))
            {
                return BadRequest("Invalid user data.");
            }

            // Step 2: Add the user using the user service

            var userDto=_mapper.Map<UserDTO>(userPostModel);
            
            var result = await _userService.AddAsync(userDto);

            if (result==null)
            {
                return BadRequest("THIS USER ALREADY EXISTS"); // Return error message if registration fails
            }

            // Step 3: Authenticate the user to generate a JWT token
            var token = await _authService.Authenticate(userPostModel.Name, userPostModel.Password);
            if (token == null)
                return Unauthorized(); // If authentication fails after registration

            return Ok(new { Token = token });
        }
    }

}

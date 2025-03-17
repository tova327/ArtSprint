using Microsoft.AspNetCore.Mvc;
using Server.Core.DTOs;
using Server.Core.models;
using Server.Core.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetAll()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetById(int id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult<UserDTO>> Add(UserDTO userDto)
        {
            var user = await _userService.AddAsync(userDto);
            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<UserDTO>> Update(int id, UserDTO userDto)
        {
            var user = await _userService.UpdateAsync(id, userDto);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _userService.DeleteAsync(id);
            return NoContent();
        }

        // Additional methods to use other service functions
        [HttpGet("{id}/details")]
        public async Task<ActionResult<UserDTO>> GetUserDetailsById(int id)
        {
            var user = await _userService.GetUserDetailsByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpPut("{id}/name")]
        public async Task<IActionResult> UpdateUserName(int id, [FromBody] string name)
        {
            await _userService.UpdateUserNameAsync(id, name);
            return NoContent();
        }

        [HttpPut("{id}/cameon")]
        public async Task<IActionResult> UpdateUserCameOn(int id, [FromBody] DateTime cameOn)
        {
            await _userService.UpdateUserCameOnAsync(id, cameOn);
            return NoContent();
        }

        [HttpPut("{id}/ismedal")]
        public async Task<IActionResult> UpdateUserIsMedal(int id, [FromBody] bool isMedal)
        {
            await _userService.UpdateUserIsMedalAsync(id, isMedal);
            return NoContent();
        }

        [HttpPut("{id}/lastpaint")]
        public async Task<IActionResult> UpdateUserLastPaint(int id, [FromBody] DateTime? lastPaint)
        {
            await _userService.UpdateUserLastPaintAsync(id, lastPaint);
            return NoContent();
        }
    }
}

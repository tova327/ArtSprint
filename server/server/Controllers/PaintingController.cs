using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Post_Models;
using Server.Core.DTOs;
using Server.Core.models;
using Server.Core.Services;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaintingController : ControllerBase
    {
        private readonly IPaintingService _paintingService;
        private readonly IMapper _mapper;

        public PaintingController(IPaintingService paintingService, IMapper mapper)
        {
            _paintingService = paintingService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaintingDTO>>> GetAll()
        {
            var paintings = await _paintingService.GetAllAsync();
            return Ok(paintings);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PaintingDTO>> GetById(int id)
        {
            var painting = await _paintingService.GetByIdAsync(id);
            if (painting == null)
            {
                return NotFound();
            }
            return Ok(painting);
        }

        [HttpPost]
        public async Task<ActionResult<PaintingDTO>> Add([FromBody] PaintingPostModel paintingPostModel)
        {
            var paintingDto = _mapper.Map<PaintingDTO>(paintingPostModel);
            var painting = await _paintingService.AddAsync(paintingDto);
            return CreatedAtAction(nameof(GetById), new { id = painting.Id }, painting);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<PaintingDTO>> Update(int id, [FromBody] PaintingPostModel paintingPostModel)
        {
            var paintingDto = _mapper.Map<PaintingDTO>(paintingPostModel);
            var painting = await _paintingService.UpdateAsync(id, paintingDto);
            if (painting == null)
            {
                return NotFound();
            }
            return Ok(painting);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _paintingService.DeleteAsync(id);
            return NoContent();
        }

        // Additional methods to use other service functions
        [HttpPost("{id}/like")]
        public async Task<IActionResult> AddLike(int id)
        {
            await _paintingService.AddLikeAsync(id);
            return NoContent();
        }

        [HttpGet("date")]
        public async Task<ActionResult<IEnumerable<PaintingDTO>>> GetAllFromDateToDate([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var paintings = await _paintingService.GetAllFromDateToDateAsync(startDate, endDate);
            return Ok(paintings);
        }
    }
}

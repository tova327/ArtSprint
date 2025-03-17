using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Server.Core.DTOs;
using Server.Core.models;
using Server.Core.Services;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompetitionPaintingController : ControllerBase
    {
        private readonly ICompetitionPaintingService _competitionPaintingService;

        public CompetitionPaintingController(ICompetitionPaintingService competitionPaintingService)
        {
            _competitionPaintingService = competitionPaintingService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CompetitionPaintingDTO>>> GetAll()
        {
            var competitionPaintings = await _competitionPaintingService.GetAllAsync();
            return Ok(competitionPaintings);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CompetitionPaintingDTO>> GetById(int id)
        {
            var competitionPainting = await _competitionPaintingService.GetByIdAsync(id);
            if (competitionPainting == null)
            {
                return NotFound();
            }
            return Ok(competitionPainting);
        }

        [HttpPost]
        public async Task<ActionResult<CompetitionPaintingDTO>> Add(CompetitionPaintingDTO competitionPaintingDto)
        {
            var competitionPainting = await _competitionPaintingService.AddAsync(competitionPaintingDto);
            return CreatedAtAction(nameof(GetById), new { id = competitionPainting.Id }, competitionPainting);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<CompetitionPaintingDTO>> Update(int id, CompetitionPaintingDTO competitionPaintingDto)
        {
            var competitionPainting = await _competitionPaintingService.UpdateAsync(id, competitionPaintingDto);
            if (competitionPainting == null)
            {
                return NotFound();
            }
            return Ok(competitionPainting);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _competitionPaintingService.DeleteAsync(id);
            return NoContent();
        }
    }
}

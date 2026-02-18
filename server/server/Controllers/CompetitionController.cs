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
    public class CompetitionController : ControllerBase
    {
        private readonly ICompetitionService _competitionService;
        private readonly IMapper _mapper;

        public CompetitionController(ICompetitionService competitionService, IMapper mapper)
        {
            _competitionService = competitionService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CompetitionDTO>>> GetAll()
        {
            var competitions = await _competitionService.GetAllAsync();
            return Ok(competitions);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CompetitionDTO>> GetById(int id)
        {
            var competition = await _competitionService.GetByIdAsync(id);
            if (competition == null)
            {
                return NotFound();
            }
            return Ok(competition);
        }

        [HttpPost]
        public async Task<ActionResult<CompetitionDTO>> Add([FromBody] CompetitionPostModel competitionPostModel)
        {
            var competitionDto = _mapper.Map<CompetitionDTO>(competitionPostModel);
            var competition = await _competitionService.AddAsync(competitionDto);
            return CreatedAtAction(nameof(GetById), new { id = competition.Id }, competition);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<CompetitionDTO>> Update(int id, [FromBody] CompetitionPostModel competitionPostModel)
        {
            var competitionDto = _mapper.Map<CompetitionDTO>(competitionPostModel);
            var competition = await _competitionService.UpdateAsync(id, competitionDto);
            if (competition == null)
            {
                return NotFound();
            }
            return Ok(competition);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _competitionService.DeleteAsync(id);
            return NoContent();
        }

        // Additional methods to use other service functions
        [HttpGet("subject/{subject}")]
        public async Task<ActionResult<CompetitionDTO>> GetCompetitionDetailsBySubject(int categoryId)
        {
            var competition = await _competitionService.GetCompetitionDetailsBySubjectAsync(categoryId);
            if (competition == null)
            {
                return NotFound();
            }
            return Ok(competition);
        }

        [HttpGet("last")]
        public async Task<ActionResult<CompetitionDTO>> GetLastCompetition()
        {
            var competition = await _competitionService.GetLastCompetitionAsync();
            if (competition == null)
            {
                return NotFound();
            }
            return Ok(competition);
        }
    }
}

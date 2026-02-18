using AutoMapper;
using Microsoft.AspNetCore.Authorization;
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
    public class CommentController : ControllerBase
    {
        private readonly ICommentService _commentService;
        private readonly IMapper _mapper;

        public CommentController(ICommentService commentService, IMapper mapper)
        {
            _commentService = commentService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CommentDTO>>> GetAll()
        {
            var comments = await _commentService.GetAllAsync();
            return Ok(comments);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CommentDTO>> GetById(int id)
        {
            var comment = await _commentService.GetByIdAsync(id);
            if (comment == null)
            {
                return NotFound(id);
            }
            return Ok(comment);
        }
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<CommentDTO>> Add(CommentPostModel comment)
        {
            if (comment == null)
            {
                return BadRequest();
            }
            var commentDto = _mapper.Map<CommentDTO>(comment);
            var commentAdded = await _commentService.AddAsync(commentDto);
            return CreatedAtAction(nameof(GetById), new { id = commentAdded.Id }, comment);
        }
        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<CommentDTO>> Update(int id, CommentPostModel comment)
        {
            if (comment == null)
            {
                return BadRequest();
            }
            var commentDto = _mapper.Map<CommentDTO>(comment);
            var commentPut = await _commentService.UpdateAsync(id, commentDto);
            if (commentPut == null)
            {
                return NotFound();
            }
            return Ok(commentPut);
        }
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _commentService.DeleteAsync(id);
            return NoContent();
        }
    }
}

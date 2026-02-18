using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Post_Models;
using Server.Core.models;
using Server.Core.DTOs;
using Server.Core.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
		private readonly ICategoryService _categoryService;
		private readonly IMapper _mapper;

        public CategoryController(ICategoryService categoryService, IMapper mapper)
        {
            _categoryService = categoryService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDTO>>> GetAll()
        {
           var categories=await _categoryService.GetAllAsync();
            return Ok(categories);
        }


        
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDTO>> GetById(int id)
        {
            try
            {
                var category = await _categoryService.GetByIdAsync(id);
                return Ok(category);
            }catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<CategoryDTO>> Post([FromBody] CategoryPostModel category)
        {
            if (category == null)
            {
                return BadRequest("Category is null.");
            }
            try
            {
                var categoryDto =_mapper.Map<CategoryDTO>(category);

                var result = await _categoryService.AddAsync(categoryDto);
                if (result == null)
                    return BadRequest("Parent category not found.");

                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<CategoryDTO>> Put(int id, [FromBody] CategoryPostModel category)
        {
            if (category == null)
                return BadRequest("Category is null.");

            try
            {

				var categoryDto = _mapper.Map<CategoryDTO>(category);
				var updated = await _categoryService.UpdateAsync(id, categoryDto);
                return Ok(updated);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

		[Authorize]
		[HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                await _categoryService.DeleteAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }catch(InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}

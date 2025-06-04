using AutoMapper;
using Google.Apis.Storage.v1;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Post_Models;
using Server.Core.DTOs;
using Server.Core.models;
using Server.Core.Services;
using System.Net.Http;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaintingController : ControllerBase
    {
        private readonly IPaintingService _paintingService;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;
        private readonly IStorageService _storageService;
        private readonly HttpClient _httpClient;
        public PaintingController(IPaintingService paintingService, IMapper mapper,IUserService userService, IStorageService storageService, HttpClient httpClient)
        {
            _paintingService = paintingService;
            _mapper = mapper;
            _userService = userService;
            _storageService = storageService;
            _httpClient = httpClient;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaintingDTO>>> GetAll()
        {
            try
            {
                var paintings = await _paintingService.GetAllAsync();
                return Ok(paintings);
            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
            
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PaintingDTO>> GetById(int id)
        {
            try
            {
                var painting = await _paintingService.GetByIdAsync(id);
                if (painting == null)
                {
                    return NotFound();
                }
                return Ok(painting);
            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
            
        }
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<PaintingDTO>>> GetPaintingsForUser(int userId)
        {
            try
            {
                var paintings = await _paintingService.GetAllAsync();
                if (paintings == null)
                {
                    return NotFound();
                }
                var specificPaintings = paintings.Where(p => p.OwnerId == userId);
                return Ok(specificPaintings);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            
        }
        
        [Authorize]
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
        [Authorize]
        // Additional methods to use other service functions
        [HttpPost("{id}/like")]
        public async Task<IActionResult> AddLike(int id, [FromQuery]string count)
        {
            int intCount;
            var isInt=int.TryParse(count,out intCount);
            if (!isInt)
            {
                return BadRequest();
            }
            var res=await _paintingService.AddLikeAsync(id,intCount);
            if(!res)
                return BadRequest("PAINTING DOES NOT EXIST OR LIKES ARE INCORRECT");
            return Ok($"painting: {id}, likes: {count}");
        }

        [HttpGet("date")]
        public async Task<ActionResult<IEnumerable<PaintingDTO>>> GetAllFromDateToDate([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var paintings = await _paintingService.GetAllFromDateToDateAsync(startDate, endDate);
            return Ok(paintings);
        }


        [Authorize]
        [HttpPost("upload")]
        public async Task<ActionResult> UploadPainting([FromForm] PaintingPostModel paintingPostModel)
        {
            if (paintingPostModel.paintingFile == null)
            {
                return BadRequest("No files uploaded.");
            }



            string fileName = Path.GetFileName(paintingPostModel.paintingFile.FileName);
            var filePath = Path.Combine(Path.GetTempPath(), fileName);

            try
            {
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await paintingPostModel.paintingFile.CopyToAsync(stream);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

            var owner = await _userService.GetByIdAsync(paintingPostModel.OwnerId);
            if (owner == null)
            {
                return NotFound("Owner not found.");
            }
            

            var paintingDto = _mapper.Map<PaintingDTO>(paintingPostModel);
            var paintingAdded= await _paintingService.AddAsync(paintingDto);
            if(paintingAdded == null)
            {
                return BadRequest();
            }
            // succeed to add to db
            
            try
            {
                var path = await _storageService.UploadFileAsync(filePath, paintingPostModel.Name);
                paintingAdded.Url = path;
                await _paintingService.UpdateAsync(paintingAdded.Id, paintingAdded);
            }catch(Exception ex)
            {
                await _paintingService.DeleteAsync(paintingAdded.Id);
                throw;
            }
            return Ok(paintingAdded);
        }

        
        [HttpGet("download")]
        public async Task<IActionResult> Download(string fileNamePrefix)
        {

            if (string.IsNullOrEmpty(fileNamePrefix))
            {
                return BadRequest("File name cannot be null or empty.");
            }

            try
            {

                var fileStream = await _storageService.DownloadFileAsync(fileNamePrefix);
                if (fileStream == null)
                {
                    return NotFound("File not found.");
                }

                var contentType = "image/png";

                var fileName = Path.GetFileName(fileNamePrefix);
                Response.Headers.Add("Content-Disposition", $"attachment; filename={fileName}");
                return File(fileStream, contentType, fileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error downloading file: {ex.Message}");
            }
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var paintingToDelete=await _paintingService.GetByIdAsync(id);
            if (paintingToDelete == null)
                return BadRequest();
            var paintingNameWithExtention = paintingToDelete.Url.Substring(paintingToDelete.Url.IndexOf(paintingToDelete.Name));
            var deletedFromCloud =await _storageService.DeleteFileAsync(paintingNameWithExtention);
            if (!deletedFromCloud)
                return StatusCode(500, "can't delete from cloud");
            var deletedFromDB = await _paintingService.DeleteAsync(id);
            if(!deletedFromDB) return BadRequest();
            var allPainting=await _paintingService.GetAllAsync();
            return Ok(allPainting);

        }

    }
}

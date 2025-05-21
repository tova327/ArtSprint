using Microsoft.AspNetCore.Mvc;
using Server.Core.Services;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AIController : ControllerBase
    {
        private readonly IAIService _aiService; 
        public AIController(IAIService iAIService)
        {
            _aiService = iAIService;    
        }


        // GET: api/<TestAbilityController>
        [HttpGet]
        public async Task<IActionResult> GenerateQuestions([FromQuery] string subject)
        {
            var questions = await _aiService.GenerateAbilityQuestionsAsync(subject);
            return Ok(questions);
        }

        // GET api/<TestAbilityController>/5
        public class CheckAnswersRequest
        {
            public string Subject { get; set; }
            public List<string> Questions { get; set; }
            public List<string> Answers { get; set; }
        }

        [HttpPost("check")]
        public async Task<IActionResult> CheckAnswers([FromBody] CheckAnswersRequest req)
        {
            var result = await _aiService.CheckAnswersAsync(req.Subject, req.Questions, req.Answers);
            return Ok(new { result });
        }
    }
}

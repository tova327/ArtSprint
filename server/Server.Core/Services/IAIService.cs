using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Core.Services
{
    public interface IAIService
    {

        public Task<List<string>> GenerateAbilityQuestionsAsync(string subject);
        public Task<string> CheckAnswersAsync(string subject, List<string> questions, List<string> answers);
    }
}

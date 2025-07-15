using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Server.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace Server.Service.Services
{
    public class AIService : IAIService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _geminiApiUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";

        public AIService(IConfiguration configuration)
        {
            _apiKey = configuration["ApiKey"];
            _httpClient = new HttpClient();
        }

        // 1. Generate a few simple questions for a given subject (returns a string list)
        public async Task<List<string>> GenerateAbilityQuestionsAsync(string subject)
        {
            var prompt = $"Generate three simple, beginner-friendly questions to test someone's basic ability in the field of {subject}. Respond only with a numbered list, no explanations.";

            var requestBody = new
            {
                contents = new[]
                {
                    new {
                        parts = new[]
                        {
                            new { text = prompt }
                        }
                    }
                }
            };

            var json = JsonConvert.SerializeObject(requestBody);
            var url = $"{_geminiApiUrl}?key={_apiKey}";
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            HttpResponseMessage? response;
            try
            {
                response = await _httpClient.PostAsync(url, content);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }

            if (!response.IsSuccessStatusCode)
                throw new Exception("Failed to call Gemini: " + response.ReasonPhrase);

            var responseBody = await response.Content.ReadAsStringAsync();
            dynamic result = JsonConvert.DeserializeObject(responseBody);

            // Gemini returns a list of candidates, each with content.parts[0].text
            // We'll take the first candidate
            string aiText = result.candidates[0].content.parts[0].text.ToString();

            // Parse the numbered list into a List<string>
            var questions = new List<string>();
            foreach (var line in aiText.Split('\n'))
            {
                var trimmed = line.Trim();
                if (!string.IsNullOrEmpty(trimmed))
                {
                    // Remove leading numbers and dots (e.g., "1. ")
                    var idx = trimmed.IndexOf('.');
                    if (idx > 0 && idx < 3)
                    {
                        trimmed = trimmed.Substring(idx + 1).Trim();
                    }
                    questions.Add(trimmed);
                }
            }
            // Remove empty and redundant lines
            questions = questions.FindAll(q => !string.IsNullOrWhiteSpace(q));

            return questions;
        }

        // 2. Check if answers are acceptable for the subject (returns "yes" or "no")
        public async Task<string> CheckAnswersAsync(string subject, List<string> questions, List<string> answers)
        {
            // Build Q&A pairs for clarity
            var qaBuilder = new StringBuilder();
            for (int i = 0; i < questions.Count && i < answers.Count; i++)
            {
                qaBuilder.AppendLine($"Q{i + 1}: {questions[i]}");
                qaBuilder.AppendLine($"A{i + 1}: {answers[i]}");
            }

            var prompt = $"You are a judge for a basic {subject} ability test. Here are the questions and user answers:\n{qaBuilder}\nAre all answers reasonable and show basic effort? Reply only with 'yes' or 'no'.";

            var requestBody = new
            {
                contents = new[]
                {
                    new {
                        parts = new[]
                        {
                            new { text = prompt }
                        }
                    }
                }
            };

            var json = JsonConvert.SerializeObject(requestBody);
            var url = $"{_geminiApiUrl}?key={_apiKey}";
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            HttpResponseMessage? response;
            try
            {
                response = await _httpClient.PostAsync(url, content);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("Failed to call Gemini: " + ex.Message);
            }

            if (!response.IsSuccessStatusCode)
                throw new Exception("Failed to call Gemini: " + response.ReasonPhrase);

            var responseBody = await response.Content.ReadAsStringAsync();
            dynamic result = JsonConvert.DeserializeObject(responseBody);

            string aiText = result.candidates[0].content.parts[0].text.ToString().Trim().ToLower();

            if (aiText.StartsWith("yes"))
                return "yes";
            if (aiText.StartsWith("no"))
                return "no";
            // fallback in case model returns something else
            return aiText;
        }
    }
}
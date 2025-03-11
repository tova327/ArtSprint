using Server.Core.models;

namespace server.Post_Models
{
    public class CompetitionPostModel
    {
        public string Name { get; set; }
        public DateTime GoalDate { get; set; }
        public DateTime Deadline { get; set; }
        public ESubject Subject { get; set; }
        public string Instructions { get; set; }
    }
}

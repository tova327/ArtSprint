using System.ComponentModel.DataAnnotations.Schema;

namespace server.Post_Models
{
    public class CompetitionPaintingPostModel
    {
        public int IdPaint { get; set; }
        public int IdCompetition { get; set; }

    }
}

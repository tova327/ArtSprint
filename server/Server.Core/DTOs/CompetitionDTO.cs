using Server.Core.models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Core.DTOs
{
    public class CompetitionDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime GoalDate { get; set; }
        public DateTime Deadline { get; set; }
        public int? WinnerId { get; set; }
        public ESubject Subject { get; set; }
        public UserModel Winner { get; set; }
        public ICollection<CompetitionPaintingModel> CompetitionPaintings { get; set; }
    }
}

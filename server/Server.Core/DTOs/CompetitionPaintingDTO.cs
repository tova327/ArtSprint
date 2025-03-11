using Server.Core.models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Core.DTOs
{
    public class CompetitionPaintingDTO
    {
        public int Id { get; set; }
        public int IdPaint { get; set; }
        public int IdCompetition { get; set; }
        public int CountPositive { get; set; } = 0;
        public int Place { get; set; }
        public DateTime JoinedAt { get; set; } = DateTime.Now;
        public PaintingModel Painting { get; set; }
    }
}

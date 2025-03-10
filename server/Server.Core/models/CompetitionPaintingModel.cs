using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Core.models
{
    public class CompetitionPaintingModel
    {
        [Key]
        [ForeignKey("Painting")]
        public int IdPaint { get; set; }

        [Key]
        [ForeignKey("Competition")]
        public int IdCompetition { get; set; }

        public int CountPositive { get; set; } = 0;

        [Required]
        public int Place { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public PaintingModel Painting { get; set; }
        public CompetitionModel Competition { get; set; }
    }
}

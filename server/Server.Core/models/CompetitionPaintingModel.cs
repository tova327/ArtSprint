using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Core.models
{
    public class CompetitionPaintingModel:IHasTimestamps
    {
        [Key]
        public int Id { get; set; } 
        [ForeignKey("Painting")]
        public int IdPaint { get; set; }

        
        [ForeignKey("Competition")]
        public int IdCompetition { get; set; }

        public int CountPositive { get; set; } = 0;
        public int Place { get; set; }
        public DateTime JoinedAt { get; set; } = DateTime.Now;

        public PaintingModel Painting { get; set; } 
        public CompetitionModel Competition { get; set; }
        public DateTime CreatedAt { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
        public DateTime UpdatedAt { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
    }
}

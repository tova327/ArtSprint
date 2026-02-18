using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Core.models
{
    public class CompetitionModel
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; }
        public string Instructions { get; set; }
		public DateTime CreatedAt { get; set; }
		public DateTime UpdatedAt { get; set; }
		[Required]
        [DataType(DataType.Date)]
        public DateTime GoalDate { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime Deadline { get; set; }

        [ForeignKey("User")]
        public int? WinnerId { get; set; }

        [Required]
        public int CategoryId { get; set; }    

        public UserModel Winner { get; set; }
        public ICollection<CompetitionPaintingModel> CompetitionPaintings { get; set; }
    }
}

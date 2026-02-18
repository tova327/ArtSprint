using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Microsoft.AspNetCore.Http;

namespace Server.Core.models
{
    public class PaintingModel : IHasTimestamps
	{
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("User")]
        public int OwnerId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; }

		public DateTime CreatedAt { get; set; }
		public DateTime UpdatedAt { get; set; }
		public int Likes { get; set; } = 0;

        [Required]
        public string Url { get; set; } = "";

        public bool IsMedal { get; set; } = false;

        [Required]
        
        public int? CategoryId { get; set; }
        [Required]
        //public IFormFile paintingFile { get; set; }
        //art-sprint-bucket/folder1/Untitled-135.pdf

        public UserModel Owner { get; set; }
        public ICollection<CommentModel> Comments { get; set; }
        public CompetitionPaintingModel CompetitionPainting { get; set; }
    }
}

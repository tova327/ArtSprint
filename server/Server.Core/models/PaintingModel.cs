using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Server.Core.models
{
    public class PaintingModel
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("User")]
        public int OwnerId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public int Likes { get; set; } = 0;

        [Required]
        public string Url { get; set; }

        public bool IsMedal { get; set; } = false;

        [Required]
        public ESubject Subject { get; set; }

        public UserModel Owner { get; set; }
        public ICollection<CommentModel> Comments { get; set; }
        public CompetitionPaintingModel CompetitionPainting { get; set; }
    }
}

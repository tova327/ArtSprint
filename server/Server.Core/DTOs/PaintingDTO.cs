using Server.Core.models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Server.Core.DTOs
{
    public class PaintingDTO
    {
        public int Id { get; set; }
        public int OwnerId { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public int Likes { get; set; } = 0;
        public string Url { get; set; } = "";
        public bool IsMedal { get; set; } = false;
        //public IFormFile paintingFile { get; set; }

        public ESubject Subject { get; set; }
       // public UserModel Owner { get; set; }
        public ICollection<CommentDTO> Comments { get; set; }
        public CompetitionPaintingDTO? CompetitionPainting { get; set; }
    }
}

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
    public class CommentDTO
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public int UserId { get; set; }
        public int PaintId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        //public UserModel User { get; set; }
        //public PaintingModel Paint { get; set; }
    }
}

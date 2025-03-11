using Server.Core.models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Core.DTOs
{
    public class UserDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime CameOn { get; set; } = DateTime.Now;
        public DateTime BirthDate { get; set; }

        public bool IsMedal { get; set; } = false;

        public DateTime? LastPaint { get; set; }

        public ICollection<PaintingModel> Paintings { get; set; }
        public ICollection<CommentModel> Comments { get; set; }
    }
}

using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace server.Post_Models
{
    public class CommentPostModel
    {
        public string Content { get; set; }
        public int UserId { get; set; }
        public int PaintId { get; set; }
    }
}

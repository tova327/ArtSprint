using Server.Core.models;
using System.ComponentModel.DataAnnotations;

namespace server.Post_Models
{
    public class PaintingPostModel
    {
        public int OwnerId { get; set; }
        public string Name { get; set; }
        public int CategoryId { get; set; }
        public IFormFile? paintingFile { get; set; }
    }
}

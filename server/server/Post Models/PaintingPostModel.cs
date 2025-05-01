using Server.Core.models;
using System.ComponentModel.DataAnnotations;

namespace server.Post_Models
{
    public class PaintingPostModel
    {
        public int OwnerId { get; set; }
        public string Name { get; set; }
        public ESubject Subject { get; set; }
        public IFormFile paintingFile { get; set; }
    }
}

namespace server.Post_Models
{
    public class CategoryPostModel
    {
		public string Name { get; set; }
		public string? Description { get; set; }
		public int? ParentCategoryId { get; set; }
		public bool IsActive { get; set; } = true;
	}
}

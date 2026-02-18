using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Core.models
{
    public class CategoryModel:IHasTimestamps
    {
		[Key]
		public int Id { get; set; }
		[Required]
		[MaxLength(100)]
		public string Name { get; set; }
		public string? Description { get; set; }
		public int? ParentCategoryId { get; set; }
		public CategoryModel? ParentCategory { get; set; }
		public ICollection<CategoryModel> SubCategories { get; set; }
		public bool IsActive { get; set; }
		public DateTime CreatedAt { get; set; }
		public DateTime UpdatedAt { get; set; }

	}
}

using Server.Core.models;
using Server.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Data.repositories
{
    public class CategoryRepository:GenericRepository<CategoryModel>,ICategoryRepository
    {
		private readonly DataContext _context;

		public CategoryRepository(DataContext context) : base(context)
		{
			_context = context;	
		}
	}
}

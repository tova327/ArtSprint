using Server.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Core.Services
{
	public interface ICategoryService
	{
		Task<IEnumerable<CategoryDTO>> GetAllAsync();
		Task<CategoryDTO?> GetByIdAsync(int id);
		Task<CategoryDTO> AddAsync(CategoryDTO entity);
		Task<CategoryDTO> UpdateAsync(int id, CategoryDTO entity);
		Task DeleteAsync(int id);
		Task<CategoryDTO> TurnOnAsync(int id);
		Task<CategoryDTO> TurnOffAsync(int id);	
	}
}

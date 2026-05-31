using AutoMapper;
using Server.Core.DTOs;
using Server.Core.models;
using Server.Core.Repositories;
using Server.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Service.Services
{
	public class CategoryService : ICategoryService
	{
		private readonly IRepositoryManager _repositoryManager;
		private readonly IMapper _mapper;
		public CategoryService(IRepositoryManager repositoryManager, IMapper mapper)
		{
			_repositoryManager = repositoryManager;
			_mapper = mapper;
		}
		public async Task<CategoryDTO> AddAsync(CategoryDTO entity)
		{
			if (entity == null) throw new ArgumentNullException();
			var categoryModel = _mapper.Map<CategoryModel>(entity);
			var allCategories = await GetAllAsync();
			if (allCategories != null)
			{
				var existCategory = allCategories.FirstOrDefault(c => c.Name.Equals(entity.Name));
				if (existCategory != null)
				{
					throw new InvalidOperationException("Category already exists.");
				}
				
				if (entity.ParentCategoryId != null)
				{
					var parentCategory = await GetByIdAsync(entity.ParentCategoryId ?? -1);
					if (parentCategory == null)
					{
						return null;
					}
					parentCategory.SubCategories.Add(entity);
					await UpdateAsync(parentCategory.Id, parentCategory);
				}
			}
			var category = await _repositoryManager.Categories.AddAsync(categoryModel);
			await _repositoryManager.SaveAsync();
			return _mapper.Map<CategoryDTO?>(category);
		}

        public async Task DeleteAsync(int id)
        {
            var category = await GetByIdAsync(id);

            if (category == null)
                throw new KeyNotFoundException($"Category {id} was not found.");

            // Ensure children are loaded
            var children = category.SubCategories?.ToList() ?? new List<CategoryDTO>();

            // Root category with children cannot be deleted
            if (category.ParentCategoryId == null && children.Any())
                throw new InvalidOperationException("Cannot delete root category that has children.");

            if (children.Any())
            {
                var newParentId = category.ParentCategoryId;

                foreach (var child in children)
                {
                    await UpdateParentAsync(child.Id, newParentId, child);
                }
            }

            await _repositoryManager.Categories.DeleteAsync(category.Id);
            await _repositoryManager.SaveAsync();
        }

        public async Task<IEnumerable<CategoryDTO>> GetAllAsync()
		{
			var categories = await _repositoryManager.Categories.GetAllAsync();

			var categoriesDTOs=_mapper.Map<IEnumerable<CategoryDTO>>(categories);
			return categoriesDTOs;
		}

		public async Task<CategoryDTO> GetByIdAsync(int id)
		{
			var category = await _repositoryManager.Categories.GetByIdAsync(id);

			if (category == null)
				throw new KeyNotFoundException($"Category {id} was not found.");
			return _mapper.Map<CategoryDTO>(category);
		}

		public async Task<CategoryDTO> TurnOffAsync(int id)
		{
			var categoryToTurnOff = await GetByIdAsync(id);

			if (categoryToTurnOff == null)
				throw new KeyNotFoundException($"Category {id} was not found.");

			if (!categoryToTurnOff.IsActive)
				throw new InvalidOperationException($"Category {id} is already dissable.");

			categoryToTurnOff.IsActive = false;

			return await UpdateAsync(id, categoryToTurnOff);
		}

		public async Task<CategoryDTO> TurnOnAsync(int id)
		{
			var categoryToTurnOn = await GetByIdAsync(id);

			if (categoryToTurnOn == null)
				throw new KeyNotFoundException($"Category {id} was not found.");

			if (categoryToTurnOn.IsActive)
				throw new InvalidOperationException($"Category {id} is already active.");

			categoryToTurnOn.IsActive = true;

			return await UpdateAsync(id, categoryToTurnOn);
		}

		public async Task<CategoryDTO> UpdateAsync(int id, CategoryDTO entity)
		{
			var existCategory = await GetByIdAsync(id);
			if (existCategory == null)
				throw new KeyNotFoundException($"Category {id} was not found.");
			existCategory.SubCategories = entity.SubCategories;
			existCategory.Description = entity.Description;
			existCategory.IsActive = entity.IsActive;
			existCategory.Name = entity.Name;
			await UpdateParentAsync(id, entity.ParentCategoryId, existCategory);
			var finalCategory = await _repositoryManager.Categories.UpdateAsync(id, _mapper.Map<CategoryModel>(existCategory));
			await _repositoryManager.SaveAsync();
			return _mapper.Map<CategoryDTO>(finalCategory);

		}
		private async Task UpdateParentAsync(int id, int? newParentId, CategoryDTO existEntity)
		{
			if (newParentId == existEntity.ParentCategoryId)
				return;
			var parentCategory = await GetByIdAsync(existEntity.ParentCategoryId ?? -1);
			if (parentCategory != null)
			{
				parentCategory.SubCategories.Remove(existEntity);
				await UpdateAsync(id, parentCategory);
			}
			
			existEntity.ParentCategoryId = newParentId;
			var newParentCategory = await GetByIdAsync(existEntity.ParentCategoryId ?? -1);
			if (newParentCategory == null)
			{
				existEntity.ParentCategoryId = null;

			}
			else
			{
				newParentCategory.SubCategories.Add(existEntity);
				await UpdateAsync(id, newParentCategory);
			}
		}
	}
}

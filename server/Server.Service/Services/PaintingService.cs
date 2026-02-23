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
    public class PaintingService : IPaintingService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        public PaintingService(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }

        public async Task<IEnumerable<PaintingDTO>> GetAllAsync()
        {
            var paintings = await _repositoryManager.Paintings.GetAllAsync();
            var paintingsList= paintings.ToList();
            var res=new List<PaintingDTO>();
            foreach (var painting in paintingsList)
            {
                res.Add(_mapper.Map<PaintingDTO>(painting));
            }
            return res;
        }

        public async Task<PaintingDTO?> GetByIdAsync(int id)
        {
            var painting = await _repositoryManager.Paintings.GetByIdAsync(id);
            return _mapper.Map<PaintingDTO>(painting);
        }

        public async Task<PaintingDTO> AddAsync(PaintingDTO entity)
        {
            var allPaintings=await GetAllAsync();
            var existPainting=allPaintings.FirstOrDefault(p=>p.Name.Equals(entity.Name)&&p.OwnerId==entity.OwnerId);
            if (existPainting != null)
                return null;
            if(entity.CreatedAt == default)
                entity.CreatedAt = DateTime.UtcNow; 
            var category = await _repositoryManager.Categories.GetByIdAsync(entity.CategoryId);
            if(category==null)
                return null;
			var paintingModel = _mapper.Map<PaintingModel>(entity);
            var painting = await _repositoryManager.Paintings.AddAsync(paintingModel);
            await _repositoryManager.SaveAsync();
            return _mapper.Map<PaintingDTO>(painting);
        }

        public async Task<PaintingDTO> UpdateAsync(int id, PaintingDTO entity)
        {
            var paintingModel = _mapper.Map<PaintingModel>(entity);
            var painting = await _repositoryManager.Paintings.UpdateAsync(id, paintingModel);
            await _repositoryManager.SaveAsync();
            return _mapper.Map<PaintingDTO>(painting);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var paintingToDelete=await GetByIdAsync(id);
            if (paintingToDelete == null)
                return false;
            
            await _repositoryManager.Paintings.DeleteAsync(id);
            await _repositoryManager.SaveAsync();
            return true;
        }

        public async Task<bool> AddLikeAsync(int id,int count)
        {
            if (count < 0 || count > 10)
                return false;
           var res= await _repositoryManager.Paintings.AddLikeAsync(id,count);
            if(!res)
                return false;
            await _repositoryManager.SaveAsync();
            return true;
        }

        public async Task<IEnumerable<PaintingDTO>> GetAllFromDateToDateAsync(DateTime startDate, DateTime endDate)
        {
            var paintings = await _repositoryManager.Paintings.GetAllFromDateToDateAsync(startDate, endDate);
            var paintingsList=paintings.ToList();
            return _mapper.Map<List<PaintingDTO>>(paintingsList);   
        }
    }
}

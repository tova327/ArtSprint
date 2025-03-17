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
            return _mapper.Map<List<PaintingDTO>>(paintingsList);
        }

        public async Task<PaintingDTO?> GetByIdAsync(int id)
        {
            var painting = await _repositoryManager.Paintings.GetByIdAsync(id);
            return _mapper.Map<PaintingDTO>(painting);
        }

        public async Task<PaintingDTO> AddAsync(PaintingDTO entity)
        {
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

        public async Task DeleteAsync(int id)
        {
            await _repositoryManager.Paintings.DeleteAsync(id);
            await _repositoryManager.SaveAsync();
        }

        public async Task AddLikeAsync(int id)
        {
            await _repositoryManager.Paintings.AddLikeAsync(id);
            await _repositoryManager.SaveAsync();
        }

        public async Task<IEnumerable<PaintingDTO>> GetAllFromDateToDateAsync(DateTime startDate, DateTime endDate)
        {
            var paintings = await _repositoryManager.Paintings.GetAllFromDateToDateAsync(startDate, endDate);
            var paintingsList=paintings.ToList();
            return _mapper.Map<List<PaintingDTO>>(paintingsList);   
        }
    }
}

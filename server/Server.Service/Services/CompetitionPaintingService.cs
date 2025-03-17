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
    public class CompetitionPaintingService : ICompetitionPaintingService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        public CompetitionPaintingService(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CompetitionPaintingDTO>> GetAllAsync()
        {
            var competitionPaintings = await _repositoryManager.CompetitionPaintings.GetAllAsync();
            var competitionPaintingsList=competitionPaintings.ToList();
            return _mapper.Map<List<CompetitionPaintingDTO>>(competitionPaintingsList);
        }

        public async Task<CompetitionPaintingDTO?> GetByIdAsync(int id)
        {
            var competitionPainting = await _repositoryManager.CompetitionPaintings.GetByIdAsync(id);
            return _mapper.Map<CompetitionPaintingDTO>(competitionPainting);
        }

        public async Task<CompetitionPaintingDTO> AddAsync(CompetitionPaintingDTO entity)
        {
            var competitionPaintingModel = _mapper.Map<CompetitionPaintingModel>(entity);
            var competitionPainting = await _repositoryManager.CompetitionPaintings.AddAsync(competitionPaintingModel);
            await _repositoryManager.SaveAsync();
            return _mapper.Map<CompetitionPaintingDTO>(competitionPainting);
        }

        public async Task<CompetitionPaintingDTO> UpdateAsync(int id, CompetitionPaintingDTO entity)
        {
            var competitionPaintingModel = _mapper.Map<CompetitionPaintingModel>(entity);
            var competitionPainting = await _repositoryManager.CompetitionPaintings.UpdateAsync(id, competitionPaintingModel);
            await _repositoryManager.SaveAsync();
            return _mapper.Map<CompetitionPaintingDTO>(competitionPainting);
        }

        public async Task DeleteAsync(int id)
        {
            await _repositoryManager.CompetitionPaintings.DeleteAsync(id);
            await _repositoryManager.SaveAsync();
        }
    }
}

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
    public class CompetitionService : ICompetitionService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        public CompetitionService(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CompetitionModel>> GetAllAsync()
        {
            var competitions = await _repositoryManager.Competitions.GetAllAsync();
            return competitions.ToList();
        }

        public async Task<CompetitionDTO?> GetByIdAsync(int id)
        {
            var competition = await _repositoryManager.Competitions.GetByIdAsync(id);
            return _mapper.Map<CompetitionDTO>(competition);
        }

        public async Task<CompetitionDTO> AddAsync(CompetitionDTO entity)
        {
            var competitionModel = _mapper.Map<CompetitionModel>(entity);
            var competition = await _repositoryManager.Competitions.AddAsync(competitionModel);
            await _repositoryManager.SaveAsync();
            return _mapper.Map<CompetitionDTO>(competition);
        }

        public async Task<CompetitionDTO> UpdateAsync(int id, CompetitionDTO entity)
        {
            var competitionModel = _mapper.Map<CompetitionModel>(entity);
            var competition = await _repositoryManager.Competitions.UpdateAsync(id, competitionModel);
            await _repositoryManager.SaveAsync();
            return _mapper.Map<CompetitionDTO>(competition);
        }

        public async Task DeleteAsync(int id)
        {
            await _repositoryManager.Competitions.DeleteAsync(id);
            await _repositoryManager.SaveAsync();
        }

        public async Task<CompetitionDTO> GetCompetitionDetailsBySubjectAsync(ESubject subject)
        {
            var competition = await _repositoryManager.Competitions.GetCompetitionDetailsBySubjectAsync(subject);
            return _mapper.Map<CompetitionDTO>(competition);
        }

        public async Task<CompetitionDTO> GetLastCompetitionAsync()
        {
            var competition = await _repositoryManager.Competitions.GetLastCompetitionAsync();
            return _mapper.Map<CompetitionDTO>(competition);
        }
    }
}

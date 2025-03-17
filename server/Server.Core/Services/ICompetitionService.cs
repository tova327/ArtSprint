using Server.Core.DTOs;
using Server.Core.models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Core.Services
{
    public interface ICompetitionService
    {
        Task<IEnumerable<CompetitionModel>> GetAllAsync();
        Task<CompetitionDTO?> GetByIdAsync(int id);
        Task<CompetitionDTO> AddAsync(CompetitionDTO entity);
        Task<CompetitionDTO> UpdateAsync(int id, CompetitionDTO entity);
        Task DeleteAsync(int id);

        Task<CompetitionDTO> GetCompetitionDetailsBySubjectAsync(ESubject subject);
        Task<CompetitionDTO> GetLastCompetitionAsync();
    }
}

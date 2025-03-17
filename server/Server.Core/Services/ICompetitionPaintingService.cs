using Server.Core.DTOs;
using Server.Core.models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Core.Services
{
    public interface ICompetitionPaintingService
    {
        Task<IEnumerable<CompetitionPaintingDTO>> GetAllAsync();
        Task<CompetitionPaintingDTO?> GetByIdAsync(int id);
        Task<CompetitionPaintingDTO> AddAsync(CompetitionPaintingDTO entity);
        Task<CompetitionPaintingDTO> UpdateAsync(int id, CompetitionPaintingDTO entity);
        Task DeleteAsync(int id);
    }
}

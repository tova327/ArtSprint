using Server.Core.DTOs;
using Server.Core.models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Core.Services
{
    public interface IPaintingService
    {
        Task<IEnumerable<PaintingDTO>> GetAllAsync();
        Task<PaintingDTO?> GetByIdAsync(int id);
        Task<PaintingDTO> AddAsync(PaintingDTO entity);
        Task<PaintingDTO> UpdateAsync(int id, PaintingDTO entity);
        Task<bool> DeleteAsync(int id);

        Task<bool> AddLikeAsync(int id,int count);
        Task<IEnumerable<PaintingDTO>> GetAllFromDateToDateAsync(DateTime startDate, DateTime endDate);
    }
}

using Server.Core.models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Core.Repositories
{
    public interface IPaintingRepository:IRepository<PaintingModel>
    {
        Task<bool> AddLikeAsync(int id,int count);
        Task<IEnumerable<PaintingModel>> GetAllFromDateToDateAsync(DateTime startDate, DateTime endDate);
    }
}

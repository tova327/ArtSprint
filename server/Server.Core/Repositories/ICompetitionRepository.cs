using Server.Core.models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Core.Repositories
{
    public interface ICompetitionRepository:IRepository<CompetitionModel>
    {
         Task<CompetitionModel> GetCompetitionDetailsBySubjectAsync(int CategoryId);   
        Task<CompetitionModel> GetLastCompetitionAsync();
    }
}

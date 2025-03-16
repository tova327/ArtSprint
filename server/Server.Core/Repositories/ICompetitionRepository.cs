using Server.Core.models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Core.Repositories
{
    public interface ICompetitionRepository
    {
         Task<CompetitionModel> GetCompetitionDetailsBySubjectAsync(ESubject subject);
        Task<CompetitionModel> GetLastCompetitionAsync();
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Core.Repositories
{
    public interface IRepositoryManager
    {
        IUserRepository Users { get; }
        ICompetitionRepository Competitions { get; }
        ICompetitionPaintingRepository CompetitionPaintings { get; }
        ICommentRepository Comments { get; }
        IPaintingRepository Paintings { get; } 
        ICategoryRepository Categories { get; }

        Task SaveAsync();
    }
}

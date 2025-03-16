using Server.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Data.repositories
{
    public class RepositoryManager:IRepositoryManager
    {
        private readonly IDataContext _context;

        IUserRepository Users { get; }
        ICompetitionRepository Competitions { get; }
        ICompetitionPaintingRepository CompetitionPaintings { get; }
        ICommentRepository Comments { get; }
        IPaintingRepository Paintings { get; }

        public RepositoryManager(
            IDataContext context,
            IUserRepository userRepository,
           
        ICompetitionRepository competitionsRepository,
        ICompetitionPaintingRepository competitionPaintingRepository,
        ICommentRepository commentsRepository,
        IPaintingRepository paintingsRepository)    
        {
            _context = context;
            Users = userRepository;
            Competitions = competitionsRepository;
            Paintings = paintingsRepository;
            Comments = commentsRepository;
            CompetitionPaintings= competitionPaintingRepository;
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}

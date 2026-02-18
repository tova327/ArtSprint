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

        public IUserRepository Users { get; }
        public ICompetitionRepository Competitions { get; }
        public ICompetitionPaintingRepository CompetitionPaintings { get; }
        public ICommentRepository Comments { get; }
        public IPaintingRepository Paintings { get; }
        public ICategoryRepository Categories { get; }

        public RepositoryManager(
            IDataContext context,
            IUserRepository userRepository,
           
        ICompetitionRepository competitionsRepository,
        ICompetitionPaintingRepository competitionPaintingRepository,
        ICommentRepository commentsRepository,
        IPaintingRepository paintingsRepository,
        ICategoryRepository categoryRepository)    
        {
            _context = context;
            Users = userRepository;
            Competitions = competitionsRepository;
            Paintings = paintingsRepository;
            Comments = commentsRepository;
            CompetitionPaintings= competitionPaintingRepository;
            Categories = categoryRepository;
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}

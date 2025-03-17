using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Server.Core.models;
using Server.Core.Repositories;
using Server.Data.repositories;

public class CompetitionRepository:GenericRepository<CompetitionModel>,ICompetitionRepository
{
    private readonly DataContext _context;

    public CompetitionRepository(DataContext context):base(context)
    {
        _context = context;
        
    }
    public async Task<CompetitionModel> GetCompetitionDetailsBySubjectAsync(ESubject subject)
    {
        return await _context.Competitions
            .OrderByDescending(c => c.CreatedAt)
            .Where(c => c.Subject == subject)
            .FirstOrDefaultAsync();
    }
    public async Task<CompetitionModel> GetLastCompetitionAsync()
    {
        return await _context.Competitions
            .OrderByDescending(c => c.CreatedAt)
            .FirstOrDefaultAsync();
    }
    
}
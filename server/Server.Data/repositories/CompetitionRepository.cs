using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Server.Core.models;

public class CompetitionRepository
{
    private readonly DataContext _context;

    public CompetitionRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CompetitionModel>> GetAllCompetitionsAsync()
    {
        return await _context.Competitions.ToListAsync();
    }

    public async Task<CompetitionModel> GetCompetitionDetailsBySubjectAsync(ESubject subject)
    {
        return await _context.Competitions
            .Where(c => c.Subject == subject)
            .FirstOrDefaultAsync();
    }

    public async Task<CompetitionModel> GetCompetitionByIdAsync(int id)
    {
        return await _context.Competitions.FindAsync(id);
    }

    public async Task<CompetitionModel> GetLastCompetitionAsync()
    {
        return await _context.Competitions
            .OrderByDescending(c => c.CreatedAt)
            .FirstOrDefaultAsync();
    }

    public async Task CreateCompetitionAsync(CompetitionModel competition)
    {
        await _context.Competitions.AddAsync(competition);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateCompetitionAsync(CompetitionModel competition)
    {
        _context.Competitions.Update(competition);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteCompetitionAsync(int id)
    {
        var competition = await _context.Competitions.FindAsync(id);
        if (competition != null)
        {
            _context.Competitions.Remove(competition);
            await _context.SaveChangesAsync();
        }
    }
}
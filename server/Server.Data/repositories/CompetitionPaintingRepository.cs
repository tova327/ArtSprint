using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Server.Core.models;

public class CompetitionPaintingRepository
{
    private readonly DataContext _context;

    public CompetitionPaintingRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CompetitionPaintingModel>> GetAllCompetitionPaintingsAsync()
    {
        return await _context.CompetitionPaintings.ToListAsync();
    }

    public async Task<CompetitionPaintingModel> GetCompetitionPaintingByIdAsync(int idPaint, int idCompetition)
    {
        return await _context.CompetitionPaintings
            .Where(cp => cp.IdPaint == idPaint && cp.IdCompetition == idCompetition)
            .FirstOrDefaultAsync();
    }

    public async Task AddCompetitionPaintingAsync(CompetitionPaintingModel competitionPainting)
    {
        await _context.CompetitionPaintings.AddAsync(competitionPainting);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateCompetitionPaintingAsync(CompetitionPaintingModel competitionPainting)
    {
        _context.CompetitionPaintings.Update(competitionPainting);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteCompetitionPaintingAsync(int idPaint, int idCompetition)
    {
        var competitionPainting = await _context.CompetitionPaintings
            .Where(cp => cp.IdPaint == idPaint && cp.IdCompetition == idCompetition)
            .FirstOrDefaultAsync();
        if (competitionPainting != null)
        {
            _context.CompetitionPaintings.Remove(competitionPainting);
            await _context.SaveChangesAsync();
        }
    }
}
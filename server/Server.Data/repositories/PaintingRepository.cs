using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Server.Core.models;

public class PaintingRepository
{
    private readonly DataContext _context;

    public PaintingRepository(DataContext context)
    {
        _context = context;
    }

    public async Task CreatePaintingAsync(PaintingModel painting)
    {
        await _context.Paintings.AddAsync(painting);
        await _context.SaveChangesAsync();
    }

    public async Task AddLikeAsync(int id)
    {
        var painting = await _context.Paintings.FindAsync(id);
        if (painting != null)
        {
            painting.Likes++;
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeletePaintingAsync(int id)
    {
        var painting = await _context.Paintings.FindAsync(id);
        if (painting != null)
        {
            _context.Paintings.Remove(painting);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<PaintingModel>> GetAllFromDateToDateAsync(DateTime startDate, DateTime endDate)
    {
        return await _context.Paintings
            .Where(p => p.CreatedAt >= startDate && p.CreatedAt <= endDate)
            .ToListAsync();
    }

    public async Task<PaintingModel> GetPaintingByIdAsync(int id)
    {
        return await _context.Paintings.FindAsync(id);
    }
}
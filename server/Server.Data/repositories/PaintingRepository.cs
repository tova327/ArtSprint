using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Server.Core.models;
using Server.Core.Repositories;
using Server.Data.repositories;

public class PaintingRepository:GenericRepository<PaintingModel>, IPaintingRepository
{
    private readonly DataContext _context;

    public PaintingRepository(DataContext context):base(context)
    {
        _context = context;
    }

    

    public async Task<bool> AddLikeAsync(int id,int count)
    {
        var painting = await _context.Paintings.FindAsync(id);
        if (painting != null)
        {
            painting.Likes+=count;
            await _context.SaveChangesAsync();
            return true;
        }
        return false;
    }

    

    public async Task<IEnumerable<PaintingModel>> GetAllFromDateToDateAsync(DateTime startDate, DateTime endDate)
    {
        return await _context.Paintings
            .Where(p => p.CreatedAt >= startDate && p.CreatedAt <= endDate)
            .ToListAsync();
    }

    
}
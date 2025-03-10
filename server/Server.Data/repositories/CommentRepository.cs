using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Server.Core.models;

public class CommentRepository
{
    private readonly DataContext _context;

    public CommentRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CommentModel>> GetAllCommentsAsync()
    {
        return await _context.Comments.ToListAsync();
    }

    public async Task<CommentModel> GetCommentByIdAsync(int id)
    {
        return await _context.Comments.FindAsync(id);
    }

    public async Task AddCommentAsync(CommentModel comment)
    {
        await _context.Comments.AddAsync(comment);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateCommentAsync(CommentModel comment)
    {
        _context.Comments.Update(comment);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteCommentAsync(int id)
    {
        var comment = await _context.Comments.FindAsync(id);
        if (comment != null)
        {
            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();
        }
    }
}

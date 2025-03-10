using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Server.Core.models;

public class UserRepository
{
    private readonly DataContext _context;

    public UserRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<UserModel>> GetAllUsersAsync()
    {
        return await _context.Users.ToListAsync();
    }

    public async Task<UserModel> GetUserDetailsByIdAsync(int id)
    {
        return await _context.Users
            .Where(u => u.Id == id)
            .Select(u => new UserModel
            {
                Id = u.Id,
                Name = u.Name,
                IsMedal = u.IsMedal
            })
            .FirstOrDefaultAsync();
    }

    public async Task<UserModel> GetUserByIdAsync(int id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task AddUserAsync(UserModel user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateUserNameAsync(int id, string name)
    {
        var user = await _context.Users.FindAsync(id);
        if (user != null)
        {
            user.Name = name;
            await _context.SaveChangesAsync();
        }
    }

    public async Task UpdateUserCameOnAsync(int id, DateTime cameOn)
    {
        var user = await _context.Users.FindAsync(id);
        if (user != null)
        {
            user.CameOn = cameOn;
            await _context.SaveChangesAsync();
        }
    }

    public async Task UpdateUserIsMedalAsync(int id, bool isMedal)
    {
        var user = await _context.Users.FindAsync(id);
        if (user != null)
        {
            user.IsMedal = isMedal;
            await _context.SaveChangesAsync();
        }
    }

    public async Task UpdateUserLastPaintAsync(int id, DateTime? lastPaint)
    {
        var user = await _context.Users.FindAsync(id);
        if (user != null)
        {
            user.LastPaint = lastPaint;
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteUserAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user != null)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }
    }
}
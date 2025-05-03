using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Server.Core.models;
using Server.Core.Repositories;
using Server.Data.repositories;

public class UserRepository:GenericRepository<UserModel> , IUserRepository
{
    private readonly DataContext _context;

    public UserRepository(DataContext context):base(context)
    {
        _context = context;
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
    public override async Task<UserModel> UpdateAsync(int id, UserModel entity)
    { 
        await UpdateUserCameOnAsync(id, entity.CameOn);
        await UpdateUserIsMedalAsync(id, entity.IsMedal);
        await UpdateUserLastPaintAsync(id, entity.LastPaint);
        await UpdateUserNameAsync(id, entity.Name);
        return entity;
    }

    public async Task<UserModel> GetUserByUsername(string username)
    {
        return await _context.Users.SingleOrDefaultAsync(u => u.Name.Equals(username));
    }
}